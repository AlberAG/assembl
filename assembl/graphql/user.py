import os

import graphene
from graphene.relay import Node
from graphene_sqlalchemy import SQLAlchemyObjectType
from pyramid.httpexceptions import HTTPUnauthorized
from pyramid.i18n import TranslationStringFactory

from assembl import models
from assembl.auth import CrudPermissions
from assembl.auth import Everyone, P_SYSADMIN, P_ADMIN_DISC
from assembl.auth.util import get_permissions
from .document import Document
from .langstring import LangStringEntry, LangStringEntryInput, resolve_langstring, resolve_langstring_entries, langstring_from_input_entries, update_langstring_from_input_entries
from .permissions_helpers import require_cls_permission, require_instance_permission
from .types import SecureObjectType
from .utils import DateTime, abort_transaction_on_exception


_ = TranslationStringFactory('assembl')


class AgentProfile(SecureObjectType, SQLAlchemyObjectType):
    class Meta:
        model = models.AgentProfile
        interfaces = (Node, )
        only_fields = ('id', )

    user_id = graphene.Int(required=True)
    name = graphene.String()
    username = graphene.String()
    display_name = graphene.String()
    email = graphene.String()
    image = graphene.Field(Document)
    creation_date = DateTime()  # creation_date only exists on User, not AgentProfile
    has_password = graphene.Boolean()

    def resolve_user_id(self, args, context, info):
        return self.id

    def resolve_name(self, args, context, info):
        return self.real_name()

    def resolve_username(self, args, context, info):
        if self.username:
            return self.username.username

    def resolve_display_name(self, args, context, info):
        return self.display_name()

    def resolve_email(self, args, context, info):
        user_id = context.authenticated_userid or Everyone
        discussion_id = context.matchdict['discussion_id']
        permissions = get_permissions(user_id, discussion_id)
        include_emails = P_ADMIN_DISC in permissions or P_SYSADMIN in permissions
        if include_emails or self.id == user_id:
            return self.get_preferred_email()

    def resolve_image(self, args, context, info):
        PROFILE_PICTURE = models.AttachmentPurpose.PROFILE_PICTURE.value
        for attachment in self.profile_attachments:
            if attachment.attachmentPurpose == PROFILE_PICTURE:
                return attachment.document

    def resolve_has_password(self, args, context, info):
        return self.password is not None


class UpdateUser(graphene.Mutation):
    class Input:
        id = graphene.ID(required=True)
        name = graphene.String()
        username = graphene.String()
        # this is the identifier of the part in a multipart POST
        image = graphene.String()
        old_password = graphene.String()
        new_password = graphene.String()
        new_password2 = graphene.String()

    user = graphene.Field(lambda: AgentProfile)

    @staticmethod
    @abort_transaction_on_exception
    def mutate(root, args, context, info):
        PROFILE_PICTURE = models.AttachmentPurpose.PROFILE_PICTURE.value
        cls = models.User
        discussion_id = context.matchdict['discussion_id']
        discussion = models.Discussion.get(discussion_id)
        user_id = context.authenticated_userid or Everyone

        global_id = args.get('id')
        id_ = int(Node.from_global_id(global_id)[1])
        user = cls.get(id_)

        permissions = get_permissions(user_id, discussion_id)
        allowed = user.user_can(
            user_id, CrudPermissions.UPDATE, permissions)
        if not allowed:
            raise HTTPUnauthorized("The authenticated user can't update this user")

        with cls.default_db.no_autoflush as db:
            username = args.get('username')
            if username and username != user.username_p:
                if db.query(models.Username).filter_by(
                    username=username
                ).count():
                    raise Exception(u"001: We already have a user with this username.")

            user.username_p = username
            name = args.get('name')
            # only modify the name if it was given in parameter
            if name is not None:
                user.real_name_p = name

            old_password = args.get('old_password')
            new_password = args.get('new_password')
            new_password2 = args.get('new_password2')
            # only modify the password if it was given in parameter
            if old_password is not None and new_password is not None and new_password2 is not None:
                if not user.check_password(old_password):
                    raise Exception(u"002: The entered password doesn't match your current password.")

                if new_password != new_password2:
                    raise Exception(u"003: You entered two different passwords.")

                if old_password == new_password:
                    raise Exception(u"004: The new password has to be different than the current password.")

                from ..auth.password import verify_password
                for p in user.old_passwords:
                    if verify_password(new_password, p.password):
                        raise Exception(u"005: The new password has to be different than the last 5 passwords you set.")

                user.password_p = new_password

            # add uploaded image as an attachment to the user
            image = args.get('image')
            if image is not None:
                filename = os.path.basename(context.POST[image].filename)
                mime_type = context.POST[image].type
                document = models.File(
                    discussion=discussion,
                    mime_type=mime_type,
                    title=filename)
                document.add_file_data(context.POST[image].file)
                # if there is already an PROFILE_PICTURE, remove it with the
                # associated document
                images = [
                    att for att in user.profile_attachments
                    if att.attachmentPurpose == PROFILE_PICTURE]
                if images:
                    image = images[0]
                    allowed = image.user_can(
                        user_id, CrudPermissions.DELETE, permissions)
                    if not allowed:
                        raise HTTPUnauthorized("The authenticated user can't delete the existing AgentProfileAttachment")

                    image.document.delete_file()
                    db.delete(image.document)
                    user.profile_attachments.remove(image)

                allowed = models.AgentProfileAttachment.user_can_cls(
                    user_id, CrudPermissions.CREATE, permissions)
                if not allowed:
                    raise HTTPUnauthorized("The authenticated user can't create an AgentProfileAttachment")

                discussion.db.add(models.AgentProfileAttachment(
                    document=document,
                    discussion=discussion,
                    user=user,
                    creator_id=context.authenticated_userid,
                    title=filename,
                    attachmentPurpose=PROFILE_PICTURE
                ))

            db.flush()

        return UpdateUser(user=user)


class TextField(SecureObjectType, SQLAlchemyObjectType):
    class Meta:
        model = models.TextField
        interfaces = (Node, )
        only_fields = ('field_type', 'id', 'order', 'required')

    title = graphene.String(lang=graphene.String())
    title_entries = graphene.List(LangStringEntry)

    def resolve_title(self, args, context, info):
        return resolve_langstring(self.title, args.get('lang'))

    def resolve_title_entries(self, args, context, info):
        return resolve_langstring_entries(self, 'title')


class CreateTextField(graphene.Mutation):
    class Input:
        lang = graphene.String()
        title_entries = graphene.List(LangStringEntryInput, required=True)
        order = graphene.Float()
        required = graphene.Boolean()

    text_field = graphene.Field(lambda: TextField)

    @staticmethod
    @abort_transaction_on_exception
    def mutate(root, args, context, info):
        cls = models.TextField
        require_cls_permission(CrudPermissions.CREATE, cls, context)
        discussion_id = context.matchdict['discussion_id']
        with cls.default_db.no_autoflush as db:
            title_entries = args.get('title_entries')
            if len(title_entries) == 0:
                raise Exception(
                    'TextField titleEntries needs at least one entry')
                # Better to have this message than
                # 'NoneType' object has no attribute 'owner_object'
                # when creating the saobj below if title=None

            title_langstring = langstring_from_input_entries(title_entries)

            saobj = cls(
                discussion_id=discussion_id,
                title=title_langstring,
                order=args.get('order'),
                required=args.get('required'))
            db.add(saobj)
            db.flush()

        return CreateTextField(text_field=saobj)


class UpdateTextField(graphene.Mutation):
    class Input:
        id = graphene.ID(required=True)
        lang = graphene.String(required=True)
        title_entries = graphene.List(LangStringEntryInput, required=True)
        order = graphene.Float(required=True)
        required = graphene.Boolean(required=True)

    text_field = graphene.Field(lambda: TextField)

    @staticmethod
    @abort_transaction_on_exception
    def mutate(root, args, context, info):
        cls = models.TextField
        text_field_id = args.get('id')
        text_field_id = int(Node.from_global_id(text_field_id)[1])
        text_field = cls.get(text_field_id)
        require_instance_permission(CrudPermissions.UPDATE, text_field, context)
        with cls.default_db.no_autoflush as db:
            title_entries = args.get('title_entries')
            if len(title_entries) == 0:
                raise Exception(
                    'TextField titleEntries needs at least one entry')
                # Better to have this message than
                # 'NoneType' object has no attribute 'owner_object'
                # when creating the saobj below if title=None

            update_langstring_from_input_entries(text_field, 'title', title_entries)
            text_field.order = args['order']
            text_field.required = args['required']
            db.flush()

        return UpdateTextField(text_field=text_field)


class DeleteTextField(graphene.Mutation):

    class Input:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @staticmethod
    @abort_transaction_on_exception
    def mutate(root, args, context, info):
        cls = models.TextField
        text_field_id = args.get('id')
        text_field_id = int(Node.from_global_id(text_field_id)[1])
        text_field = models.TextField.get(text_field_id)
        require_instance_permission(CrudPermissions.DELETE, text_field, context)
        with cls.default_db.no_autoflush as db:
            db.query(models.ProfileTextField).filter(
                models.ProfileTextField.text_field_id == text_field_id).delete()
            db.flush()
            db.delete(text_field)
            db.flush()

        return DeleteTextField(success=True)


class ProfileField(SecureObjectType, SQLAlchemyObjectType):
    class Meta:
        model = models.ProfileTextField
        interfaces = (Node, )
        only_fields = ('id', 'value')

    agent_profile = graphene.Field(lambda: AgentProfile)
    text_field = graphene.Field(lambda: TextField)

    def resolve_id(self, args, context, info):
        if self.id < 0:
            # this is a temporary object we created manually in resolve_profile_fields
            return self.id
        else:
            # this is a SQLAlchemy object
            # we can't use super here, so we just copy/paste resolve_id method from SQLAlchemyObjectType class
            from graphene.relay import is_node
            graphene_type = info.parent_type.graphene_type
            if is_node(graphene_type):
                return self.__mapper__.primary_key_from_instance(self)[0]
            return getattr(self, graphene_type._meta.id, None)

# -*- coding=utf-8 -*-
import os.path

import graphene
from graphene.relay import Node
from graphene_sqlalchemy import SQLAlchemyObjectType

from assembl import models
from assembl.auth import CrudPermissions
from .document import Document
from .langstring import LangStringEntry, LangStringEntryInput, resolve_langstring, resolve_langstring_entries, langstring_from_input_entries, update_langstring_from_input_entries
from .permissions_helpers import require_cls_permission, require_instance_permission
from .types import SecureObjectType
from .utils import DateTime, abort_transaction_on_exception


class DiscussionPhase(SecureObjectType, SQLAlchemyObjectType):

    class Meta:
        model = models.DiscussionPhase
        interfaces = (Node, )
        only_fields = ('id',)

    identifier = graphene.String()
    is_thematics_table = graphene.Boolean()
    title = graphene.String(lang=graphene.String())
    title_entries = graphene.List(LangStringEntry)
    description = graphene.String(lang=graphene.String())
    description_entries = graphene.List(LangStringEntry)
    start = DateTime()
    end = DateTime()
    image = graphene.Field(Document)
    order = graphene.Float()

    def resolve_title(self, args, context, info):
        return resolve_langstring(self.title, args.get('lang'))

    def resolve_title_entries(self, args, context, info):
        return resolve_langstring_entries(self, 'title')

    def resolve_description(self, args, context, info):
        return resolve_langstring(self.description, args.get('lang'))

    def resolve_description_entries(self, args, context, info):
        return resolve_langstring_entries(self, 'description')

    def resolve_image(self, args, context, info):
        if self.attachments:
            return self.attachments[0].document


class CreateDiscussionPhase(graphene.Mutation):
    class Input:
        lang = graphene.String(required=True)
        identifier = graphene.String(required=True)
        is_thematics_table = graphene.Boolean()
        title_entries = graphene.List(LangStringEntryInput, required=True)
        start = DateTime(required=True)
        end = DateTime(required=True)
        order = graphene.Float(required=True)

    discussion_phase = graphene.Field(lambda: DiscussionPhase)

    @staticmethod
    @abort_transaction_on_exception
    def mutate(root, args, context, info):
        cls = models.DiscussionPhase
        require_cls_permission(CrudPermissions.CREATE, cls, context)
        discussion_id = context.matchdict['discussion_id']
        with cls.default_db.no_autoflush as db:
            title_entries = args.get('title_entries')
            if len(title_entries) == 0:
                raise Exception(
                    'DiscussionPhase titleEntries needs at least one entry')

            title_langstring = langstring_from_input_entries(title_entries)
            saobj = cls(
                discussion_id=discussion_id,
                identifier=args.get('identifier'),
                is_thematics_table=args.get('is_thematics_table'),
                title=title_langstring,
                start=args.get('start'),
                end=args.get('end'),
                order=args.get('order'))

            db.add(saobj)
            db.flush()

        return CreateDiscussionPhase(discussion_phase=saobj)


class UpdateDiscussionPhase(graphene.Mutation):
    class Input:
        id = graphene.ID(required=True)
        is_thematics_table = graphene.Boolean()
        lang = graphene.String(required=True)
        identifier = graphene.String(required=True)
        title_entries = graphene.List(LangStringEntryInput, required=True)
        description_entries = graphene.List(LangStringEntryInput, required=False)
        start = DateTime(required=True)
        end = DateTime(required=True)
        image = graphene.String()
        order = graphene.Float(required=True)

    discussion_phase = graphene.Field(lambda: DiscussionPhase)

    @staticmethod
    @abort_transaction_on_exception
    def mutate(root, args, context, info):
        cls = models.DiscussionPhase
        phase_id = args.get('id')
        phase_id = int(Node.from_global_id(phase_id)[1])
        phase = cls.get(phase_id)
        require_instance_permission(CrudPermissions.UPDATE, phase, context)
        with cls.default_db.no_autoflush as db:
            title_entries = args.get('title_entries')
            if len(title_entries) == 0:
                raise Exception(
                    'DiscussionPhase titleEntries needs at least one entry')

            update_langstring_from_input_entries(phase, 'title', title_entries)
            description_entries = args.get('description_entries')
            if description_entries is not None:
                update_langstring_from_input_entries(phase, 'description', description_entries)

            phase.identifier = args.get('identifier')
            phase.is_thematics_table = args.get('is_thematics_table')
            # SQLAlchemy wants naive datetimes
            phase.start = args.get('start').replace(tzinfo=None)
            phase.end = args.get('end').replace(tzinfo=None)
            phase.order = args.get('order')
            image = args.get('image')
            discussion_id = context.matchdict['discussion_id']
            discussion = models.Discussion.get(discussion_id)
            if image is not None:
                if image == 'TO_DELETE' and phase.attachments:
                    # delete the image
                    attachment = phase.attachments[0]
                    attachment.document.delete_file()
                    db.delete(attachment.document)
                    db.delete(attachment)
                    phase.attachments.remove(attachment)
                else:
                    filename = os.path.basename(context.POST[image].filename)
                    mime_type = context.POST[image].type
                    document = models.File(
                        discussion=discussion,
                        mime_type=mime_type,
                        title=filename)
                    document.add_file_data(context.POST[image].file)
                    # if there is already an attachment, remove it with the
                    # associated document (image)
                    if phase.attachments:
                        for attachment in phase.attachments[:]:
                            attachment.document.delete_file()
                            db.delete(attachment.document)
                            phase.attachments.remove(attachment)

                    models.TimelineEventAttachment(
                        document=document,
                        discussion=discussion,
                        creator_id=context.authenticated_userid,
                        title=filename,
                        attachmentPurpose=models.AttachmentPurpose.IMAGE.value
                    )
                    phase.attachments.append(attachment)

            db.flush()

        return UpdateDiscussionPhase(discussion_phase=phase)


class DeleteDiscussionPhase(graphene.Mutation):
    class Input:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @staticmethod
    @abort_transaction_on_exception
    def mutate(root, args, context, info):
        cls = models.DiscussionPhase
        phase_id = args.get('id')
        phase_id = int(Node.from_global_id(phase_id)[1])
        phase = cls.get(phase_id)
        require_instance_permission(CrudPermissions.DELETE, phase, context)
        with cls.default_db.no_autoflush as db:
            for attachment in phase.attachments[:]:
                attachment.document.delete_file()
                db.delete(attachment.document)
                db.delete(attachment)
                phase.attachments.remove(attachment)
            db.delete(phase)
            db.flush()

        return DeleteDiscussionPhase(success=True)

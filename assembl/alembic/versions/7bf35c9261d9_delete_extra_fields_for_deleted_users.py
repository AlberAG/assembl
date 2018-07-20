"""delete_extra_fields_for_deleted_users

Revision ID: 7bf35c9261d9
Revises: e3f681bd70e0
Create Date: 2018-06-13 14:14:41.037265

"""

# revision identifiers, used by Alembic.
revision = '7bf35c9261d9'
down_revision = 'e3f681bd70e0'

from alembic import context, op
import sqlalchemy as sa
import transaction


from assembl.lib import config


def upgrade(pyramid_env):
    from assembl import models as m
    db = m.get_session_maker()()
    with transaction.manager:
        extra_fields = db.query(m.ProfileField).join(m.User).filter(m.User.is_deleted).all()
        for ef in extra_fields:
            db.delele(ef)


def downgrade(pyramid_env):
    with context.begin_transaction():
        pass

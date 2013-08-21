"""Synthesis model

Revision ID: 40b909900ff7
Revises: 22ccb18547ea
Create Date: 2013-08-19 16:23:35.705562

"""

# revision identifiers, used by Alembic.
revision = '40b909900ff7'
down_revision = '22ccb18547ea'

from alembic import context, op
import sqlalchemy as sa
import transaction


from assembl import models as m
from assembl.lib import config

db = m.DBSession


def upgrade(pyramid_env):
    with context.begin_transaction():
        ### commands auto generated by Alembic - please adjust! ###
        op.create_table('synthesis',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('creation_date', sa.DateTime(), nullable=False),
        sa.Column('publication_date', sa.DateTime(), nullable=True),
        sa.Column('subject', sa.Unicode(length=255), nullable=True),
        sa.Column('introduction', sa.UnicodeText(), nullable=True),
        sa.Column('conclusion', sa.UnicodeText(), nullable=True),
        sa.PrimaryKeyConstraint('id')
        )
        op.add_column(u'discussion', sa.Column('synthesis_id', sa.Integer(), nullable=True))
        op.add_column(u'idea', sa.Column('synthesis_id', sa.Integer(), nullable=True))
        ### end Alembic commands ###

    # Do stuff with the app's models here.
    with transaction.manager:
        pass


def downgrade(pyramid_env):
    with context.begin_transaction():
        ### commands auto generated by Alembic - please adjust! ###
        op.drop_column(u'idea', 'synthesis_id')
        op.drop_column(u'discussion', 'synthesis_id')
        op.drop_table('synthesis')
        ### end Alembic commands ###

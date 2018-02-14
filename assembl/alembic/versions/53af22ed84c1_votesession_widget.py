"""VoteSession now inherits from VotingWidget

Revision ID: 53af22ed84c1
Revises: 95750e0267d8
Create Date: 2018-02-13 16:14:51.222332

"""

# revision identifiers, used by Alembic.
revision = '53af22ed84c1'
down_revision = '95750e0267d8'

from alembic import context, op
import sqlalchemy as sa
import transaction
from assembl.lib.sqla import mark_changed


def upgrade(pyramid_env):
    # Do stuff with the app's models here.
    from assembl import models as m
    db = m.get_session_maker()()
    with transaction.manager:
        # remove all existing vote sessions (there is no vote session currently in prod)
        vote_sessions = db.query(m.VoteSession).all()
        for vote_session in vote_sessions:
            db = vote_session.db
            vote_spec_ids = [id for id, in db.execute('SELECT id FROM vote_specification WHERE vote_session_id IS NOT NULL')]
            if vote_spec_ids:
                # we need to do this because the foreign key is not in cascade
                db.execute('DELETE FROM token_vote_specification WHERE id IN (%s)' % ','.join([str(id) for id in vote_spec_ids]))
                db.execute('DELETE FROM gauge_vote_specification WHERE id IN (%s)' % ','.join([str(id) for id in vote_spec_ids]))
                db.execute('DELETE FROM number_gauge_vote_specification WHERE id IN (%s)' % ','.join([str(id) for id in vote_spec_ids]))
                db.execute('DELETE FROM vote_specification WHERE id IN (%s)' % ','.join([str(id) for id in vote_spec_ids]))
            vote_session.delete()
        mark_changed()

    with context.begin_transaction():
        op.create_foreign_key(None, 'vote_session', 'widget', ['id'], ['id'])
        op.drop_column('vote_specification', 'vote_session_id')
        op.alter_column("vote_specification", "widget_id", nullable=False)


def downgrade(pyramid_env):
    with context.begin_transaction():
        op.drop_constraint(u'vote_session_id_fkey', 'vote_session', type_='foreignkey')
        op.add_column(
            'vote_specification',
            sa.Column(
                'vote_session_id',
                sa.Integer(),
                sa.ForeignKey('vote_session.id'), nullable=True, index=True))
        op.alter_column("vote_specification", "widget_id", nullable=True)

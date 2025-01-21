"""empty message

Revision ID: 1e95d4565cc7
Revises: 0cc12db8114e
Create Date: 2025-01-20 17:02:14.259688

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '1e95d4565cc7'
down_revision: Union[str, None] = '0cc12db8114e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('chat_user')
    op.drop_table('chats')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('chats',
    sa.Column('idchat', sa.UUID(), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('idchat', name='chats_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_table('chat_user',
    sa.Column('chat_id', sa.UUID(), autoincrement=False, nullable=False),
    sa.Column('user_id', sa.UUID(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['chat_id'], ['chats.idchat'], name='chat_user_chat_id_fkey'),
    sa.ForeignKeyConstraint(['user_id'], ['users.userId'], name='chat_user_user_id_fkey'),
    sa.PrimaryKeyConstraint('chat_id', 'user_id', name='chat_user_pkey')
    )
    # ### end Alembic commands ###

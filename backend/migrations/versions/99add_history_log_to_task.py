"""add history_log field to task

Revision ID: 99add_history_log_to_task
Revises: 86cabfc911b6
Create Date: 2025-07-07 13:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '99add_history_log_to_task'
down_revision: Union[str, Sequence[str], None] = '86cabfc911b6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('task', sa.Column('history_log', sa.Text(), nullable=True))

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('task', 'history_log') 
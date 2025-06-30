import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from sqlmodel import SQLModel
from dotenv import load_dotenv

from alembic import context

# 1. .env 파일 로드
load_dotenv()

# 2. DB URL 환경변수에서 읽기
config = context.config
config.set_main_option(
    "sqlalchemy.url", os.getenv("DATABASE_URL", "postgresql+psycopg2://username:password@localhost:5432/todomanager")
)

# 3. 모델 import (모든 모델을 명시적으로 import)
from backend.app.models.goal import Goal
from backend.app.models.project import Project
from backend.app.models.milestone_group import MilestoneGroup
from backend.app.models.task import Task
from backend.app.models.other_task import OtherTask
from backend.app.models.routine import Routine
from backend.app.models.aspiration import Aspiration
from backend.app.models.emotion_journal import EmotionJournal

# 4. SQLModel metadata 지정
target_metadata = SQLModel.metadata

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

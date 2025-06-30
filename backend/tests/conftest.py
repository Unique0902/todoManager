import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from backend.app.main import app

@pytest_asyncio.fixture(scope="module")
async def async_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac 
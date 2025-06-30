import os
from dotenv import load_dotenv

# .env 파일 경로를 명확히 지정
load_dotenv("D:/projects/todoManager/.env")

print("DATABASE_URL =", os.getenv("DATABASE_URL")) 
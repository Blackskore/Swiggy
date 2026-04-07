from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os
from dotenv import load_dotenv

load_dotenv()

# AWS RDS Configuration
RDS_ENDPOINT = "data123.ce7coqi0io3r.us-east-1.rds.amazonaws.com"
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "password")
DB_NAME = os.environ.get("DB_NAME", "swiggy_clone")
DB_PORT = os.environ.get("DB_PORT", "5432")

SQLALCHEMY_DATABASE_URL = os.environ.get(
    "DATABASE_URL", 
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{RDS_ENDPOINT}:{DB_PORT}/{DB_NAME}"
)

# Connect args specific to SQLite should only be used if it's SQLite
connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get a database session and safely close it
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

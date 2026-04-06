from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Using SQLite for simplicity in this clone
SQLALCHEMY_DATABASE_URL = "sqlite:///./swiggy_clone_v2.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
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

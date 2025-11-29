from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import engine, get_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    models.Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(title="Iris Backend", lifespan=lifespan)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://localhost:4321",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:4321",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Iris Backend is running"}

@app.post("/subjects", response_model=schemas.Subject)
def create_subject(subject: schemas.SubjectCreate, db: Session = Depends(get_db)):
    # Check if exists
    existing = db.query(models.Subject).filter(models.Subject.code == subject.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Subject already exists")
    
    db_subject = models.Subject(code=subject.code, name=subject.name)
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@app.post("/subscribe", response_model=schemas.User)
def subscribe(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_or_update_subscription(db=db, user=user)

@app.get("/subjects", response_model=List[schemas.Subject])
def read_subjects(db: Session = Depends(get_db)):
    subjects = crud.get_all_subjects(db)
    return subjects

@app.get("/users/{email}", response_model=schemas.User)
def read_user(email: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=email)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
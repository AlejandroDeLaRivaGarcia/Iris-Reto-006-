from sqlalchemy.orm import Session
from typing import List

from . import models, schemas

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_phone(db: Session, phone: str):
    return db.query(models.User).filter(models.User.phone == phone).first()

def get_all_subjects(db: Session) -> List[models.Subject]:
    return db.query(models.Subject).all()

def create_or_update_subscription(db: Session, user: schemas.UserCreate):
    db_user = get_user_by_email(db, user.email)
    if not db_user:
        db_user = models.User(email=user.email, name=user.name, phone=user.phone)
        db.add(db_user)
    else:
        # Update phone and name if changed
        db_user.phone = user.phone
        db_user.name = user.name
    
    db.commit()
    
    # Handle subjects
    # Get subjects that match the codes
    subjects = db.query(models.Subject).filter(models.Subject.code.in_(user.subjects)).all()
    
    # Replace subscriptions
    db_user.subjects = subjects
    db.commit()
    db.refresh(db_user)
    return db_user

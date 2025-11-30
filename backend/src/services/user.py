from sqlalchemy.orm import Session
from .. import models, schemas

class UserNotFoundError(Exception):
    def __init__(self, message: str = "User not found"):
        self.message = message
        super().__init__(self.message)

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_phone(db: Session, phone: str):
    return db.query(models.User).filter(models.User.phone == phone).first()

def create_or_update_user(db: Session, user_data: schemas.UserCreate):
    db_user = get_user_by_email(db, user_data.email)
    if not db_user:
        db_user = models.User(email=user_data.email, name=user_data.name, phone=user_data.phone)
        db.add(db_user)
    else:
        db_user.phone = user_data.phone
        db_user.name = user_data.name
    db.commit()
    db.refresh(db_user)
    return db_user

from sqlalchemy.orm import Session
from .. import models, schemas

class SubjectAlreadyExistsError(Exception):
    def __init__(self, message: str = "Subject with this code already exists"):
        self.message = message
        super().__init__(self.message)

def create_subject(db: Session, subject: schemas.SubjectCreate):
    existing = db.query(models.Subject).filter(models.Subject.code == subject.code).first()
    if existing:
        raise SubjectAlreadyExistsError()
    
    db_subject = models.Subject(code=subject.code, name=subject.name)
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

def get_all_subjects(db: Session):
    return db.query(models.Subject).all()

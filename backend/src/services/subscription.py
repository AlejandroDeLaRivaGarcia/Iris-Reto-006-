from sqlalchemy.orm import Session
from .. import models, schemas
from .user import create_or_update_user, get_user_by_email

class SubjectNotFoundForSubscriptionError(Exception):
    def __init__(self, message: str = "One or more subjects not found for subscription"):
        self.message = message
        super().__init__(self.message)

def create_or_update_subscription(db: Session, user_data: schemas.UserCreate):
    # This part now delegates to the user service for user creation/update
    db_user = create_or_update_user(db, user_data)
    
    # Handle subjects
    # Get subjects that match the codes
    subjects = db.query(models.Subject).filter(models.Subject.code.in_(user_data.subjects)).all()
    
    if len(subjects) != len(user_data.subjects):
        # This means some subjects provided by the user were not found in the database.
        # We could raise an error or just subscribe to the ones that exist.
        # For now, let's raise an error to ensure data integrity.
        # A more sophisticated approach might return which subjects were not found.
        raise SubjectNotFoundForSubscriptionError()

    # Replace subscriptions
    db_user.subjects = subjects
    db.commit()
    db.refresh(db_user)
    return db_user

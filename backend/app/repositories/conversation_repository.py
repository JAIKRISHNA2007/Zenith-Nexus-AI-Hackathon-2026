from sqlalchemy.orm import Session

from backend.app.models.conversation import Conversation


def create_conversation(db: Session, user_id: int):
    conversation = Conversation(user_id=user_id)
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


def get_conversations(db: Session):
    return db.query(Conversation).order_by(Conversation.id.desc()).all()


def get_conversation_by_id(db: Session, conversation_id: int):
    return (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id)
        .first()
    )


def delete_conversation_by_id(db: Session, conversation_id: int) -> bool:
    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == conversation_id)
        .first()
    )
    if not conversation:
        return False
    db.delete(conversation)
    db.commit()
    return True
from sqlalchemy.orm import Session

from backend.app.repositories.conversation_repository import (
    create_conversation,
    get_conversations,
    get_conversation_by_id,
    delete_conversation_by_id,
)


def create_new_conversation(db: Session, user_id: int):
    return create_conversation(db, user_id)


def get_all_conversations(db: Session):
    return get_conversations(db)


def get_conversation(db: Session, conversation_id: int):
    return get_conversation_by_id(db, conversation_id)


def delete_conversation(db: Session, conversation_id: int) -> bool:
    return delete_conversation_by_id(db, conversation_id)
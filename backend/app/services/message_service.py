from sqlalchemy.orm import Session

from backend.app.repositories.message_repository import (
    create_message,
    get_messages_by_conversation,
)


def create_new_message(
    db: Session,
    conversation_id: int,
    role: str,
    content: str
):
    return create_message(
        db,
        conversation_id,
        role,
        content,
    )


def get_conversation_messages(
    db: Session,
    conversation_id: int
):
    return get_messages_by_conversation(
        db,
        conversation_id,
    )
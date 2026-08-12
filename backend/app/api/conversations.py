from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.schemas.conversation import ConversationResponse

from backend.app.database.session import get_db
from backend.app.services.conversation_service import (
    create_new_conversation,
    get_all_conversations,
    get_conversation,
    delete_conversation,
)

router = APIRouter(
    prefix="/api/v1/conversations",
    tags=["Conversations"]
)


@router.post(
    "/{user_id}",
    response_model=ConversationResponse
)
def create_conversation_api(
    user_id: int,
    db: Session = Depends(get_db)
):
    from backend.app.models.user import User
    
    # Auto-create user if they don't exist to prevent FK constraint failures
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = User(id=user_id, name="Test User", email=f"test{user_id}@example.com", password="password")
        db.add(user)
        db.commit()

    return create_new_conversation(db, user_id)


@router.get(
    "",
    response_model=list[ConversationResponse]
)
def read_conversations(
    db: Session = Depends(get_db)
):
    return get_all_conversations(db)


@router.get(
    "/{conversation_id}",
    response_model=ConversationResponse
)
def read_conversation(
    conversation_id: int,
    db: Session = Depends(get_db)
):
    return get_conversation(db, conversation_id)


@router.delete("/{conversation_id}")
def delete_conversation_api(
    conversation_id: int,
    db: Session = Depends(get_db)
):
    success = delete_conversation(db, conversation_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )
    return {"message": "Conversation deleted successfully"}
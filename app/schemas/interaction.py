from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TaskBase(BaseModel):
    description: str
    due_date: Optional[datetime] = None
    category: Optional[str] = None
    assigned_to_id: Optional[int] = None
    customer_id: Optional[int] = None
    status: Optional[str] = "To Do"
    completed: Optional[int] = 0


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    category: Optional[str] = None
    assigned_to_id: Optional[int] = None
    status: Optional[str] = None
    completed: Optional[int] = None


class TaskOut(TaskBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ActivityBase(BaseModel):
    customer_id: int
    user_id: Optional[int] = None # The actor ID
    type: str
    summary: Optional[str] = None
    details: Optional[str] = None


class ActivityCreate(ActivityBase):
    pass


class ActivityOut(ActivityBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

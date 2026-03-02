from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    role: Optional[str] = "User"


class UserCreate(UserBase):
    pass


class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

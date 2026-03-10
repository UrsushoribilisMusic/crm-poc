from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class TagBase(BaseModel):
    name: str


class TagOut(TagBase):
    id: int

    class Config:
        from_attributes = True


class CustomerBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = "active"
    notes: Optional[str] = None


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None


class CustomerOut(CustomerBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    tags: List[TagOut] = []

    class Config:
        from_attributes = True

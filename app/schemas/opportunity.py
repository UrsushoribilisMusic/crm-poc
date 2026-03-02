from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class OpportunityBase(BaseModel):
    customer_id: int
    name: str
    value: Optional[int] = 0
    stage: Optional[str] = "Lead"
    expected_close_date: Optional[datetime] = None


class OpportunityCreate(OpportunityBase):
    pass


class OpportunityOut(OpportunityBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

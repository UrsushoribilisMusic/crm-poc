from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Activity, Customer
from ..schemas.interaction import ActivityCreate, ActivityOut

router = APIRouter(prefix="/activities", tags=["activities"])

@router.get("/", response_model=List[ActivityOut])
def list_activities(
    customer_id: Optional[int] = Query(None), 
    skip: int = 0, 
    limit: int = 50, 
    db: Session = Depends(get_db)
):
    query = db.query(Activity)
    if customer_id:
        query = query.filter(Activity.customer_id == customer_id)
    return query.order_by(Activity.created_at.desc()).offset(skip).limit(limit).all()

@router.post("/", response_model=ActivityOut, status_code=201)
def create_activity(payload: ActivityCreate, db: Session = Depends(get_db)):
    # Validate customer exists
    customer = db.query(Customer).filter(Customer.id == payload.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    activity = Activity(**payload.model_dump())
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

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
    type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Activity)
    if customer_id is not None:
        query = query.filter(Activity.customer_id == customer_id)
    if type:
        query = query.filter(Activity.type == type)
    return query.order_by(Activity.created_at.desc()).all()


@router.post("/", response_model=ActivityOut, status_code=201)
def create_activity(payload: ActivityCreate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == payload.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    activity = Activity(**payload.model_dump())
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity


@router.get("/{activity_id}", response_model=ActivityOut)
def get_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity


@router.delete("/{activity_id}", status_code=204)
def delete_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    db.delete(activity)
    db.commit()

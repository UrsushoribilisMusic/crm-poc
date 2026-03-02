import csv
import io
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models import Customer, Tag
from ..schemas import CustomerCreate, CustomerUpdate, CustomerOut

router = APIRouter(prefix="/customers", tags=["customers"])


@router.get("/", response_model=List[CustomerOut])
def list_customers(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Customer).options(joinedload(Customer.tags))
    if status:
        query = query.filter(Customer.status == status)
    if search:
        term = f"%{search}%"
        query = query.filter(
            Customer.first_name.ilike(term)
            | Customer.last_name.ilike(term)
            | Customer.email.ilike(term)
            | Customer.company.ilike(term)
        )
    return query.offset(skip).limit(limit).all()


@router.post("/", response_model=CustomerOut, status_code=201)
def create_customer(payload: CustomerCreate, db: Session = Depends(get_db)):
    existing = db.query(Customer).filter(Customer.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    customer = Customer(**payload.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
<<<<<<< Updated upstream
    # Return with tags
=======
>>>>>>> Stashed changes
    return db.query(Customer).options(joinedload(Customer.tags)).filter(Customer.id == customer.id).first()


@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).options(joinedload(Customer.tags)).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.patch("/{customer_id}", response_model=CustomerOut)
def update_customer(
    customer_id: int, payload: CustomerUpdate, db: Session = Depends(get_db)
):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    if payload.email and payload.email != customer.email:
        conflict = db.query(Customer).filter(Customer.email == payload.email).first()
        if conflict:
            raise HTTPException(status_code=400, detail="Email already registered")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(customer, field, value)
    db.commit()
    db.refresh(customer)
<<<<<<< Updated upstream
    # Return with tags
    return db.query(Customer).options(joinedload(Customer.tags)).filter(Customer.id == customer.id).first()
=======
    return db.query(Customer).options(joinedload(Customer.tags)).filter(Customer.id == customer_id).first()
>>>>>>> Stashed changes


@router.delete("/{customer_id}", status_code=204)
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    db.delete(customer)
    db.commit()


def csv_generator(customers):
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow(["id", "first_name", "last_name", "email", "phone", "company", "status", "notes", "created_at"])
    yield output.getvalue()
    output.seek(0)
    output.truncate(0)
    
    for c in customers:
        writer.writerow([c.id, c.first_name, c.last_name, c.email, c.phone, c.company, c.status, c.notes, c.created_at])
        yield output.getvalue()
        output.seek(0)
        output.truncate(0)


@router.get("/export/csv")
def export_csv(db: Session = Depends(get_db)):
    customers = db.query(Customer).yield_per(100)
    return StreamingResponse(
        csv_generator(customers),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=customers.csv"},
    )

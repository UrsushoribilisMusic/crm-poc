from collections import defaultdict
from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Task, Activity
from ..schemas.interaction import TaskCreate, TaskOut, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/calendar", response_model=Dict[str, List[TaskOut]])
def get_calendar_tasks(
    year: int = Query(...),
    month: int = Query(...),
    db: Session = Depends(get_db),
):
    """Return tasks grouped by due_date (YYYY-MM-DD) for the given month."""
    from datetime import date
    import calendar
    first_day = date(year, month, 1)
    last_day = date(year, month, calendar.monthrange(year, month)[1])
    tasks = (
        db.query(Task)
        .filter(Task.due_date >= first_day.isoformat(), Task.due_date <= last_day.isoformat() + "T23:59:59")
        .all()
    )
    grouped: Dict[str, list] = defaultdict(list)
    for task in tasks:
        if task.due_date:
            day_key = task.due_date[:10] if isinstance(task.due_date, str) else task.due_date.strftime("%Y-%m-%d")
            grouped[day_key].append(task)
    return dict(grouped)


@router.get("/", response_model=List[TaskOut])
def list_tasks(
    customer_id: Optional[int] = Query(None),
    completed: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Task)
    if customer_id is not None:
        query = query.filter(Task.customer_id == customer_id)
    if completed is not None:
        query = query.filter(Task.completed == completed)
    return query.order_by(Task.due_date).all()


@router.post("/", response_model=TaskOut, status_code=201)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)):
    task = Task(**payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get("/{task_id}", response_model=TaskOut)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/{task_id}", response_model=TaskOut)
def update_task(task_id: int, payload: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    data = payload.model_dump(exclude_unset=True)
    
    # Automatic Activity Logging if status changed
    if "status" in data and data["status"] != task.status:
        if task.customer_id:
            activity = Activity(
                customer_id=task.customer_id,
                user_id=task.assigned_to_id, # Linked actor
                type="Note",
                summary=f"Task status changed to {data['status']}",
                details=f"Task '{task.description}' was moved from '{task.status}' to '{data['status']}'."
            )
            db.add(activity)

    for field, value in data.items():
        setattr(task, field, value)
    
    # Sync 'completed' with 'Closed' status
    if task.status == "Closed":
        task.completed = 1
    else:
        task.completed = 0

    db.commit()
    db.refresh(task)
    return task


@router.patch("/{task_id}/complete", response_model=TaskOut)
def complete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.completed = 1
    task.status = "Closed"
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()

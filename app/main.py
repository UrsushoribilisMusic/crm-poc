from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from .models import Base, Customer, Task, Activity, Opportunity, Tag, User
from .routers import customers, tasks, activities, opportunities, users, google_calendar

# Create all tables on startup (Models must be imported first!)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Simple CRM",
    description="Customer Management System — Proof of Concept",
    version="1.1.0",
)

# Reinforce CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customers.router)
app.include_router(tasks.router)
app.include_router(activities.router)
app.include_router(opportunities.router)
app.include_router(users.router)
app.include_router(google_calendar.router)


@app.get("/")
def root():
    return {"message": "CRM POC API", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}

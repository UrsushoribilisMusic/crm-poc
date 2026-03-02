from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from .models import Base
from .routers import customers, tasks, activities

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CRM POC",
    description="Customer Management System — Proof of Concept",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customers.router)
app.include_router(tasks.router)
app.include_router(activities.router)


@app.get("/")
def root():
    return {"message": "CRM POC API", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}

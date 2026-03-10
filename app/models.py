from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# Association table for Many-to-Many relationship between Customer and Tag
customer_tags = Table(
    "customer_tags",
    Base.metadata,
    Column("customer_id", Integer, ForeignKey("customers.id"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    role = Column(String(50), default="User")  # Admin, User
    google_token = Column(Text, nullable=True)  # JSON blob for OAuth tokens
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    tasks = relationship("Task", back_populates="assignee")
    activities = relationship("Activity", back_populates="actor")


class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(50))
    company = Column(String(200))
    location = Column(String(255))
    status = Column(String(50), default="active")  # active, inactive, lead
    notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    tags = relationship("Tag", secondary=customer_tags, back_populates="customers")
    tasks = relationship("Task", back_populates="customer")
    activities = relationship("Activity", back_populates="customer")
    opportunities = relationship("Opportunity", back_populates="customer")


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)

    # Relationships
    customers = relationship("Customer", secondary=customer_tags, back_populates="tags")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    description = Column(String(255), nullable=False)
    due_date = Column(DateTime(timezone=True))
    category = Column(String(50))  # Call, Meeting, Follow up
    assigned_to = Column(String(100))
    status = Column(String(50), default="To Do")  # To Do, In Progress, Closed
    completed = Column(Integer, default=0)  # 0 for false, 1 for true
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    customer = relationship("Customer", back_populates="tasks")
    assignee = relationship("User", back_populates="tasks")


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    type = Column(String(50), nullable=False)  # Call, Note, Meeting
    summary = Column(String(255))
    details = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    customer = relationship("Customer", back_populates="activities")
    actor = relationship("User", back_populates="activities")


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    name = Column(String(200), nullable=False)
    value = Column(Integer, default=0)
    stage = Column(String(50), default="Lead")  # Lead, Qualified, Proposal, Negotiation, Won, Lost
    expected_close_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    customer = relationship("Customer", back_populates="opportunities")

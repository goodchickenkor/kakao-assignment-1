from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, String, Boolean
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from pydantic import BaseModel, field_validator
from typing import Optional
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./todos.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


class TodoModel(Base):
    __tablename__ = "todos"

    id = Column(String, primary_key=True, index=True)
    text = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    date = Column(String, nullable=False)


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Todo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class TodoCreate(BaseModel):
    text: str
    date: str

    @field_validator("text")
    @classmethod
    def text_must_not_be_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("text must not be empty")
        return v


class TodoUpdate(BaseModel):
    text: Optional[str] = None
    completed: Optional[bool] = None
    date: Optional[str] = None

    @field_validator("text")
    @classmethod
    def text_must_not_be_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError("text must not be empty")
        return v


class TodoRead(BaseModel):
    id: str
    text: str
    completed: bool
    date: str

    model_config = {"from_attributes": True}


@app.get("/")
def root():
    return {"message": "Todo API is running"}


@app.get("/todos", response_model=list[TodoRead])
def get_todos(
    filter: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    date: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(TodoModel)

    if filter == "active":
        query = query.filter(TodoModel.completed == False)  # noqa: E712
    elif filter == "completed":
        query = query.filter(TodoModel.completed == True)  # noqa: E712

    if search:
        query = query.filter(TodoModel.text.ilike(f"%{search}%"))

    if date:
        query = query.filter(TodoModel.date == date)

    return query.all()


@app.post("/todos", response_model=TodoRead, status_code=201)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    new_todo = TodoModel(
        id=str(uuid.uuid4()),
        text=todo.text,
        completed=False,
        date=todo.date,
    )
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo


@app.get("/todos/{todo_id}", response_model=TodoRead)
def get_todo(todo_id: str, db: Session = Depends(get_db)):
    todo = db.query(TodoModel).filter(TodoModel.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@app.put("/todos/{todo_id}", response_model=TodoRead)
def update_todo(todo_id: str, update: TodoUpdate, db: Session = Depends(get_db)):
    todo = db.query(TodoModel).filter(TodoModel.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")

    if update.text is not None:
        todo.text = update.text
    if update.completed is not None:
        todo.completed = update.completed
    if update.date is not None:
        todo.date = update.date

    db.commit()
    db.refresh(todo)
    return todo


@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: str, db: Session = Depends(get_db)):
    todo = db.query(TodoModel).filter(TodoModel.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(todo)
    db.commit()

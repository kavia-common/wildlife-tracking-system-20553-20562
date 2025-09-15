from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from src.db.session import get_db, Base, engine
from src.models.animal import Animal
from src.schemas.animal import AnimalCreate, AnimalUpdate, AnimalOut
from src.routes.auth import get_current_user

# Ensure tables are created at import time for simplicity
Base.metadata.create_all(bind=engine)

router = APIRouter()


# PUBLIC_INTERFACE
@router.get(
    "",
    response_model=List[AnimalOut],
    summary="List animals",
    description="Retrieve a list of animals with optional filtering and pagination.",
)
def list_animals(
    db: Session = Depends(get_db),
    q: Optional[str] = Query(None, description="Search by name or species"),
    species: Optional[str] = Query(None, description="Filter by species"),
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(50, ge=1, le=200, description="Pagination limit"),
    current_user: str = Depends(get_current_user),
):
    """
    List animals with basic filters.
    """
    query = db.query(Animal)
    if q:
        like = f"%{q}%"
        query = query.filter((Animal.name.ilike(like)) | (Animal.species.ilike(like)))
    if species:
        query = query.filter(Animal.species == species)
    if status_filter:
        query = query.filter(Animal.status == status_filter)
    results = query.offset(skip).limit(limit).all()
    return results


# PUBLIC_INTERFACE
@router.post(
    "",
    response_model=AnimalOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create animal",
    description="Create a new animal record.",
    responses={
        201: {"description": "Animal created"},
        400: {"description": "Tag ID already exists"},
    },
)
def create_animal(
    payload: AnimalCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """
    Create an animal record ensuring tag_id uniqueness.
    """
    existing = db.query(Animal).filter(Animal.tag_id == payload.tag_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="tag_id already exists")

    obj = Animal(
        name=payload.name,
        species=payload.species,
        tag_id=payload.tag_id,
        last_latitude=payload.last_latitude,
        last_longitude=payload.last_longitude,
        last_seen_at=payload.last_seen_at,
        status=payload.status or "active",
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


# PUBLIC_INTERFACE
@router.get(
    "/{animal_id}",
    response_model=AnimalOut,
    summary="Get animal",
    description="Retrieve a specific animal by its ID.",
    responses={
        404: {"description": "Animal not found"},
    },
)
def get_animal(
    animal_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """
    Get an animal by ID.
    """
    obj = db.get(Animal, animal_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Animal not found")
    return obj


# PUBLIC_INTERFACE
@router.put(
    "/{animal_id}",
    response_model=AnimalOut,
    summary="Update animal",
    description="Update fields for a specific animal.",
    responses={
        404: {"description": "Animal not found"},
        400: {"description": "tag_id already exists"},
    },
)
def update_animal(
    animal_id: int,
    payload: AnimalUpdate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """
    Update an animal by ID. Validates unique tag_id.
    """
    obj = db.get(Animal, animal_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Animal not found")

    if payload.tag_id and payload.tag_id != obj.tag_id:
        conflict = db.query(Animal).filter(Animal.tag_id == payload.tag_id).first()
        if conflict:
            raise HTTPException(status_code=400, detail="tag_id already exists")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)

    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


# PUBLIC_INTERFACE
@router.delete(
    "/{animal_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete animal",
    description="Delete an animal by its ID.",
    responses={
        204: {"description": "Deleted"},
        404: {"description": "Animal not found"},
    },
)
def delete_animal(
    animal_id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """
    Delete an animal by ID.
    """
    obj = db.get(Animal, animal_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Animal not found")
    db.delete(obj)
    db.commit()
    return None

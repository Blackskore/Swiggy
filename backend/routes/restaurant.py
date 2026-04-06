from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db

router = APIRouter(
    prefix="/restaurants",
    tags=["Restaurants"]
)

@router.get("/", response_model=List[schemas.Restaurant])
def get_restaurants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    restaurants = db.query(models.Restaurant).offset(skip).limit(limit).all()
    return restaurants

@router.get("/{restaurant_id}", response_model=schemas.Restaurant)
def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = db.query(models.Restaurant).filter(models.Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")
    return restaurant

@router.post("/", response_model=schemas.Restaurant, status_code=status.HTTP_201_CREATED)
def create_restaurant(restaurant: schemas.RestaurantCreate, db: Session = Depends(get_db)):
    new_restaurant = models.Restaurant(**restaurant.model_dump())
    db.add(new_restaurant)
    db.commit()
    db.refresh(new_restaurant)
    return new_restaurant

@router.post("/{restaurant_id}/menu", response_model=schemas.MenuItem, status_code=status.HTTP_201_CREATED)
def create_menu_item(restaurant_id: int, item: schemas.MenuItemCreate, db: Session = Depends(get_db)):
    restaurant = db.query(models.Restaurant).filter(models.Restaurant.id == restaurant_id).first()
    if not restaurant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Restaurant not found")
    
    new_item = models.MenuItem(**item.model_dump(), restaurant_id=restaurant_id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

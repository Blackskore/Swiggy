from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
import time
import models, schemas
from database import get_db, SessionLocal
from auth_utils import get_current_user

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

# The magic background task that simulates physical cooking and delivery timeline updates!
def update_order_status_task(order_id: int):
    # Move to PREPARING after 8 seconds
    time.sleep(8)
    db = SessionLocal()
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if order:
        order.status = "PREPARING"
        db.commit()
    db.close()
    
    # Move to DELIVERED after another 8 seconds
    time.sleep(8)
    db = SessionLocal()
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if order:
        order.status = "DELIVERED"
        db.commit()
    db.close()

@router.post("/", response_model=schemas.Order, status_code=status.HTTP_201_CREATED)
def create_order(
    order: schemas.OrderCreate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)  # Completely secure endpoint
):
    
    total_amount = 0.0
    order_items_models = []
    
    for item in order.items:
        menu_item = db.query(models.MenuItem).filter(models.MenuItem.id == item.menu_item_id).first()
        if not menu_item or menu_item.restaurant_id != order.restaurant_id:
            raise HTTPException(status_code=400, detail=f"Invalid menu item: {item.menu_item_id} for this restaurant")
        
        total_amount += menu_item.price * item.quantity
        order_items_models.append(
            models.OrderItem(
                menu_item_id=item.menu_item_id,
                quantity=item.quantity,
                price_at_time=menu_item.price
            )
        )
        
    new_order = models.Order(
        user_id=current_user.id,
        restaurant_id=order.restaurant_id,
        total_amount=total_amount,
        status="PENDING"
    )
    
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    for oi in order_items_models:
        oi.order_id = new_order.id
        db.add(oi)
    
    db.commit()
    db.refresh(new_order)
    
    # Attach background progression tracker!
    background_tasks.add_task(update_order_status_task, new_order.id)
    return new_order

@router.get("/", response_model=List[schemas.Order])
def get_orders(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # Restrict completely only to signed-in context via global token
    orders = db.query(models.Order).filter(models.Order.user_id == current_user.id).all()
    return orders

@router.get("/{order_id}", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    if order.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this order")
    
    return order

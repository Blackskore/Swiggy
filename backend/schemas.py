from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# MenuItem Schemas
class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    is_available: bool = True
    image_url: Optional[str] = ""
    is_veg: bool = True

class MenuItemCreate(MenuItemBase):
    pass

class MenuItem(MenuItemBase):
    id: int
    restaurant_id: int

    class Config:
        from_attributes = True

# Restaurant Schemas
class RestaurantBase(BaseModel):
    name: str
    description: Optional[str] = None
    rating: float = 0.0
    is_active: bool = True
    image_url: Optional[str] = ""
    delivery_time: Optional[str] = "30-40 mins"
    cuisines: Optional[str] = "North Indian, Chinese"
    price_for_two: Optional[str] = "₹400 for two"
    city: Optional[str] = "Bengaluru"
    area: Optional[str] = ""

class RestaurantCreate(RestaurantBase):
    pass

class Restaurant(RestaurantBase):
    id: int
    menu_items: List[MenuItem] = []

    class Config:
        from_attributes = True

# Order Schemas
class OrderItemBase(BaseModel):
    menu_item_id: int
    quantity: int

class OrderCreate(BaseModel):
    restaurant_id: int
    items: List[OrderItemBase]
    total_amount: float

    class Config:
        from_attributes = True

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    price_at_time: float
    menu_item: Optional[MenuItem] = None

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    total_amount: float
    status: str
    created_at: datetime

class Order(OrderBase):
    id: int
    user_id: int
    restaurant_id: int
    items: List[OrderItem] = []
    restaurant: Optional[Restaurant] = None

    class Config:
        from_attributes = True

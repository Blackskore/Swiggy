from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    orders = relationship("Order", back_populates="user")

class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    rating = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    
    # Swiggy Specific Fields
    image_url = Column(String, default="")
    delivery_time = Column(String, default="30-40 mins")
    cuisines = Column(String, default="North Indian, Chinese")
    price_for_two = Column(String, default="₹400 for two")
    city = Column(String, default="Bengaluru", index=True)
    area = Column(String, default="")

    menu_items = relationship("MenuItem", back_populates="restaurant")

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"))
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    is_available = Column(Boolean, default=True)
    
    # Swiggy Specific Fields
    image_url = Column(String, default="")
    is_veg = Column(Boolean, default=True)

    restaurant = relationship("Restaurant", back_populates="menu_items")
    order_items = relationship("OrderItem", back_populates="menu_item")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"))
    total_amount = Column(Float)
    status = Column(String, default="PENDING")  # PENDING, PREPARING, DELIVERED, CANCELLED
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")
    restaurant = relationship("Restaurant")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    menu_item_id = Column(Integer, ForeignKey("menu_items.id"))
    quantity = Column(Integer)
    price_at_time = Column(Float)

    order = relationship("Order", back_populates="items")
    menu_item = relationship("MenuItem", back_populates="order_items")

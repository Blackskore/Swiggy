from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
import models
from routes import auth, restaurant, order

# Create database tables automatically
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Swiggy Clone Backend API",
    description="A simple FastAPI backend for a Swiggy-like food delivery application.",
    version="1.0.0"
)

# Setup CORS for frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev setup
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(restaurant.router)
app.include_router(order.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Swiggy Clone API. Visit /docs to see the Swagger documentation and test endpoints."}

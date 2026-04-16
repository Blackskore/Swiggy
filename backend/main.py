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

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

# Register routers
app.include_router(auth.router)
app.include_router(restaurant.router)
app.include_router(order.router)

# --- Serve React Frontend ---
static_path = os.path.join(os.path.dirname(__file__), "static")

# Mount the static files (images, JS, CSS)
if os.path.exists(static_path):
    # This mounts everything in 'static' to the root
    # But we want to handle the index.html specially for SPA routing
    app.mount("/static", StaticFiles(directory=os.path.join(static_path, "static")), name="static")

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # Exclude API routes if necessary, but routers included above take precedence
        # Check if the requested file exists in the static root
        file_path = os.path.join(static_path, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        # Fallback to index.html for SPA routing
        return FileResponse(os.path.join(static_path, "index.html"))
else:
    @app.get("/")
    def root():
        return {"message": "Static assets not found. Run npm run build and copy to backend/static."}

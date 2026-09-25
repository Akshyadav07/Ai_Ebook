from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.ai_routes import router
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI E-Book Builder Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, tags=["AI"])

@app.get("/")
async def root():
    return {"message": "AI E-Book Builder Service", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)

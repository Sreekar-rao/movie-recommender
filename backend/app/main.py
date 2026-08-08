from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.model import get_recommendations
from app.cache import get_cached_recommendations, set_cached_recommendations

app = FastAPI(title="Movie Recommender API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Movie Recommender API is running"}

@app.get("/recommendations/{user_id}")
def recommend(user_id: int, n: int = 10):
    try:
        cached = get_cached_recommendations(user_id)
        if cached:
            return {"user_id": user_id, "recommendations": cached, "cached": True}

        recs = get_recommendations(user_id, n)
        set_cached_recommendations(user_id, recs)
        return {"user_id": user_id, "recommendations": recs, "cached": False}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
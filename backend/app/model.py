import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from surprise import accuracy
import pickle
import os

def train_model():
    ratings = pd.read_csv('app/data/ratings.csv')
    reader = Reader(rating_scale=(0.5, 5.0))
    data = Dataset.load_from_df(ratings[['userId', 'movieId', 'rating']], reader)

    trainset, testset = train_test_split(data, test_size=0.2, random_state=42)

    model = SVD(n_factors=100, n_epochs=20, lr_all=0.005, reg_all=0.02)
    model.fit(trainset)

    predictions = model.test(testset)
    print(f"RMSE: {accuracy.rmse(predictions)}")

    with open('app/data/model.pkl', 'wb') as f:
        pickle.dump(model, f)

    print("Model saved to app/data/model.pkl")
    return model

def get_recommendations(user_id: int, n: int = 10):
    with open('app/data/model.pkl', 'rb') as f:
        model = pickle.load(f)

    movies = pd.read_csv('app/data/movies.csv')
    ratings = pd.read_csv('app/data/ratings.csv')

    # Movies this user hasn't rated yet
    rated_movie_ids = ratings[ratings['userId'] == user_id]['movieId'].tolist()
    unrated = movies[~movies['movieId'].isin(rated_movie_ids)]

    predictions = []
    for movie_id in unrated['movieId']:
        pred = model.predict(user_id, movie_id)
        predictions.append((movie_id, pred.est))

    predictions.sort(key=lambda x: x[1], reverse=True)
    top_n = predictions[:n]

    results = []
    for movie_id, score in top_n:
        title = movies[movies['movieId'] == movie_id]['title'].values[0]
        genres = movies[movies['movieId'] == movie_id]['genres'].values[0]
        results.append({
            "movieId": int(movie_id),
            "title": title,
            "genres": genres,
            "predicted_rating": round(score, 2)
        })

    return results

if __name__ == "__main__":
    train_model()
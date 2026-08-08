import pandas as pd

ratings = pd.read_csv('ratings.csv')
movies = pd.read_csv('movies.csv')

print(ratings.shape, movies.shape)
print(ratings.head())
print(movies.head())
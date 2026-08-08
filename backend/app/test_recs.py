from app.model import get_recommendations

recs = get_recommendations(1, 10)
for r in recs:
    print(r)
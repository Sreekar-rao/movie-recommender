import { useState } from 'react'
import './App.css'

function App() {
  const [userId, setUserId] = useState('1')
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const fetchRecommendations = async () => {
    setLoading(true)
    setError('')
    setRecommendations([])
    setHasSearched(true)
    try {
      const response = await fetch(`http://127.0.0.1:8000/recommendations/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch recommendations')
      const data = await response.json()
      setRecommendations(data.recommendations)
    } catch (err) {
      setError("Couldn't reach the recommender. Is the backend running?")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchRecommendations()
  }

  return (
    <div className="app">
      <div className="marquee-glow" />

      <header className="hero">
        <p className="eyebrow">Now Screening &middot; Personalized Picks</p>
        <h1>The Recommender</h1>
        <p className="tagline">Tell us who's watching. We'll roll the reel.</p>
      </header>

      <div className="input-row">
        <div className="input-wrap">
          <label htmlFor="userId">User ID</label>
          <input
            id="userId"
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="1–610"
            min="1"
            max="610"
          />
        </div>
        <button onClick={fetchRecommendations} disabled={loading}>
          {loading ? 'Rolling film…' : 'Get Recommendations'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {loading && (
        <div className="loading-state">
          <div className="reel" />
          <p>Screening titles for user {userId}…</p>
        </div>
      )}

      {!loading && hasSearched && recommendations.length > 0 && (
        <div className="grid">
          {recommendations.map((movie, i) => (
            <div className="ticket" key={movie.movieId} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="ticket-top">
                <h3>{movie.title}</h3>
                <p className="genres">{movie.genres.split('|').join(' · ')}</p>
              </div>
              <div className="perforation" />
              <div className="ticket-bottom">
                <span className="stub-label">Predicted Rating</span>
                <span className="rating">★ {movie.predicted_rating}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && hasSearched && recommendations.length === 0 && !error && (
        <p className="empty">No recommendations found for this user.</p>
      )}

      <footer>
        <p>Built with FastAPI · SVD Collaborative Filtering · Redis · React</p>
      </footer>
    </div>
  )
}

export default App
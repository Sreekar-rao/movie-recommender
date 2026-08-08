import { useState } from 'react'
import './App.css'

function App() {
  const [userId, setUserId] = useState('1')
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchRecommendations = async () => {
    setLoading(true)
    setError('')
    setRecommendations([])
    try {
      const response = await fetch(`http://127.0.0.1:8000/recommendations/${userId}`)
      if (!response.ok) throw new Error('Failed to fetch recommendations')
      const data = await response.json()
      setRecommendations(data.recommendations)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>🎬 Movie Recommender</h1>
      <p>Enter a User ID (try 1–610) to get personalized recommendations</p>

      <div className="input-row">
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
        />
        <button onClick={fetchRecommendations} disabled={loading}>
          {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="grid">
        {recommendations.map((movie) => (
          <div className="card" key={movie.movieId}>
            <h3>{movie.title}</h3>
            <p className="genres">{movie.genres}</p>
            <p className="rating">⭐ Predicted: {movie.predicted_rating}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
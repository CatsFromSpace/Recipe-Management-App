import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function FavoriteRecipes() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    // In a real app, you'd fetch this from localStorage or a backend
    const savedFavorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || []
    setFavorites(savedFavorites)
  }, [])

  const removeFromFavorites = (recipeUri) => {
    const updatedFavorites = favorites.filter(recipe => recipe.uri !== recipeUri)
    setFavorites(updatedFavorites)
    localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites))
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <h2>No Favorite Recipes Yet</h2>
        <p>Start adding recipes to your favorites to see them here!</p>
        <Link to="/" className="btn btn-primary">Browse Recipes</Link>
      </div>
    )
  }

  return (
    <div className="favorites-container">
      <h2>Your Favorite Recipes</h2>
      <div className="recipe-grid">
        {favorites.map((recipe) => (
          <div key={recipe.uri} className="recipe-card">
            <img src={recipe.image} alt={recipe.label} />
            <h3>{recipe.label}</h3>
            <p>{recipe.cuisineType.join(', ')}</p>
            <div className="card-actions">
              <Link 
                to={`/recipe/${recipe.uri}`}
                className="btn btn-primary"
              >
                View Details
              </Link>
              <button 
                onClick={() => removeFromFavorites(recipe.uri)}
                className="btn btn-danger"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FavoriteRecipes 
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { recipeApi } from '../services/recipeApi'

function RecipeList() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get custom recipes first
        const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || []
        const customRecipesFormatted = customRecipes.map(recipe => ({
          recipe: {
            ...recipe,
            isCustom: true // Add flag to identify custom recipes
          }
        }))

        // Get API recipes
        const apiRecipes = await recipeApi.searchRecipes(searchTerm)
        
        // Combine and set recipes
        setRecipes([...customRecipesFormatted, ...apiRecipes])
      } catch (err) {
        setError('Failed to fetch recipes. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
      fetchRecipes()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const handleDelete = (uri, event) => {
    // Prevent clicking the card when deleting
    event.stopPropagation()
    
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        // Get current recipes
        const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || []
        
        // Remove the recipe
        const updatedRecipes = customRecipes.filter(recipe => recipe.uri !== uri)
        
        // Save back to localStorage
        localStorage.setItem('customRecipes', JSON.stringify(updatedRecipes))
        
        // Update the UI
        setRecipes(prev => prev.filter(recipe => recipe.recipe.uri !== uri))
      } catch (error) {
        setError('Failed to delete recipe')
      }
    }
  }

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
        />
      </div>

      {error && <p className="error-message">{error}</p>}
      
      {loading ? (
        <p className="loading">Loading recipes...</p>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div key={recipe.recipe.uri} className="recipe-card">
              <img src={recipe.recipe.image} alt={recipe.recipe.label} />
              <div className="recipe-card-content">
                <h3>{recipe.recipe.label}</h3>
                <p>{recipe.recipe.cuisineType.join(', ')}</p>
                {recipe.recipe.isCustom && (
                  <div className="recipe-card-badges">
                    <p className="custom-badge">Custom Recipe</p>
                  </div>
                )}
                <div className="card-actions">
                  <Link 
                    to={`/recipe/${recipe.recipe.uri}`}
                    className="btn btn-primary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecipeList 
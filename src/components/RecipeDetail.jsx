import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { recipeApi } from '../services/recipeApi'

function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAlreadyFavorite, setIsAlreadyFavorite] = useState(false)

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await recipeApi.getRecipeById(id)
        setRecipe(data)
        
        // Check if recipe is in favorites
        const favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || []
        setIsAlreadyFavorite(favorites.some(fav => fav.uri === id))
      } catch (err) {
        setError('Failed to fetch recipe details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipeDetails()
  }, [id])

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes')) || []
    
    if (isAlreadyFavorite) {
      const updatedFavorites = favorites.filter(fav => fav.uri !== recipe.uri)
      localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites))
      setIsAlreadyFavorite(false)
    } else {
      favorites.push(recipe)
      localStorage.setItem('favoriteRecipes', JSON.stringify(favorites))
      setIsAlreadyFavorite(true)
    }
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        // Get current recipes
        const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || []
        
        // Remove the current recipe
        const updatedRecipes = customRecipes.filter(recipe => recipe.uri !== id)
        
        // Save back to localStorage
        localStorage.setItem('customRecipes', JSON.stringify(updatedRecipes))
        
        // Navigate back to home
        navigate('/')
      } catch (error) {
        setError('Failed to delete recipe')
      }
    }
  }

  if (loading) return <p>Loading recipe details...</p>
  if (error) return <p className="error-message">{error}</p>
  if (!recipe) return <p>Recipe not found</p>

  return (
    <div className="recipe-detail">
      <img src={recipe.image} alt={recipe.label} className="recipe-detail-image" />
      <h1>{recipe.label}</h1>
      
      <div className="recipe-info">
        <p>Cuisine: {recipe.cuisineType.join(', ')}</p>
        {recipe.yield > 0 && <p>Servings: {recipe.yield}</p>}
        {recipe.uri.startsWith('custom_') && <p className="custom-badge">Custom Recipe</p>}
      </div>

      <div className="recipe-ingredients">
        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredientLines.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>

      <div className="recipe-instructions">
        <h2>Instructions</h2>
        <ol>
          {recipe.instructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
      </div>

      <div className="recipe-actions">
        {recipe.uri.startsWith('custom_') && (
          <>
            <button 
              onClick={() => navigate(`/edit-recipe/${id}`)} 
              className="btn btn-primary"
            >
              Edit Recipe
            </button>
            <button 
              onClick={handleDelete} 
              className="btn btn-danger"
            >
              Delete Recipe
            </button>
          </>
        )}
        <button 
          onClick={toggleFavorite} 
          className="btn btn-secondary"
        >
          {isAlreadyFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-secondary"
        >
          Back
        </button>
      </div>
    </div>
  )
}

export default RecipeDetail 
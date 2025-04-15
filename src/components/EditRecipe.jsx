import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { recipeApi } from '../services/recipeApi'

function EditRecipe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    cuisine: '',
    servings: '',
    image: '',
  })

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if this is a custom recipe
        if (!id.startsWith('custom_')) {
          setError('Only custom recipes can be edited')
          return
        }

        // Get custom recipes from localStorage
        const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || []
        const recipe = customRecipes.find(r => r.uri === id)

        if (!recipe) {
          setError('Recipe not found')
          return
        }

        setFormData({
          title: recipe.label,
          ingredients: recipe.ingredientLines.join('\n'),
          instructions: recipe.instructions.join('\n'),
          cuisine: recipe.cuisineType[0],
          servings: recipe.yield.toString(),
          image: recipe.image,
        })
      } catch (err) {
        setError('Failed to load recipe')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipe()
  }, [id])

  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      // Get existing recipes
      const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || []
      
      // Create updated recipe object
      const updatedRecipe = {
        uri: id,
        label: formData.title,
        image: formData.image,
        cuisineType: [formData.cuisine || 'Other'],
        ingredientLines: formData.ingredients.split('\n').filter(line => line.trim()),
        instructions: formData.instructions.split('\n').filter(line => line.trim()),
        yield: parseInt(formData.servings) || 4,
      }

      // Update the recipe in the array
      const updatedRecipes = customRecipes.map(recipe => 
        recipe.uri === id ? updatedRecipe : recipe
      )

      // Save back to localStorage
      localStorage.setItem('customRecipes', JSON.stringify(updatedRecipes))
      
      // Navigate back to recipe detail
      navigate(`/recipe/${id}`)
    } catch (error) {
      setError('Failed to save changes')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) return <p className="loading">Loading...</p>
  if (error) {
    return (
      <div className="form-container">
        <p className="error-message">{error}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-secondary"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="form-container">
      <h2>Edit Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Recipe Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ingredients">Ingredients</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            className="form-input"
            rows="8"
          />
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            className="form-input"
            rows="8"
          />
        </div>

        <div className="form-group">
          <label htmlFor="cuisine">Cuisine</label>
          <select
            id="cuisine"
            name="cuisine"
            value={formData.cuisine}
            onChange={handleChange}
            className="form-input"
          >
            <option value="">Select Cuisine</option>
            <option value="American">American</option>
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
            <option value="Chinese">Chinese</option>
            <option value="Japanese">Japanese</option>
            <option value="Indian">Indian</option>
            <option value="French">French</option>
            <option value="Spanish">Spanish</option>
            <option value="Thai">Thai</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="servings">Servings</label>
          <input
            type="number"
            id="servings"
            name="servings"
            value={formData.servings}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditRecipe 
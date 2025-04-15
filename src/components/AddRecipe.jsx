import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddRecipe() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    cuisine: '',
    servings: '',
    image: '',
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.ingredients.trim()) {
      newErrors.ingredients = 'Ingredients are required'
    }
    if (!formData.instructions.trim()) {
      newErrors.instructions = 'Instructions are required'
    }
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required'
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length === 0) {
      try {
        // Create recipe object
        const newRecipe = {
          uri: `custom_${Date.now()}`, // Prefix with 'custom_' to distinguish from API recipes
          label: formData.title,
          image: formData.image,
          cuisineType: formData.cuisine ? [formData.cuisine] : ['Other'],
          ingredientLines: formData.ingredients.split('\n').filter(line => line.trim()),
          instructions: formData.instructions.split('\n').filter(line => line.trim()),
          yield: parseInt(formData.servings) || 4,
        }

        // Get existing custom recipes
        const existingRecipes = JSON.parse(localStorage.getItem('customRecipes')) || []
        
        // Add new recipe
        const updatedRecipes = [...existingRecipes, newRecipe]
        
        // Save to localStorage
        localStorage.setItem('customRecipes', JSON.stringify(updatedRecipes))
        
        // Navigate back to home
        navigate('/')
      } catch (error) {
        setErrors({ submit: 'Failed to save recipe. Please try again.' })
      }
    } else {
      setErrors(newErrors)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="form-container">
      <h2>Add New Recipe</h2>
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
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="form-input"
            placeholder="https://example.com/image.jpg"
          />
          {errors.image && <span className="error">{errors.image}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="cuisine">Cuisine Type</label>
          <input
            type="text"
            id="cuisine"
            name="cuisine"
            value={formData.cuisine}
            onChange={handleChange}
            className="form-input"
            placeholder="Italian, Mexican, etc."
          />
        </div>

        <div className="form-group">
          <label htmlFor="ingredients">Ingredients (one per line)</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            className="form-input"
            rows="6"
          />
          {errors.ingredients && <span className="error">{errors.ingredients}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="instructions">Instructions (one step per line)</label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            className="form-input"
            rows="6"
          />
          {errors.instructions && <span className="error">{errors.instructions}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="servings">Number of Servings</label>
          <input
            type="number"
            id="servings"
            name="servings"
            value={formData.servings}
            onChange={handleChange}
            className="form-input"
            min="1"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Add Recipe
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddRecipe 
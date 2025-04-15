import axios from 'axios'

const api = axios.create({
  baseURL: 'https://www.themealdb.com/api/json/v1/1',
})

export const recipeApi = {
  // Search recipes
  searchRecipes: async (query = '') => {
    try {
      const response = await api.get(query 
        ? `/search.php?s=${query}` 
        : '/search.php?s='  // Returns random meals if no query
      )
      
      if (!response.data || !response.data.meals) {
        return []
      }
      
      // Transform MealDB format to match our app's structure
      const hits = response.data.meals.map(meal => ({
        recipe: {
          uri: meal.idMeal,
          label: meal.strMeal,
          image: meal.strMealThumb,
          cuisineType: [meal.strArea || 'Unknown'],
          ingredientLines: getIngredientLines(meal),
          instructions: meal.strInstructions.split('\r\n').filter(Boolean),
          totalTime: 0,
          yield: 4,
        }
      }))
      
      return hits
    } catch (error) {
      console.error('Error searching recipes:', error)
      throw error
    }
  },

  // Get recipe by ID
  getRecipeById: async (id) => {
    try {
      // Check if this is a custom recipe
      if (id.startsWith('custom_')) {
        const customRecipes = JSON.parse(localStorage.getItem('customRecipes')) || []
        const recipe = customRecipes.find(r => r.uri === id)
        
        if (!recipe) {
          throw new Error('Custom recipe not found')
        }
        
        return recipe
      }

      // If not custom, fetch from API
      const response = await api.get(`/lookup.php?i=${id}`)
      
      if (!response.data || !response.data.meals || !response.data.meals[0]) {
        throw new Error('Recipe not found')
      }

      const meal = response.data.meals[0]
      
      // Transform to match our app's structure
      return {
        uri: meal.idMeal,
        label: meal.strMeal,
        image: meal.strMealThumb,
        cuisineType: [meal.strArea || 'Unknown'],
        ingredientLines: getIngredientLines(meal),
        instructions: meal.strInstructions.split('\r\n').filter(Boolean),
        totalTime: 0,
        yield: 4,
      }
    } catch (error) {
      console.error('Error fetching recipe:', error)
      throw error
    }
  }
}

// Helper function to extract ingredients from MealDB format
function getIngredientLines(meal) {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]
    const measure = meal[`strMeasure${i}`]
    if (ingredient && ingredient.trim()) {
      ingredients.push(`${measure.trim()} ${ingredient.trim()}`)
    }
  }
  return ingredients
}
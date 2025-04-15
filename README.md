# Recipe Management App

By: Cali Crouse
Date: 12/10/2024 (Final date: 12/13/2024)

## Purpose Statement
A user-friendly recipe management applicationand for recipe organization.The app combines recipes from TheMealDB API with user-created custom recipes.

## Features
- Browse a collection of recipes from TheMealDB API
- Search recipes by name
- Add custom recipes with detailed information
- Edit and delete custom recipes
- Mark any recipe (API or custom) as favorite
- View detailed recipe instructions and ingredients

## User Guide

### Browsing Recipes
- The home page displays a grid of recipes from both TheMealDB and your custom recipes
- Use the search bar to find specific recipes
- Custom recipes are marked with a blue "Custom Recipe" badge
- Click "View Details" to see the full recipe

### Managing Custom Recipes
- Click "Add Recipe" in the navigation to create a new recipe
- Required fields include:
  - Recipe title
  - Ingredients (one per line)
  - Instructions (one per line)
  - Image URL
- Custom recipes can be edited or deleted from their detail view

### Favorites
- Click "Add to Favorites" on any recipe to save it
- Access your favorites through the "Favorites" navigation link
- Remove recipes from favorites at any time

## Technical Implementation
- Built with React and Vite
- Uses TheMealDB's free API for recipe data
- Local storage for custom recipes and favorites

## Components Structure
1. Header (Navigation)
2. RecipeList (Main view with search)
3. RecipeDetail (Individual recipe view)
4. AddRecipe (Form for new recipes)
5. EditRecipe (Form for modifying custom recipes)
6. FavoriteRecipes (Saved recipes view)

## Data Storage
- Custom recipes stored in localStorage under 'customRecipes'
- Favorite recipes stored in localStorage under 'favoriteRecipes'
- API recipes fetched from TheMealDB

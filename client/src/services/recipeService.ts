import { Ingredient } from '../types/Ingredient';
import { Recipe } from '../types/Recipe';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Sends a POST request to generate a new recipe using selected ingredients.
 * Strips out internal fields like `id` before sending.
 */
export async function handleGenerateRecipe(token: string, ingredients: Ingredient[]): Promise<Recipe> {
  const payload = ingredients.map(({ name, quantity, unit }) => ({ name, quantity, unit }));

  const response = await fetch(`${API_URL}/recipes/generate`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients: payload }),
  });

  if (!response.ok) {
    throw new Error(`Failed to generate recipe (${response.status})`);
  }

  const data = await response.json() as Recipe;

  if (!data.id || typeof data.id !== 'string' || data.id.length !== 24) {
    console.error("Invalid or missing ID from generated recipe:", data);
    throw new Error("Generated recipe is missing a valid ID.");
  }

  return data;
}

/**
 * Fetches a single recipe by ID from the backend.
 * Requires an auth token for user-specific data.
 */
export async function fetchRecipeById(token: string, recipeId: string): Promise<Recipe> {
  if (!recipeId || recipeId.length !== 24) {
    throw new Error(`Invalid recipe ID: ${recipeId}`);
  }

  const response = await fetch(`${API_URL}/recipes/${recipeId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: Could not load recipe`);
  }

  return await response.json();
}
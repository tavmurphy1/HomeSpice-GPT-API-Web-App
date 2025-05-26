import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Recipe } from '../types/Recipe';
import { fetchRecipeById } from '../services/recipeService';

const ERROR_LOADING = 'Loading recipe…';
const ERROR_FETCH_FAILED = 'Something went wrong';
const ERROR_NO_RECIPE = 'No recipe found.';

export default function RecipeIndividualPage() {
  const { recipeId } = useParams();
  const { token } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recipeId || !token) return;

    // Fetch a specific recipe from the backend using the recipe ID and auth token
    const fetchRecipe = async () => {
      try {
        const data = await fetchRecipeById(token, recipeId);
        setRecipe(data);
      } catch (err: any) {
        setError(err.message || ERROR_FETCH_FAILED);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId, token]);

  if (loading) return <p>{ERROR_LOADING}</p>;
  if (error) return <p className="error">{error}</p>;
  if (!recipe) return <p>{ERROR_NO_RECIPE}</p>;

  return (
    <div className="recipe-individual-page">
      <h1>{recipe.title}</h1>
      {recipe.description && <p>{recipe.description}</p>}

      <h3>Ingredients:</h3>
      <ul>
        {recipe.ingredients.map((ing, idx) => (
          <li key={idx}>
            {ing.quantity} {ing.unit} {ing.name}
          </li>
        ))}
      </ul>

      <h3>Steps:</h3>
      <ol>
        {recipe.steps.map((step, idx) => (
          <li key={idx}>{step}</li>
        ))}
      </ol>

      {recipe.image_url && (
        <img src={recipe.image_url} alt={recipe.title || "Recipe image"} />
      )}
    </div>
  );
}
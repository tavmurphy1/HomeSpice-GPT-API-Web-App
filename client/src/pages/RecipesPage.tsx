import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditIcon from '../components/icons/EditIcon';
import TrashIcon from '../components/icons/TrashIcon';
import { useAuth } from '../context/AuthContext';
import { getPantry } from '../services/pantryService';
import { handleGenerateRecipe } from '../services/recipeService';
import type { Ingredient } from '../types/Ingredient';
import type { Recipe } from '../types/Recipe';
import '../styles/RecipesPage.css';

// listen to port 8080
const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8080';

export default function RecipesPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchRecipes = async () => {
    try {
      const res = await fetch(`${API_URL}/recipes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      const data: Recipe[] = await res.json();

      setRecipes(data);
    } catch (err: any) {
      console.error("[ERROR] Fetching recipes failed:", err.message);
      setError(err.message || 'Could not load recipes');
    } finally {
      setLoading(false);
    }
  };

  fetchRecipes();
  }, [token]);

  // Navigate to individual recipe page
  const handleView = (id: string) => {
    navigate(`/recipes/${id}`);
  };

  // Delete a recipe from the backend and remove it from local state
  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/recipes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete recipe');
    }
  };
  // Generate a new recipe using pantry ingredients
  const handleGenerate = async () => {
    if (!token) return;
    setError(null);

    try {
       // get pantry and filter for ingredients with quantity > 0
      const pantryCopy: Ingredient[] = await getPantry(token);
      const usableIngredients = pantryCopy.filter(i => i.quantity > 0);

      if (usableIngredients.length === 0) {
        setError('Your pantry has no ingredients with quantity greater than 0.');
        return;
      }
      // Get GPT-generated recipe using ingredients + token
      const newRecipe = await handleGenerateRecipe(token, usableIngredients);
      setRecipes((prev) => [newRecipe, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate recipe');
    }
  };

  if (loading) return <p>Loading recipes…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="recipes-page">
      <h1>Your Recipes</h1>

      {recipes.length === 0 ? (
        <p>You have no saved recipes.</p>
      ) : (
        <div className="recipe-list">
          {recipes.map((r) => (
            <div
              key={r.id}
              className="recipe-card clickable-card"
              onClick={() => handleView(r.id)}
            >
              <div className="recipe-card-content">
                <h2 className="recipe-title">{r.title}</h2>
                {r.description && <p className="recipe-desc">{r.description}</p>}
              </div>

              <div
                className="recipe-actions"
                onClick={(e) => e.stopPropagation()} // prevent bubbling to card click
              >
                <button onClick={() => handleView(r.id)} className="icon-button">
                  <EditIcon />
                </button>
                <button onClick={() => handleDelete(r.id)} className="icon-button">
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="generate-button" onClick={handleGenerate}>
        Generate New Recipe
      </button>
    </div>
  );
}
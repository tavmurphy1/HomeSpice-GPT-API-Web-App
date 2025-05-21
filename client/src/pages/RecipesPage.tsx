import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditIcon from '../components/icons/EditIcon';
import TrashIcon from '../components/icons/TrashIcon';
import { useAuth } from '../context/AuthContext';
import '../styles/RecipesPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: string[];
  steps: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  image_url: string | null;
}

export default function RecipesPage() {
  const { token } = useAuth();    // Firebase ID token
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)

  // Fetch current user's save recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(`${API_URL}/recipes`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type':  'application/json',
          },
        });
        if (!res.ok) {
          throw new Error(`Server responded ${res.status}`);
        }
        const data: Recipe[] = await res.json();
        setRecipes(data);
      } catch (err: any) {
        setError(err.message || 'Could not load recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [token]);

  // Navigate to individual recipe page
  const handleView = (id: string) => {
    navigate(`/recipe/${id}`);
  };

  // Delete recipe on server and remove from local state
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

  // Render loading or error states
  if (loading) return <p>Loading recipes…</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <div className="recipes-page">
      <h1>Your Recipes</h1>

      {recipes.length === 0 ? (
        <p>You have no saved recipes.</p>
      ) : (
        <div className="recipe-list">
          {recipes.map((r) => (
            <div key={r.id} className="recipe-card">
              <span className="recipe-title">{r.title}</span>
              {r.description && <p className="recipe-desc">{r.description}</p>}

              <div className="recipe-actions">
                <button
                  onClick={() => handleView(r.id)}
                  aria-label="View or edit recipe"
                  className="icon-button"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  aria-label="Delete recipe"
                  className="icon-button"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    {/* Generate New Recipe button */}
    <button
      className="generate-button"
      onClick={() => navigate('/recipes/generate')}
    >
      Generate New Recipe
    </button>
    </div>
  );
}
import type { Ingredient, IngredientBase } from '../types/Ingredient';

const API_URL = import.meta.env.VITE_API_URL; // || 'http://localhost:8080'; (commented out for deployment)
console.log("[pantryService] API_URL =", API_URL);

/**
 * Fetches all pantry ingredients for the current user.
 * @param token Auth token
 * @returns Array of ingredients
 */
export async function getPantry(token: string): Promise<Ingredient[]> {
  const response = await fetch(`${API_URL}/ingredients/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch pantry (${response.status})`);
  }

  const raw = await response.json();
  return raw.map((item: any) => ({
    ...item,
    // going from _id to id to add unique id to ingredients
    id: item.id ?? item._id,   
  }));
}
/**
 * Adds a new ingredient to the pantry.
 * @param token Auth token
 * @param ingredient Ingredient data (without ID)
 * @returns The newly created ingredient
 */
export async function addIngredient(
  token: string,
  ingredient: IngredientBase
): Promise<Ingredient> {
  const res = await fetch(`${API_URL}/ingredients/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ingredient),
  });

  if (!res.ok) {
    throw new Error(`Failed to add ingredient (${res.status})`);
  }

  const data = await res.json();
  return {
    ...data,
    //SWITCH _ID TO ID to for unique key issue
    id: data.id ?? data._id,  
  };
}
/**
 * Updates an existing ingredient by ID.
 * @param token Auth token
 * @param id Ingredient ID
 * @param ingredient Updated ingredient data (without ID)
 * @returns The updated ingredient
 */
export async function updateIngredient(
  token: string,
  id: string,
  ingredient: IngredientBase
): Promise<Ingredient> {
  const res = await fetch(`${API_URL}/ingredients/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ingredient),
  });

  if (!res.ok) {
    throw new Error(`Failed to update ingredient (${res.status})`);
  }

  const data = await res.json();
  return {
    ...data,
    // _id to id for key ingredients
    id: data.id ?? data._id,  
  };
}


/**
 * Deletes an ingredient from the pantry by ID.
 * @param token Auth token
 * @param id Ingredient ID
 */
export async function deleteIngredient(
  token: string,
  id: string
): Promise<void> {
  const res = await fetch(`${API_URL}/ingredients/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to delete ingredient (${res.status})`);
  }
}
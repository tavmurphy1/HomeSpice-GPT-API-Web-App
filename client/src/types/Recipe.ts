import type { IngredientBase } from './Ingredient'; 

export interface RecipeBase {
  title: string;
  description?: string;
  ingredients: IngredientBase[];
  steps: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  image_url: string | null;
}

export interface Recipe extends RecipeBase {
  id: string;
}
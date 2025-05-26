export interface IngredientBase {
  name: string;
  quantity: number;
  unit: string;
}

export interface Ingredient extends IngredientBase {
  id: string;
}
// Recipe API types
export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  image?: string;
  dietary_preferences?: string[];
  created_at: string;
}

// Route parameter types for API compatibility
export interface RecipeRouteParams {
  params: {
    id: string;
  };
}
export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  image?: string;
  dietary_preferences?: string[];
  created_at?: string;
}
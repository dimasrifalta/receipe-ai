'use client';

import { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipeId: string) => void;
}

export default function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  return (
    <div 
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
      onClick={() => onSelect(recipe.id)}
    >
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
        <p className="text-gray-600 mb-3">{recipe.description}</p>
        
        <div className="flex justify-between items-center text-sm mb-3">
          <div className="flex items-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1 text-gray-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <span>{recipe.cookingTime}</span>
          </div>
          <div className="text-gray-500">
            {recipe.ingredients.length} ingredients
          </div>
        </div>
        
        <div className="mb-3">
          <h4 className="font-medium text-sm mb-1">Ingredients preview:</h4>
          <ul className="text-sm text-gray-600">
            {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
              <li key={index} className="truncate">{ingredient}</li>
            ))}
            {recipe.ingredients.length > 3 && (
              <li className="text-blue-500">+{recipe.ingredients.length - 3} more</li>
            )}
          </ul>
        </div>
        
        <button 
          className="w-full py-2 text-center border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(recipe.id);
          }}
        >
          View Recipe
        </button>
      </div>
    </div>
  );
}
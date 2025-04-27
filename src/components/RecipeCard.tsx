'use client';

import { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipeId: string) => void;
}

export default function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  return (
    <div 
      className="backdrop-blur-sm bg-white/70 dark:bg-black/40 border border-gray-200/70 dark:border-gray-800/50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={() => onSelect(recipe.id)}
    >
      <div className="p-6">
        <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-100">{recipe.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{recipe.description}</p>
        
        <div className="flex justify-between items-center text-sm mb-3">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
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
          <div className="text-gray-500 dark:text-gray-400">
            {recipe.ingredients.length} ingredients
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-1 text-gray-700 dark:text-gray-300">Ingredients preview:</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
              <li key={index} className="truncate">{ingredient}</li>
            ))}
            {recipe.ingredients.length > 3 && (
              <li className="text-green-600 dark:text-green-400">+{recipe.ingredients.length - 3} more</li>
            )}
          </ul>
        </div>
        
        <button 
          className="w-full py-2 text-center border border-green-400/70 text-green-700 dark:text-green-400 rounded-full hover:bg-green-50/50 dark:hover:bg-green-900/20 transition-colors"
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
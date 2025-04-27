'use client';

import { Recipe } from '@/types/recipe';

interface RecipeDetailsProps {
  recipe: Recipe;
  onBack?: () => void;
}

export default function RecipeDetails({ recipe, onBack }: RecipeDetailsProps) {
  return (
    <div className="backdrop-blur-sm bg-white/70 dark:bg-black/40 border border-gray-200/70 dark:border-gray-800/50 rounded-xl shadow-sm p-8 max-w-3xl mx-auto">
      {onBack && (
        <button 
          onClick={onBack}
          className="mb-4 flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to recipes
        </button>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-light mb-2 text-gray-800 dark:text-gray-100">{recipe.title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{recipe.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
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
          <span>Cooking Time: {recipe.cookingTime}</span>
        </div>
        
        {recipe.dietary_preferences && recipe.dietary_preferences.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {recipe.dietary_preferences.map((pref, index) => (
              <span key={index} className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                {pref}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-medium mb-4 border-b border-gray-200/70 dark:border-gray-700/50 pb-2 text-gray-800 dark:text-gray-100">Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-3 h-3 rounded-full bg-green-600 mt-1.5 mr-3"></span>
                <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h2 className="text-xl font-medium mb-4 border-b border-gray-200/70 dark:border-gray-700/50 pb-2 text-gray-800 dark:text-gray-100">Instructions</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex">
                <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-gray-700 dark:text-gray-300">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={() => window.print()} 
          className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-full transition-colors flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print Recipe
        </button>
      </div>
    </div>
  );
}
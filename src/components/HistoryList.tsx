import React from 'react';
import Link from 'next/link';
import { Recipe } from '@/types/recipe';

interface HistoryListProps {
  recipes: Recipe[];
}

export function HistoryList({ recipes }: HistoryListProps) {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <p className="text-lg text-gray-600 dark:text-gray-300 font-light">No recipe history yet. Start generating recipes!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
          <div className="p-6 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-100">{recipe.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm">{recipe.description}</p>
              
              {recipe.dietary_preferences && recipe.dietary_preferences.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {recipe.dietary_preferences.map((pref, index) => (
                    <span key={index} className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                      {pref}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {recipe.created_at ? new Date(recipe.created_at).toLocaleDateString() : 'Unknown date'}
              </span>
              <Link 
                href={`/recipe/${recipe.id}`} 
                className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-full text-sm w-fit transition-colors"
              >
                View Recipe
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
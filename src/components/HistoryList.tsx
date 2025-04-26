import React from 'react';
import Link from 'next/link';
import { Recipe } from '@/types/recipe';

interface HistoryListProps {
  recipes: Recipe[];
}

export function HistoryList({ recipes }: HistoryListProps) {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center p-10 backdrop-blur-sm bg-white/40 dark:bg-black/20 rounded-lg border border-gray-100/60 dark:border-gray-800/60">
        <p className="text-lg text-gray-600 dark:text-gray-400 font-light">No recipe history yet. Start generating recipes!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="backdrop-blur-sm bg-white/60 dark:bg-black/30 rounded-lg shadow-sm border border-gray-100/60 dark:border-gray-800/60 overflow-hidden hover:shadow-md transition-all">
          <div className="p-6">
            <h3 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-200">{recipe.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm">{recipe.description}</p>
            
            {recipe.dietary_preferences && recipe.dietary_preferences.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {recipe.dietary_preferences.map((pref, index) => (
                  <span key={index} className="px-2 py-0.5 bg-green-100/70 text-green-800 text-xs rounded-full">
                    {pref}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {recipe.created_at ? new Date(recipe.created_at).toLocaleDateString() : 'Unknown date'}
              </span>
              <Link href={`/recipe/${recipe.id}`} className="inline-flex items-center px-4 py-2 bg-blue-500/85 hover:bg-blue-600/90 text-white text-sm rounded-md transition-colors">
                View Recipe
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
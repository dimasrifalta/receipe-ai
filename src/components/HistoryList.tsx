import React from 'react';
import Link from 'next/link';
import { Recipe } from '@/types/recipe';

interface HistoryListProps {
  recipes: Recipe[];
}

export function HistoryList({ recipes }: HistoryListProps) {
  if (!recipes || recipes.length === 0) {
    return (
      <div className="text-center p-10">
        <p className="text-lg text-gray-600">No recipe history yet. Start generating recipes!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{recipe.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
            
            {recipe.dietary_preferences && recipe.dietary_preferences.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {recipe.dietary_preferences.map((pref, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {pref}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                {recipe.created_at ? new Date(recipe.created_at).toLocaleDateString() : 'Unknown date'}
              </span>
              <Link href={`/recipe/${recipe.id}`} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                View Recipe
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
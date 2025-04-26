'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HistoryList } from '@/components/HistoryList';
import { Recipe } from '@/types/recipe';

export default function HistoryPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipeHistory() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/history');
        
        if (!response.ok) {
          throw new Error('Failed to fetch recipe history');
        }
        
        const data = await response.json();
        setRecipes(data.recipes || []);
      } catch (err) {
        console.error('Error fetching recipe history:', err);
        setError('Failed to load recipe history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecipeHistory();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Your Recipe History</h1>
        <Link 
          href="/" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Generate New Recipes
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center p-10 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <HistoryList recipes={recipes} />
      )}
    </div>
  );
}
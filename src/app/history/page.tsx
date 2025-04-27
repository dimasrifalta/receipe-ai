'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HistoryList } from '@/components/HistoryList';
import { Recipe } from '@/types/recipe';
import { useAuth } from '@/contexts/AuthContext';

export default function HistoryPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [user, authLoading, router]);

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

    if (user) {
      fetchRecipeHistory();
    }
  }, [user]);

  // If still loading authentication or not authenticated, show a loading state
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-16">
      {/* Navigation */}
      <nav className="backdrop-blur-sm bg-white/30 dark:bg-black/20 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm fixed w-full top-0 left-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-blue-500 text-xl font-medium">Recipe AI</Link>
            <Link href="/home" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors text-sm">
              Generate Recipes
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Hello, {user.email?.split('@')[0]}
            </span>
          </div>
        </div>
      </nav>

      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-light text-gray-900 dark:text-gray-100">Your Recipe History</h1>
        <Link 
          href="/home" 
          className="inline-flex items-center px-4 py-2 bg-blue-500/85 hover:bg-blue-600/90 text-white rounded-md transition-colors"
        >
          Generate New Recipes
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center p-10 bg-red-50/70 dark:bg-red-900/20 backdrop-blur-sm rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : (
        <HistoryList recipes={recipes} />
      )}
    </div>
  );
}
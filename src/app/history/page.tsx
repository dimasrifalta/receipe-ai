'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HistoryList } from '@/components/HistoryList';
import { Recipe } from '@/types/recipe';
import Header from '@/components/Header';
import Link from 'next/link';
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
  
  // Remove the handleSignOut function as it's now handled by the Header component

  useEffect(() => {
    async function fetchRecipeHistory() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/history', {
          // Include credentials to send auth cookies with the request
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          // Handle specific error cases
          if (response.status === 401) {
            throw new Error('Please log in to view your recipe history');
          }
          
          const errorData = await response.json().catch(() => null);
          if (errorData?.error) {
            throw new Error(errorData.error);
          }
          
          throw new Error('Failed to fetch recipe history');
        }
        
        const data = await response.json();
        setRecipes(data.recipes || []);
      } catch (err) {
        console.error('Error fetching recipe history:', err);
        setError(err instanceof Error ? err.message : 'Failed to load recipe history. Please try again later.');
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Replace custom navigation with Header component */}
      <Header />
      
      <main className="flex-grow pt-24 px-4 md:px-0">
        <div className="container mx-auto max-w-6xl">
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-light mb-6 text-gray-800 dark:text-gray-100 leading-tight">
              Your Recipe <span className="font-medium text-green-600 dark:text-green-400">History</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Browse through your previously generated recipes
            </p>
          </header>

          <div className="mb-10 flex items-center justify-end">
            <Link 
              href="/home" 
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-sm transition-colors font-medium"
            >
              Generate New Recipes
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="text-center p-10 bg-red-50/70 dark:bg-red-900/20 backdrop-blur-sm rounded-lg">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center p-10 bg-gray-50/70 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-light text-gray-800 dark:text-gray-200 mb-4">No recipes yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't generated any recipes yet. Try creating some!</p>
              <Link 
                href="/home" 
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-sm transition-colors font-medium"
              >
                Create Your First Recipe
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <HistoryList recipes={recipes} />
            </div>
          )}
        </div>
      </main>

      <footer className="py-8 px-4 text-center text-gray-500 text-sm">
        <p>© 2025 Recipe AI. All recipes are generated by AI and should be reviewed before use.</p>
      </footer>
    </div>
  );
}
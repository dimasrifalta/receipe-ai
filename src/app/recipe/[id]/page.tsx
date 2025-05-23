'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Recipe } from '@/types/recipe';
import RecipeDetails from '@/components/RecipeDetails';
import Header from '@/components/Header';
  import { supabase } from '@/lib/supabaseClient';

export default function RecipePage({ params }: { params: { id: string } }) {
  // Safely extract the ID using React.use() to handle the Promise
  const id = React.use(params).id;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipeDetails() {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          console.error('[HomePage] Error getting session:', sessionError);
          throw new Error('Failed to get authentication session');
        }

        if (!sessionData.session) {
          console.error('[HomePage] No active session found');
          throw new Error('No active session. Please log in again.');
        }

        const token = sessionData.session.access_token;
        console.log('[HomePage] Session token available:', !!token);

        if (!token) {
          throw new Error(
            'Authentication token not available. Please log in again.'
          );
        }

        // Check if the user is authenticated
        const response = await fetch(`/api/recipe/${id}`, {
          // Include credentials to send cookies with the request
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the token in Authorization header
          },
          credentials: 'include', // Include cookies as well for redundancy
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Please log in to view this recipe');
          }
          if (response.status === 404) {
            throw new Error('Recipe not found');
          }
          throw new Error('Failed to fetch recipe details');
        }

        const data = await response.json();
        setRecipe(data.recipe);
      } catch (err) {
        console.error('Error fetching recipe details:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again later.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      fetchRecipeDetails();
    }
  }, [id]);

  return (
    <div className='min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900'>
      {/* Replace custom navigation with Header component */}
      <Header />
      <div className='container mx-auto px-4 py-8 mt-10'>
        <div className='mb-8 flex items-center justify-between'>
          <h1 className='text-3xl font-light text-gray-900 dark:text-gray-100'>
            {isLoading
              ? 'Loading Recipe...'
              : recipe?.title || 'Recipe Details'}
          </h1>
          <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3 sm:mt-0'>
            <Link
              href='/history'
              className='inline-flex items-center justify-center px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors'>
              Back to History
            </Link>
            <Link
              href='/home'
              className='inline-flex items-center justify-center px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-full shadow-sm transition-colors font-medium'>
              Generate New Recipe
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className='flex justify-center items-center min-h-[300px] md:min-h-[400px]'>
            <div className='animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-green-600'></div>
          </div>
        ) : error ? (
          <div className='text-center p-6 md:p-10 bg-red-50/70 dark:bg-red-900/20 backdrop-blur-sm rounded-lg border border-red-100/60 dark:border-red-900/40 mx-auto max-w-md'>
            <p className='text-red-600 dark:text-red-400 mb-4'>{error}</p>
            <Link
              href='/history'
              className='inline-flex items-center justify-center px-6 py-2 md:py-3 bg-green-600 hover:bg-green-700 text-white text-sm md:text-base rounded-full shadow-sm transition-colors font-medium'>
              Back to History
            </Link>
          </div>
        ) : recipe ? (
          <RecipeDetails recipe={recipe} />
        ) : null}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import IngredientInput from '@/components/IngredientInput';
import DietaryPreferences from '@/components/DietaryPreferences';
import RecipeCard from '@/components/RecipeCard';
import RecipeDetails from '@/components/RecipeDetails';
import Header from '@/components/Header';
import { Recipe } from '@/types/recipe';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const { user, isLoading: authLoading, signOut } = useAuth();
  const router = useRouter();
  
  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      // Redirect to login if not authenticated
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    setError(null);
    setIsLoading(true);
    setRecipes([]);
    setSelectedRecipeId(null);

    try {
      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ingredients,
          dietaryPreferences,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipes');
      }

      const data = await response.json();
      setRecipes(data.recipes);
    } catch (err) {
      setError('An error occurred while generating recipes. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedRecipe = recipes.find(recipe => recipe.id === selectedRecipeId);

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
      <Header />
      
      <main className="flex-grow pt-24 px-4 md:px-0">
        <div className="container mx-auto max-w-6xl">
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-light mb-6 text-gray-800 dark:text-gray-100 leading-tight">
              Create Your <span className="font-medium text-green-600 dark:text-green-400">Perfect Recipe</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Enter your ingredients and preferences, and we'll do the rest
            </p>
          </header>

          {selectedRecipe ? (
            <RecipeDetails 
              recipe={selectedRecipe} 
              onBack={() => setSelectedRecipeId(null)} 
            />
          ) : (
            <>
              <section className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-10">
                <div className="max-w-3xl mx-auto">
                  <IngredientInput 
                    ingredients={ingredients} 
                    setIngredients={setIngredients} 
                  />
                  
                  <DietaryPreferences 
                    dietaryPreferences={dietaryPreferences} 
                    setDietaryPreferences={setDietaryPreferences} 
                  />
                  
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleGenerateRecipes}
                      disabled={isLoading || ingredients.length === 0}
                      className={`
                        px-6 py-3 rounded-full font-medium text-white shadow-sm
                        ${isLoading || ingredients.length === 0 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-green-600 hover:bg-green-700 transition-colors'}
                      `}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating Recipes...
                        </>
                      ) : (
                        'Generate Recipes'
                      )}
                    </button>
                  </div>
                  
                  {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-center">
                      {error}
                    </div>
                  )}
                </div>
              </section>
              
              {recipes.length > 0 && (
                <section className="mb-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-light text-gray-800 dark:text-gray-100">
                      Your Recipes
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      Personalized to your ingredients and preferences
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onSelect={(id) => setSelectedRecipeId(id)}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="py-8 px-4 text-center text-gray-500 text-sm">
        <p>© 2025 Recipe AI. All recipes are generated by AI and should be reviewed before use.</p>
      </footer>
    </div>
  );
}
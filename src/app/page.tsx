'use client';

import { useState } from 'react';
import Link from 'next/link';
import IngredientInput from '@/components/IngredientInput';
import DietaryPreferences from '@/components/DietaryPreferences';
import RecipeCard from '@/components/RecipeCard';
import RecipeDetails from '@/components/RecipeDetails';
import { Recipe } from '@/types/recipe';

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

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

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-blue-600">AI Recipe Generator</h1>
        <p className="text-xl text-gray-600 mb-4">
          Turn your available ingredients into delicious meals
        </p>
        <Link 
          href="/history" 
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
        >
          View Recipe History
        </Link>
      </header>

      {selectedRecipe ? (
        <RecipeDetails 
          recipe={selectedRecipe} 
          onBack={() => setSelectedRecipeId(null)} 
        />
      ) : (
        <>
          <section className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="max-w-3xl mx-auto">
              <IngredientInput 
                ingredients={ingredients} 
                setIngredients={setIngredients} 
              />
              
              <DietaryPreferences 
                dietaryPreferences={dietaryPreferences} 
                setDietaryPreferences={setDietaryPreferences} 
              />
              
              <div className="mt-6 text-center">
                <button
                  onClick={handleGenerateRecipes}
                  disabled={isLoading || ingredients.length === 0}
                  className={`
                    px-6 py-3 rounded font-semibold text-white shadow-sm
                    ${isLoading || ingredients.length === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 transition-colors'}
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
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-center">
                  {error}
                </div>
              )}
            </div>
          </section>
          
          {recipes.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Your Recipe Suggestions</h2>
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

      <footer className="text-center text-gray-500 text-sm pt-8 pb-4">
        <p>© 2025 AI Recipe Generator. All recipes are generated by AI and should be reviewed before use.</p>
      </footer>
    </main>
  );
}

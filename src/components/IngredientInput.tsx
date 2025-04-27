'use client';

import { useState } from 'react';

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
}

export default function IngredientInput({ ingredients, setIngredients }: IngredientInputProps) {
  const [currentIngredient, setCurrentIngredient] = useState('');

  const addIngredient = () => {
    if (currentIngredient.trim() !== '' && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-medium mb-2 text-gray-800 dark:text-gray-100">Ingredients</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">Add ingredients you have or want to use</p>
      
      <div className="flex mb-2">
        <input
          type="text"
          value={currentIngredient}
          onChange={(e) => setCurrentIngredient(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter an ingredient"
          className="flex-grow p-3 border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-l-lg focus:outline-none focus:ring-1 focus:ring-green-400 dark:focus:ring-green-500"
          aria-label="Add ingredient"
        />
        <button
          onClick={addIngredient}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-r-lg transition-colors focus:outline-none"
          aria-label="Add ingredient to list"
        >
          Add
        </button>
      </div>
      
      {ingredients.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-normal mb-2 text-gray-700 dark:text-gray-200">Your ingredients:</h3>
          <ul className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full flex items-center text-sm border border-green-100 dark:border-green-800/40 text-green-700 dark:text-green-300">
                {ingredient}
                <button
                  onClick={() => removeIngredient(index)}
                  className="ml-2 text-green-500 hover:text-red-500 focus:outline-none"
                  aria-label={`Remove ${ingredient}`}
                >
                  <span className="sr-only">Remove</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
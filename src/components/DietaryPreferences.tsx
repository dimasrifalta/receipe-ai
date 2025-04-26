'use client';

interface DietaryPreferencesProps {
  dietaryPreferences: string[];
  setDietaryPreferences: (preferences: string[]) => void;
}

export default function DietaryPreferences({ 
  dietaryPreferences, 
  setDietaryPreferences 
}: DietaryPreferencesProps) {
  const availablePreferences = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Keto',
    'Low-Carb',
    'Paleo',
    'Low-Fat',
    'High-Protein',
    'Nut-Free'
  ];

  const togglePreference = (preference: string) => {
    if (dietaryPreferences.includes(preference)) {
      setDietaryPreferences(dietaryPreferences.filter(p => p !== preference));
    } else {
      setDietaryPreferences([...dietaryPreferences, preference]);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-medium mb-2">Dietary Preferences</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">Select any dietary preferences (optional)</p>
      
      <div className="flex flex-wrap gap-2">
        {availablePreferences.map((preference) => (
          <button
            key={preference}
            onClick={() => togglePreference(preference)}
            className={`px-3 py-1 rounded-full border text-sm transition-colors ${
              dietaryPreferences.includes(preference)
                ? 'bg-blue-400/85 text-white border-blue-400/60'
                : 'bg-white/50 dark:bg-black/20 backdrop-blur-sm text-gray-700 dark:text-gray-300 border-gray-200/60 dark:border-gray-700/40 hover:bg-gray-100/70 dark:hover:bg-gray-800/30'
            }`}
            aria-pressed={dietaryPreferences.includes(preference)}
          >
            {preference}
          </button>
        ))}
      </div>
    </div>
  );
}
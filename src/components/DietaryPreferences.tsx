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
      <h2 className="text-xl font-semibold mb-2">Dietary Preferences</h2>
      <p className="text-gray-600 mb-4">Select any dietary preferences (optional)</p>
      
      <div className="flex flex-wrap gap-2">
        {availablePreferences.map((preference) => (
          <button
            key={preference}
            onClick={() => togglePreference(preference)}
            className={`px-3 py-1 rounded-full border transition-colors ${
              dietaryPreferences.includes(preference)
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
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
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from '@/lib/supabaseClient';

// Initialize OpenAI client
// Note: You need to add OPENAI_API_KEY to your environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { ingredients, dietaryPreferences } = await request.json();

    // Validate request
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Ingredients are required and must be an array' },
        { status: 400 }
      );
    }

    // Prepare prompt for OpenAI
    const prompt = `
      Create ${dietaryPreferences && dietaryPreferences.length > 0 ? dietaryPreferences.join(', ') + ' ' : ''}recipes using some or all of these ingredients: ${ingredients.join(', ')}.
      
      For each recipe, provide:
      1. Recipe title
      2. Short description
      3. List of all ingredients with measurements
      4. Step-by-step preparation instructions
      5. An estimated cooking time
      
      Format the response as a JSON array of recipe objects with the following structure:
      [
        {
          "id": "unique-id-1",
          "title": "Recipe Name",
          "description": "Brief description",
          "ingredients": ["Ingredient 1 with measurement", "Ingredient 2 with measurement", ...],
          "instructions": ["Step 1", "Step 2", ...],
          "cookingTime": "Time in minutes",
          "image": "URL to an image (can be empty)"
        },
        ...
      ]
      
      Provide 3 different recipes. Make them practical, delicious, and suitable for home cooking.
    `;

    // Get recipe suggestions from OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",  // Use appropriate model
      messages: [
        {
          role: "system",
          content: "You are a professional chef specialized in creating delicious, practical recipes from available ingredients."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    // Parse the response
    const content = response.choices[0]?.message?.content || '';
    const recipes = JSON.parse(content).map((recipe: any, index: number) => ({
      ...recipe,
      id: recipe.id || `recipe-${index + 1}`,
    }));

    // Save recipes to Supabase
    for (const recipe of recipes) {
      await supabase.from('recipes').insert({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        cooking_time: recipe.cookingTime,
        image: recipe.image,
        dietary_preferences: dietaryPreferences || [],
        created_at: new Date().toISOString()
      });
    }

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Error generating recipes:', error);
    
    // Fallback to sample recipes in case of API error or during development
    const sampleRecipes = [
      {
        id: "sample-1",
        title: "Quick Pasta Primavera",
        description: "A light and colorful pasta dish loaded with fresh vegetables",
        ingredients: [
          "8 oz pasta", 
          "2 tbsp olive oil", 
          "2 cloves garlic, minced", 
          "1 bell pepper, sliced", 
          "1 zucchini, diced", 
          "1 cup cherry tomatoes, halved", 
          "1/4 cup grated parmesan"
        ],
        instructions: [
          "Cook pasta according to package directions", 
          "Heat olive oil in a large skillet over medium heat", 
          "Add garlic and sauté for 30 seconds", 
          "Add vegetables and cook until tender, about 5 minutes", 
          "Drain pasta and add to the skillet with vegetables", 
          "Toss with parmesan cheese and serve warm"
        ],
        cookingTime: "20 minutes",
        image: ""
      },
      {
        id: "sample-2",
        title: "Classic Omelette",
        description: "Fluffy eggs filled with cheese and vegetables",
        ingredients: [
          "3 large eggs", 
          "2 tbsp butter", 
          "1/4 cup shredded cheese", 
          "Salt and pepper to taste", 
          "2 tbsp chopped fresh herbs (optional)"
        ],
        instructions: [
          "Whisk eggs in a bowl with salt and pepper", 
          "Melt butter in a non-stick skillet over medium heat", 
          "Pour in egg mixture and cook until edges set", 
          "Sprinkle cheese over half of the omelette", 
          "Fold omelette in half and cook until cheese melts", 
          "Garnish with herbs if desired"
        ],
        cookingTime: "10 minutes",
        image: ""
      },
      {
        id: "sample-3",
        title: "Fresh Garden Salad",
        description: "A refreshing and colorful salad with a zesty dressing",
        ingredients: [
          "4 cups mixed greens", 
          "1 cucumber, sliced", 
          "1 cup cherry tomatoes, halved", 
          "1/4 red onion, thinly sliced", 
          "2 tbsp olive oil", 
          "1 tbsp lemon juice", 
          "Salt and pepper to taste"
        ],
        instructions: [
          "Combine all vegetables in a large bowl", 
          "Whisk together olive oil, lemon juice, salt and pepper", 
          "Drizzle dressing over salad and toss to combine", 
          "Serve immediately"
        ],
        cookingTime: "5 minutes",
        image: ""
      }
    ];
    
    // Even for sample recipes, save them to Supabase
    try {
      for (const recipe of sampleRecipes) {
        await supabase.from('recipes').insert({
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          cooking_time: recipe.cookingTime,
          image: recipe.image,
          dietary_preferences: dietaryPreferences || [],
          created_at: new Date().toISOString()
        });
      }
    } catch (dbError) {
      console.error('Error saving sample recipes to database:', dbError);
    }
    
    return NextResponse.json({ 
      recipes: sampleRecipes, 
      note: "Using sample recipes due to API error or during development" 
    });
  }
}
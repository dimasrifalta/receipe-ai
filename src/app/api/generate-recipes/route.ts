import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabaseClient';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

// Initialize Google Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
// Use gemini-1.5-flash instead of gemini-pro to match the current API version
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(request: Request) {
  // Define savedDietaryPreferences at function scope level so it's available in the catch block
  let savedDietaryPreferences: string[] = [];
  
  try {
    // Debug: Log the request headers to trace the auth token
    const headers = Object.fromEntries(request.headers);
    console.log('[API:generate-recipes] Request headers:', {
      authorization: headers.authorization ? 'Bearer token present' : 'No auth header',
      cookie: headers.cookie ? 'Cookies present' : 'No cookies'
    });
    
    // Get the authenticated user's session
    let userId = null;
    
    // Try to get user from token in Authorization header first
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log('[API:generate-recipes] Found authorization token in header');
      
      try {
        // Verify the token and get the user
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (user && !error) {
          userId = user.id;
          console.log('[API:generate-recipes] Authenticated via token header:', userId);
        } else if (error) {
          console.error('[API:generate-recipes] Error authenticating with token:', error);
        }
      } catch (e) {
        console.error('[API:generate-recipes] Error processing auth token:', e);
      }
    }
    
    // If no user from token, try the cookies method
    if (!userId) {
      console.log('[API:generate-recipes] Trying cookie-based authentication');
      const cookieStore = cookies();
      
      // Debug: Log cookie names to verify they're being passed correctly
      const allCookies = cookieStore.getAll();
      console.log('[API:generate-recipes] Cookies available:', allCookies.map(c => c.name));
      
      // Get user session from cookie
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[API:generate-recipes] Session error:', sessionError);
      } else if (session?.user) {
        userId = session.user.id;
        console.log('[API:generate-recipes] Authenticated via cookies:', userId);
      } else {
        console.warn('[API:generate-recipes] No session found in cookies');
      }
    }
    
    // Check if user is authenticated
    if (!userId) {
      console.warn('[API:generate-recipes] Authentication failed: No user ID found');
      return NextResponse.json(
        { error: 'Authentication required. Please log in and try again.' },
        { status: 401 }
      );
    }
    
    console.log('[API:generate-recipes] Successfully authenticated user ID:', userId);
    
    // Parse the request body - ONLY ONCE, don't clone the request
    let requestBody;
    try {
      requestBody = await request.json();
      console.log('[API:generate-recipes] Request body parsed successfully');
    } catch (parseError) {
      console.error('[API:generate-recipes] Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    const { ingredients, dietaryPreferences } = requestBody;
    
    // Save dietary preferences at function scope level for later use
    savedDietaryPreferences = dietaryPreferences || [];
    console.log('[API:generate-recipes] Saved dietary preferences:', savedDietaryPreferences);

    // Validate request
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      console.warn('[API:generate-recipes] Missing or invalid ingredients');
      return NextResponse.json(
        { error: 'Ingredients are required and must be an array' },
        { status: 400 }
      );
    }

    console.log('[API:generate-recipes] Processing request with ingredients:', ingredients);
    
    // Prepare prompt for Google Gemini
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
      IMPORTANT: Make sure the JSON is valid without trailing commas.
    `;

    let recipes;
    
    try {
      
      console.log('[API:generate-recipes] Calling Google Gemini API');
      // Get recipe suggestions from Google Gemini
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();
      
      // Parse the response - first check if it's valid JSON
      let parsedContent;
      try {
        // Clean up common JSON issues:
        // 1. Remove markdown code blocks if present
        let cleanedContent = content.replace(/```json\s+|\s+```/g, '');
        
        // 2. Remove trailing commas from arrays (common error in AI-generated JSON)
        cleanedContent = cleanedContent.replace(/,(\s*[\]}])/g, '$1');
        
        console.log('[API:generate-recipes] Cleaned JSON content:', cleanedContent);
        
        // Try to parse the cleaned content
        try {
          parsedContent = JSON.parse(cleanedContent);
        } catch (innerError) {
          // If direct parsing fails, try to extract JSON array
          const jsonMatch = cleanedContent.match(/\[\s*\{.*\}\s*\]/s);
          if (jsonMatch) {
            parsedContent = JSON.parse(jsonMatch[0]);
          } else {
            throw innerError;
          }
        }
      } catch (jsonError) {
        console.error('[API:generate-recipes] Error parsing Gemini response as JSON:', jsonError);
        console.log('[API:generate-recipes] Raw response content:', content);
        throw new Error('Failed to parse Gemini response as JSON');
      }
      
      if (Array.isArray(parsedContent)) {
        recipes = parsedContent.map((recipe: any, index: number) => ({
          ...recipe,
          id: uuidv4(), // Generate UUID for each recipe
        }));
      } else if (parsedContent.recipes && Array.isArray(parsedContent.recipes)) {
        recipes = parsedContent.recipes.map((recipe: any, index: number) => ({
          ...recipe,
          id: uuidv4(), // Generate UUID for each recipe
        }));
      } else {
        throw new Error('Unexpected response format from Gemini');
      }
      
      console.log('[API:generate-recipes] Successfully generated recipes from Google Gemini');
    } catch (apiError: any) {
      console.error('[API:generate-recipes] Error calling Google Gemini API:', apiError);
      
      // Fall through to the sample recipes section below
      throw apiError;
    }

    // If we successfully got recipes from Gemini, save them to Supabase
    if (recipes && recipes.length > 0) {
      try {
        console.log('[API:generate-recipes] Saving recipes to database');
        // Save recipes to Supabase with the user ID
        for (const recipe of recipes) {
          // Create the data object - USING EXACT DATABASE COLUMN NAMES
          const recipeData = {
            id: recipe.id,
            user_id: userId, 
            title: recipe.title,
            description: recipe.description,
            ingredients: recipe.ingredients,
            // Use 'instructions' instead of 'steps' based on the error message
            instructions: recipe.instructions,
            cooking_time: recipe.cookingTime,
            image: recipe.image || '',
            dietary_preferences: dietaryPreferences || [],
            created_at: new Date().toISOString()
          };
          
          // First check the database schema to debug column names
          const { data: tableInfo, error: tableError } = await supabase
            .from('recipes')
            .select('*')
            .limit(1);
            
          if (tableError) {
            console.error('[API:generate-recipes] Error checking table schema:', tableError);
          } else {
            // If we got some data, log the column names
            if (tableInfo && tableInfo.length > 0) {
              console.log('[API:generate-recipes] Database columns:', Object.keys(tableInfo[0]));
            }
          }
          
          const { error: insertError } = await supabase.from('recipes').insert(recipeData);
          
          if (insertError) {
            console.error('[API:generate-recipes] Error inserting recipe:', insertError);
          }
        }
        console.log('[API:generate-recipes] Successfully saved recipes to database');
      } catch (dbError) {
        console.error('[API:generate-recipes] Error saving recipes to database:', dbError);
        // Continue anyway to return recipes to the user
      }

      return NextResponse.json({ recipes });
    }
    
  } catch (error) {
    console.error('[API:generate-recipes] Error generating recipes:', error);
    
    // Try to get user ID for fallback recipes
    let userId = null;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      userId = session?.user?.id;
      
      if (!userId) {
        // Try from authorization header as last resort
        const authHeader = request.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          const { data: { user } } = await supabase.auth.getUser(token);
          userId = user?.id;
        }
      }
    } catch (authError) {
      console.error('[API:generate-recipes] Error getting user session:', authError);
    }
    
    // If no user ID, we can't proceed
    if (!userId) {
      console.warn('[API:generate-recipes] No user ID for fallback recipes');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Fallback to sample recipes in case of API error or during development
    console.log('[API:generate-recipes] Using sample recipes as fallback');
    const sampleRecipes = [
      {
        id: uuidv4(), // Use UUID instead of static "sample-1"
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
        id: uuidv4(), // Use UUID instead of static "sample-2"
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
        id: uuidv4(), // Use UUID instead of static "sample-3"
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
    
    // The savedDietaryPreferences is now accessible here since it's defined at function scope level
    console.log('[API:generate-recipes] Using saved dietary preferences:', savedDietaryPreferences);
    const requestDietaryPreferences = savedDietaryPreferences;
    
    // First check the database schema to debug column names
    try {
      const { data: tableInfo, error: tableError } = await supabase
        .from('recipes')
        .select('*')
        .limit(1);
        
      if (tableError) {
        console.error('[API:generate-recipes] Error checking table schema:', tableError);
      } else {
        // If we got some data, log the column names
        if (tableInfo && tableInfo.length > 0) {
          console.log('[API:generate-recipes] Database columns:', Object.keys(tableInfo[0]));
        }
      }
    } catch (e) {
      console.error('[API:generate-recipes] Error checking database schema:', e);
    }
    
    // Even for sample recipes, save them to Supabase
    try {
      for (const recipe of sampleRecipes) {
        // Create the data object - USING EXACT DATABASE COLUMN NAMES
        const recipeData = {
          id: recipe.id,
          user_id: userId, 
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          // Use 'instructions' instead of 'steps' based on the error message
          instructions: recipe.instructions,
          cooking_time: recipe.cookingTime,
          image: recipe.image || '',
          dietary_preferences: requestDietaryPreferences,
          created_at: new Date().toISOString()
        };
        
        const { error: insertError } = await supabase.from('recipes').insert(recipeData);
        
        if (insertError) {
          console.error('[API:generate-recipes] Error inserting sample recipe:', insertError);
        }
      }
    } catch (dbError) {
      console.error('[API:generate-recipes] Error saving sample recipes to database:', dbError);
    }
    
    return NextResponse.json({ 
      recipes: sampleRecipes, 
      note: "Using sample recipes due to API error or during development" 
    });
  }
}
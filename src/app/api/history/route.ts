import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Get the authenticated user's session
    const cookieStore = cookies();
    const supabaseClient = supabase;
    
    // Get user session from cookie
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;

    // Fetch only recipes created by the current user
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', userId) // Filter by user_id
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    // Transform database column names to match frontend expectations
    const recipes = data.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.steps, // Use steps from DB and map to instructions for frontend
      cookingTime: recipe.cooking_time,
      image: recipe.image || '',
      dietary_preferences: recipe.dietary_preferences || [],
      created_at: recipe.created_at
    }));

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Error fetching recipe history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipe history' },
      { status: 500 }
    );
  }
}
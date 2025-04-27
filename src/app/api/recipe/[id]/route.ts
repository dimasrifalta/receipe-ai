import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const id = params.id;

    // Fetch the specific recipe by ID, but only if it belongs to the current user
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId) // Ensure the recipe belongs to the current user
      .single();

    if (error) {
      // If the error is because no rows were returned (recipe not found)
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Recipe not found or you do not have permission to view it' },
          { status: 404 }
        );
      }
      console.error('Database error:', error);
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Recipe not found or you do not have permission to view it' },
        { status: 404 }
      );
    }

    // Transform database column names to match frontend expectations
    const recipe = {
      id: data.id,
      title: data.title,
      description: data.description,
      ingredients: data.ingredients,
      instructions: data.steps, // Use steps from DB and map to instructions for frontend
      cookingTime: data.cooking_time,
      image: data.image || '',
      dietary_preferences: data.dietary_preferences || [],
      created_at: data.created_at
    };

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipe details' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Fetch all recipes ordered by creation date (newest first)
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Transform database column names to match frontend expectations
    const recipes = data.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      cookingTime: recipe.cooking_time,
      image: recipe.image,
      dietary_preferences: recipe.dietary_preferences,
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
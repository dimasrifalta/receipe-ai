import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
     // Debug: Log the request headers to trace the auth token
        const headers = Object.fromEntries(request.headers);
        console.log('[API:generate-recipes] Request headers:', {
          authorization: headers.authorization ? 'Bearer token present' : 'No auth header',
          cookie: headers.cookie ? 'Cookies present' : 'No cookies'
        });
        
        // Get the authenticated user's session
        let userId = null;
        
        // Create a server-side Supabase client with cookies
        const cookieStore = cookies();
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
            cookies: {
              get(name: string) {
                return cookieStore.get(name)?.value;
              },
            },
          },
        });
        
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

    // Fetch the specific recipe by ID
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', userId) // Filter by user_id
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    } 

    if (!data) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Transform database column names to match frontend expectations
    const recipe = {
      id: data.id,
      title: data.title,
      description: data.description,
      ingredients: data.ingredients,
      instructions: data.instructions,
      cookingTime: data.cooking_time,
      image: data.image,
      dietary_preferences: data.dietary_preferences,
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
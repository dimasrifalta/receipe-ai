'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    async function getInitialSession() {
      setIsLoading(true);
      console.log('[AuthContext] Getting initial session...');

      try {
        const { data, error } = await supabase.auth.getSession();
        
        // Debug: Log session data and errors
        if (error) {
          console.error('[AuthContext] Error getting initial session:', error);
        }
        
        console.log('[AuthContext] Initial session data:', {
          hasSession: !!data.session,
          user: data.session?.user ? {
            id: data.session.user.id,
            email: data.session.user.email
          } : null
        });
        
        if (!error && data.session) {
          setSession(data.session);
          setUser(data.session.user);
        } else {
          // If no session, ensure user state is cleared
          setUser(null);
          setSession(null);
        }
      } catch (e) {
        console.error('[AuthContext] Error in auth initialization:', e);
        // Clear user and session state on error
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
        setAuthInitialized(true);
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        // Debug: Log auth state changes
        console.log('[AuthContext] Auth state changed:', { 
          event, 
          hasSession: !!currentSession,
          userId: currentSession?.user?.id
        });
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Store user in localStorage when auth state changes
          localStorage.setItem('auth-user', JSON.stringify(currentSession.user));
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          localStorage.removeItem('auth-user');
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      console.log('[AuthContext] Unsubscribing from auth changes');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    console.log('[AuthContext] Signing up with email:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    // Debug: Log signup result
    if (error) {
      console.error('[AuthContext] Signup error:', error);
    } else {
      console.log('[AuthContext] Signup successful:', {
        user: data.user ? { id: data.user.id, email: data.user.email } : null,
        session: !!data.session
      });
      
      // Set user immediately after successful signup
      if (data.user) {
        setUser(data.user);
        if (data.session) {
          setSession(data.session);
        }
      }
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    console.log('[AuthContext] Signing in with email:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Debug: Log signin result
    if (error) {
      console.error('[AuthContext] Signin error:', error);
    } else {
      console.log('[AuthContext] Signin successful:', {
        user: data.user ? { id: data.user.id, email: data.user.email } : null,
        session: !!data.session
      });
      
      // Set user immediately after successful signin
      if (data.user) {
        setUser(data.user);
        if (data.session) {
          setSession(data.session);
        }
      }
    }
    
    return { error };
  };

  const signOut = async () => {
    console.log('[AuthContext] Signing out...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[AuthContext] Signout error:', error);
    } else {
      console.log('[AuthContext] Signout successful');
      // Clear user and session immediately
      setUser(null);
      setSession(null);
      localStorage.removeItem('auth-user');
    }
  };

  // Debug: Log the current auth state on every render
  console.log('[AuthContext] Current state:', {
    isLoggedIn: !!user,
    userId: user?.id,
    hasSession: !!session,
    isLoading,
    authInitialized
  });

  const value = {
    session,
    user,
    isLoading,
    signUp,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
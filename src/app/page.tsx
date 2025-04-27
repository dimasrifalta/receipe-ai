'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      // User will be redirected or UI will update because of auth state change
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      router.push('/home');
    } else {
      router.push('/login');
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="backdrop-blur-sm bg-white/30 dark:bg-black/20 border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm fixed w-full top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-blue-500 text-xl font-medium">Recipe AI</span>
          </div>
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"></div>
            ) : user ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Hello, {user.email?.split('@')[0]}
                </span>
                <Link
                  href="/history"
                  className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
                >
                  My Recipes
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm px-3 py-1.5 bg-blue-500/85 hover:bg-blue-600/90 text-white rounded-md transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 pt-16">
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-5xl font-light mb-4 text-gray-800 dark:text-gray-100">
              AI-Powered Recipe Generator
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Transform your available ingredients into delicious meals with the help of AI. 
              No more wondering what to cook - get personalized recipes in seconds.
            </p>
            <button
              onClick={handleGetStarted}
              className="px-8 py-3 bg-blue-500/85 hover:bg-blue-600/90 text-white rounded-md font-medium transition-colors"
            >
              {user ? 'Generate Recipes' : 'Get Started'}
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12 px-4">
            <div className="backdrop-blur-sm bg-white/50 dark:bg-black/20 rounded-lg p-6 border border-gray-100/60 dark:border-gray-800/50 text-center">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500/70" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 3a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 3a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 3a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-medium mb-2">Use Your Ingredients</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Enter the ingredients you have on hand and let AI suggest recipes you can make right now.
              </p>
            </div>

            <div className="backdrop-blur-sm bg-white/50 dark:bg-black/20 rounded-lg p-6 border border-gray-100/60 dark:border-gray-800/50 text-center">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500/70" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-medium mb-2">Save Time Planning</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Get instant recipe ideas without spending hours searching cookbooks or websites.
              </p>
            </div>

            <div className="backdrop-blur-sm bg-white/50 dark:bg-black/20 rounded-lg p-6 border border-gray-100/60 dark:border-gray-800/50 text-center">
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500/70" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2v5a1 1 0 001 1h.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
                </svg>
              </div>
              <h2 className="text-xl font-medium mb-2">Custom Dietary Needs</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Specify dietary preferences like vegetarian, gluten-free, or keto to get tailored recipes.
              </p>
            </div>
          </div>

          {/* Simple CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Join thousands of home cooks who use Recipe AI daily to simplify meal planning.
            </p>
            <Link
              href={user ? '/home' : '/signup'}
              className="text-blue-500/90 hover:text-blue-600 underline transition-colors"
            >
              {user ? 'Go to Recipe Generator' : 'Create a free account →'}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="backdrop-blur-sm bg-white/30 dark:bg-black/20 border-t border-gray-200/50 dark:border-gray-800/50 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© 2025 Recipe AI. All recipes are generated by AI and should be reviewed before use.</p>
        </div>
      </footer>
    </main>
  );
}

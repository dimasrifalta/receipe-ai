'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.asPath]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className='backdrop-blur-sm bg-white/70 dark:bg-black/40 border-b border-gray-200/70 dark:border-gray-800/50 fixed w-full top-0 z-10'>
      <div className='container mx-auto px-4 py-3'>
        <div className='flex justify-between items-center'>
          {/* Logo and brand */}
          <div className='flex items-center space-x-2'>
            <div className='flex items-center'>
              <div className='w-8 h-8 bg-green-600 dark:bg-green-500 rounded-md flex items-center justify-center mr-2'>
                <span className='text-white font-medium'>R</span>
              </div>
              <span className='text-green-800 dark:text-green-400 text-xl font-medium'>
                <Link href='/'>Recipe AI</Link>
              </span>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className='hidden md:flex items-center space-x-6'>
            <Link
              href='/home'
              className='text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors'>
              Generate Recipes
            </Link>
            <Link
              href='/history'
              className='text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors'>
              My Recipes
            </Link>
            {authLoading ? (
              <div className='h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700'></div>
            ) : user ? (
              <>
                <span className='text-sm text-gray-600 dark:text-gray-300'>
                  Hello, {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleSignOut}
                  className='text-sm px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
                  Sign out
                </button>
              </>
            ) : null}
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-md p-1'
              aria-label='Toggle menu'>
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className='mt-3 pb-2 md:hidden'>
            <div className='flex flex-col space-y-3 pt-2 border-t border-gray-200 dark:border-gray-700'>
              <Link
                href='/home'
                className='text-sm py-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors'
                onClick={() => setIsMenuOpen(false)}>
                Generate Recipes
              </Link>
              <Link
                href='/history'
                className='text-sm py-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors'
                onClick={() => setIsMenuOpen(false)}>
                My Recipes
              </Link>
              {user && (
                <div className='pt-2 border-t border-gray-200 dark:border-gray-700'>
                  <p className='text-sm text-gray-600 dark:text-gray-300 py-2'>
                    Hello, {user.email?.split('@')[0]}
                  </p>
                  <button
                    onClick={handleSignOut}
                    className='text-sm w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors'>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

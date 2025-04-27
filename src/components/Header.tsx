'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className='backdrop-blur-sm bg-white/70 dark:bg-black/40 border-b border-gray-200/70 dark:border-gray-800/50 fixed w-full top-0 z-10'>
      <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
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
        <div className='flex items-center space-x-6'>
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
      </div>
    </nav>
  );
}

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setError(null);
      setIsLoading(true);
      
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        throw new Error(signInError.message || 'Failed to sign in');
      }
      
      // Redirect to home page after successful login
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="backdrop-blur-sm bg-white/70 dark:bg-black/40 rounded-xl shadow-sm border border-gray-200/70 dark:border-gray-800/50 p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-light mb-6 text-center text-gray-800 dark:text-gray-100">Log In</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50/70 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 dark:focus:ring-green-500"
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-green-400 dark:focus:ring-green-500"
            disabled={isLoading}
            required
          />
        </div>
        
        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-full ${
            isLoading
              ? 'bg-green-500/60 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 transition-colors'
          } text-white font-medium`}
          disabled={isLoading}
        >
          {isLoading ? 'Logging In...' : 'Log In'}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
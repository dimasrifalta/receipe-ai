'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setError(null);
      setIsLoading(true);
      
      const { error: signUpError } = await signUp(email, password);
      
      if (signUpError) {
        throw new Error(signUpError.message || 'Failed to sign up');
      }
      
      // Show success message and redirect to login
      alert('Registration successful! Please check your email to confirm your account.');
      router.push('/login');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="backdrop-blur-sm bg-white/60 dark:bg-black/30 rounded-lg shadow-sm border border-gray-100/60 dark:border-gray-800/60 p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-light mb-6 text-center">Sign Up</h2>
      
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
            className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
            disabled={isLoading}
            required
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Must be at least 6 characters long</p>
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
            disabled={isLoading}
            required
          />
        </div>
        
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md ${
            isLoading
              ? 'bg-blue-400/60 cursor-not-allowed'
              : 'bg-blue-500/85 hover:bg-blue-600/90 transition-colors'
          } text-white font-medium`}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500/90 hover:text-blue-600 transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
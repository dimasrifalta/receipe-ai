'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

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

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // FAQ data
  const faqs = [
    {
      question: 'How does the AI create personalized meal plans?',
      answer:
        'Our AI system analyzes your dietary preferences, health goals, and cooking style to create recipes that are unique to you. It continuously learns from your feedback and choices to improve its suggestions over time.',
    },
    {
      question:
        'Can I integrate special dietary requirements into my meal plan?',
      answer:
        'Absolutely! Our platform is designed to accommodate a range of dietary needs, including vegetarian, vegan, gluten-free, and keto options. Just specify your requirements in your profile, and your meal plans will be adjusted accordingly.',
    },
    {
      question:
        'How does the platform accommodate allergies and food sensitivities?',
      answer:
        'You can specify allergies and sensitivities in your profile. Our system will ensure these ingredients are excluded from all your recipe recommendations.',
    },
    {
      question: "Can I adjust my meal plans after they've been created?",
      answer:
        'Yes, you can easily modify any recipe or swap out ingredients to suit your preferences or what you have on hand.',
    },
    {
      question:
        'What makes your AI-driven meal planning different from other meal planning services?',
      answer:
        'Our AI learns from your interactions and continuously improves its recommendations, creating a truly personalized experience that adapts to your changing preferences and needs.',
    },
  ];

  return (
    <div className='min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900'>
      {/* Navigation */}
      <nav className='backdrop-blur-sm bg-white/70 dark:bg-black/40 border-b border-gray-200/70 dark:border-gray-800/50 fixed w-full top-0 z-10'>
        <div className='container mx-auto px-4 py-3 flex justify-between items-center'>
          <div className='flex items-center space-x-2'>
            <div className='flex items-center'>
              <div className='w-8 h-8 bg-green-600 dark:bg-green-500 rounded-md flex items-center justify-center mr-2'>
                <span className='text-white font-medium'>R</span>
              </div>
              <span className='text-green-800 dark:text-green-400 text-xl font-medium'>
                Recipe AI
              </span>
            </div>
          </div>
          <div className='flex items-center space-x-6'>
            <button
              onClick={() => scrollToSection('benefits-section')}
              className='text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors'>
              Benefit
            </button>
            <button
              onClick={() => scrollToSection('support-section')}
              className='text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors'>
              Support
            </button>
            {isLoading ? (
              <div className='h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700'></div>
            ) : user ? (
              <>
                <Link
                  href='/history'
                  className='text-sm text-green-600 dark:text-green-400 hover:underline'>
                  My Recipes
                </Link>
                <span className='text-sm text-gray-600 dark:text-gray-300'>
                  Hello, {user.email?.split('@')[0]}
                </span>

                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className='text-sm px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
                  {isSigningOut ? 'Signing out...' : 'Sign out'}
                </button>
              </>
            ) : (
              <>
                <Link
                  href='/login'
                  className='text-sm px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors'>
                  Log in
                </Link>
                <Link
                  href='/signup'
                  className='text-sm px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors'>
                  Start For Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='pt-24 pb-16 px-4 md:px-0 flex flex-col items-center'>
        <div className='container mx-auto max-w-6xl'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-center'>
            <div className='lg:col-span-7'>
              <h1 className='text-4xl md:text-5xl font-light mb-6 text-gray-800 dark:text-gray-100 leading-tight'>
                Elevate Your Mealtime with <br />
                <span className='font-medium text-green-600 dark:text-green-400'>
                  AI-Powered Personalization
                </span>
              </h1>
              <p className='text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed'>
                Effortless Planning, Healthier Eating
              </p>

              <div className='flex flex-wrap gap-4 mb-10'>
                <button
                  onClick={handleGetStarted}
                  className='px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors'>
                  {user ? 'Generate Recipes' : 'Start For Free'}
                </button>
                <button
                  className='px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors'
                  onClick={handleGetStarted}>
                  Try Our Demo
                </button>
              </div>

              <div className='flex items-center gap-6 flex-wrap'>
                <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm'>
                  <div className='text-4xl font-bold mb-1 text-green-600'>
                    95%
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    Improved Eating Habits
                  </div>
                </div>

                <div className='bg-green-800 text-white p-4 rounded-xl shadow-sm'>
                  <div className='text-4xl font-bold mb-1'>30,000+</div>
                  <div className='text-sm opacity-80'>Happy Users</div>
                </div>

                <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm'>
                  <div className='text-4xl font-bold mb-1 text-green-600'>
                    25%
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    Saved on Groceries
                  </div>
                </div>
              </div>
            </div>

            <div className='lg:col-span-5 grid grid-cols-2 gap-3'>
              <div className='rounded-xl overflow-hidden h-40'>
                <div className='w-full h-full bg-green-200 flex items-center justify-center'>
                  <div className='w-10 h-10 bg-green-600 rounded-full flex items-center justify-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className='rounded-xl overflow-hidden row-span-2 h-full'>
                <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                  <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-8 w-8 text-green-600'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className='rounded-xl overflow-hidden h-40'>
                <div className='w-full h-full bg-green-100 flex items-center justify-center'>
                  <div className='w-10 h-10 bg-green-600 rounded-full flex items-center justify-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 text-white'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z'
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Section */}
      <section className='py-16 px-4 md:px-0'>
        <div className='container mx-auto max-w-6xl'>
          <div className='flex justify-between items-center mb-10'>
            <div>
              <h2 className='text-3xl font-light text-gray-800 dark:text-gray-100'>
                Recipes
              </h2>
              <p className='text-gray-600 dark:text-gray-300'>
                Recipes crafted by AI, personalized to perfectly align with your
                unique dietary needs and flavor preferences
              </p>
            </div>
            <Link
              href='/recipes'
              className='hidden md:flex items-center text-green-600 hover:text-green-700'>
              Explore more recipes
              <svg
                className='w-5 h-5 ml-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 5l7 7-7 7'></path>
              </svg>
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Recipe Card 1 */}
            <div className='bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700'>
              <div className='p-6 flex flex-col justify-between h-full'>
                <div>
                  <h3 className='text-xl font-medium mb-2'>
                    Savory Quinoa and Roasted Vegetable Bowl
                  </h3>
                  <p className='text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2'>
                    A nutritious and filling bowl featuring fluffy quinoa,
                    perfectly roasted seasonal vegetables, and a zesty herb
                    dressing.
                  </p>
                </div>
                <Link
                  href='/recipe/1'
                  className='inline-flex items-center px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-full text-sm w-fit'>
                  Learn More
                  <svg
                    className='w-4 h-4 ml-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 5l7 7-7 7'></path>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Recipe Card 2 */}
            <div className='bg-green-100 dark:bg-green-900/30 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-green-200 dark:border-green-800/50'>
              <div className='p-6 flex flex-col justify-between h-full'>
                <div>
                  <h3 className='text-xl font-medium mb-2'>
                    Herb-Infused Grilled Chicken with Seasonal Greens
                  </h3>
                  <p className='text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2'>
                    Tender chicken marinated with fresh herbs, grilled to
                    perfection and served with a vibrant seasonal greens salad.
                  </p>
                </div>
                <Link
                  href='/recipe/2'
                  className='inline-flex items-center px-4 py-2 bg-white/70 text-green-700 hover:bg-white rounded-full text-sm w-fit'>
                  Learn More
                  <svg
                    className='w-4 h-4 ml-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 5l7 7-7 7'></path>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Recipe Card 3 */}
            <div className='bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700'>
              <div className='p-6 flex flex-col justify-between h-full'>
                <div>
                  <h3 className='text-xl font-medium mb-2'>
                    Mediterranean Lentil and Kale Salad
                  </h3>
                  <p className='text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2'>
                    A protein-rich salad with hearty lentils, fresh kale,
                    Mediterranean herbs, and a tangy lemon dressing.
                  </p>
                </div>
                <Link
                  href='/recipe/3'
                  className='inline-flex items-center px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-full text-sm w-fit'>
                  Learn More
                  <svg
                    className='w-4 h-4 ml-1'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 5l7 7-7 7'></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className='mt-8 text-center md:hidden'>
            <Link
              href='/recipes'
              className='inline-flex items-center text-green-600 hover:text-green-700'>
              Explore more recipes
              <svg
                className='w-5 h-5 ml-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 5l7 7-7 7'></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id='benefits-section'
        className='py-16 px-4 md:px-0 bg-white dark:bg-gray-900'>
        <div className='container mx-auto max-w-6xl'>
          <div className='mb-10'>
            <h2 className='text-3xl font-light text-gray-800 dark:text-gray-100'>
              Benefits
            </h2>
            <p className='text-gray-600 dark:text-gray-300'>
              Get meal plans tailored to your unique dietary needs, preferences,
              and goals, ensuring a balanced and enjoyable diet.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* Benefit 1 */}
            <div className='bg-green-100 dark:bg-green-900/30 rounded-3xl p-8 h-80 flex flex-col justify-center items-center text-center'>
              <h3 className='text-xl font-medium mb-4 text-green-800 dark:text-green-300'>
                Personalized Nutrition
              </h3>
              <p className='text-gray-700 dark:text-gray-300'>
                Get meal plans tailored to your unique dietary needs,
                preferences, and goals, ensuring a balanced and enjoyable diet.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className='bg-white dark:bg-gray-800 rounded-3xl p-8 h-80 flex flex-col justify-center'>
              <h3 className='text-xl font-medium mb-4 text-gray-800 dark:text-gray-200'>
                Time-Saving Convenience
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Say goodbye to meal planning stress. Our AI-driven platform
                simplifies your weekly meal preparation, saving you valuable
                time.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className='bg-white dark:bg-gray-800 rounded-3xl p-8 h-80 flex flex-col justify-center'>
              <h3 className='text-xl font-medium mb-4 text-gray-800 dark:text-gray-200'>
                Healthier Eating Habits
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Easily adopt a healthier lifestyle with nutrient-rich meal plans
                and educational content on nutrition and wellness.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className='bg-white dark:bg-gray-800 rounded-3xl p-8 h-80 flex flex-col justify-center'>
              <h3 className='text-xl font-medium mb-4 text-gray-800 dark:text-gray-200'>
                Cost-Effective Shopping
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Reduce food waste and save money with efficient grocery shopping
                lists that align perfectly with your meal plans.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className='bg-white dark:bg-gray-800 rounded-3xl p-8 h-80 flex flex-col justify-center'>
              <h3 className='text-xl font-medium mb-4 text-gray-800 dark:text-gray-200'>
                Seamless Grocery Delivery
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Enjoy the convenience of having all your meal ingredients
                delivered right to your doorstep through our local grocery store
                partnerships.
              </p>
            </div>

            {/* Benefit 6 */}
            <div className='bg-green-800 text-white rounded-3xl p-8 h-80 flex flex-col justify-center items-center text-center'>
              <h3 className='text-xl font-medium mb-4'>Community Support</h3>
              <p className='text-white/80'>
                Join a community of like-minded individuals, share experiences,
                recipes, and tips, and get motivated on your journey to
                healthier eating.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className='py-16 px-4 md:px-0'>
        <div className='container mx-auto max-w-6xl'>
          <div className='mb-10'>
            <h2 className='text-3xl font-light text-gray-800 dark:text-gray-100'>
              How it works
            </h2>
            <p className='text-gray-600 dark:text-gray-300'>
              Step into the world of hassle-free meal planning with our easy
              3-step process
            </p>
          </div>

          <div className='bg-gray-100 dark:bg-gray-800 rounded-3xl p-8 md:p-12'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div>
                <div className='text-green-600 dark:text-green-400 font-medium mb-2'>
                  01
                </div>
                <h3 className='text-2xl font-medium mb-4'>
                  Personalize Your Profile
                </h3>
                <p className='text-gray-600 dark:text-gray-300 mb-6'>
                  Begin by creating your profile. Tell us about your dietary
                  preferences, nutritional goals, and budget. Our AI technology
                  tailors every meal plan to fit your unique needs.
                </p>
                <div className='flex items-center gap-4'>
                  <button className='w-10 h-10 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300'>
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M15 19l-7-7 7-7'></path>
                    </svg>
                  </button>
                  <button className='w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white'>
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M9 5l7 7-7 7'></path>
                    </svg>
                  </button>
                </div>
                <div className='mt-8 text-green-800 dark:text-green-400'>
                  01/03
                </div>
              </div>

              <div className='relative h-64 md:h-auto'>
                {/* This would be an image in a real application */}
                <div className='absolute inset-0 bg-green-200 dark:bg-green-900/30 rounded-xl transform rotate-3 z-0'></div>
                <div className='absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-xl transform -rotate-3 z-10'></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='py-16 px-4 md:px-0 bg-white dark:bg-gray-900'>
        <div className='container mx-auto max-w-6xl'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10'>
            <div>
              <h2 className='text-3xl font-light text-gray-800 dark:text-gray-100'>
                Frequently Asked Questions
              </h2>
              <p className='text-gray-600 dark:text-gray-300'>
                Meal planning made easy: your questions, answered
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6'>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border-t border-gray-200 dark:border-gray-700 pt-4 ${
                  activeAccordion === index ? 'pb-4' : 'pb-2'
                }`}>
                <button
                  className='flex justify-between items-center w-full text-left'
                  onClick={() => toggleAccordion(index)}>
                  <h3 className='text-lg font-medium text-gray-800 dark:text-gray-200'>
                    {faq.question}
                  </h3>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      activeAccordion === index
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                    {activeAccordion === index ? (
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M5 15l7-7 7 7'></path>
                      </svg>
                    ) : (
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M19 9l-7 7-7-7'></path>
                      </svg>
                    )}
                  </div>
                </button>
                {activeAccordion === index && (
                  <div className='mt-3 text-gray-600 dark:text-gray-300 text-sm'>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Need Assistance Section */}
      <section id='support-section' className='py-16 px-4 md:px-0'>
        <div className='container mx-auto max-w-6xl'>
          <div className='flex flex-col md:flex-row gap-6 justify-between items-center mb-10'>
            <h2 className='text-3xl font-light text-gray-800 dark:text-gray-100'>
              Need Assistance?
            </h2>
            <p className='text-gray-600 dark:text-gray-300'>
              We're here to help!
            </p>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-3xl shadow-sm overflow-hidden'>
            <div className='grid grid-cols-1 md:grid-cols-2'>
              <div className='p-8 md:p-12'>
                <div className='h-full flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-xl overflow-hidden'>
                  {/* This would be an image in a real application */}
                  <div className='w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white'>
                    <svg
                      className='w-8 h-8'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                      xmlns='http://www.w3.org/2000/svg'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className='p-8 md:p-12'>
                <h3 className='text-2xl font-medium mb-4'>
                  Have questions or need help with Recipe AI?
                </h3>
                <p className='text-gray-600 dark:text-gray-300 mb-6'>
                  Our dedicated support team is ready to assist you. Get the
                  answers and assistance you need to make the most of your meal
                  planning experience.
                </p>
                <button className='px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors'>
                  Get Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-green-900 text-white py-12 px-4 md:px-0'>
        <div className='container mx-auto max-w-6xl'>
          <div className='flex flex-col md:flex-row justify-between mb-8'>
            <div className='mb-6 md:mb-0'>
              <div className='flex items-center mb-4'>
                <div className='w-8 h-8 bg-green-600 rounded-md flex items-center justify-center mr-2'>
                  <span className='text-white font-medium'>R</span>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
              <div>
                <h4 className='font-medium mb-4'>Recipes</h4>
                <ul className='space-y-2 text-green-200'>
                  <li>
                    <Link
                      href='#'
                      className='hover:text-white transition-colors'>
                      Browse All
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='#'
                      className='hover:text-white transition-colors'>
                      Featured
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='#'
                      className='hover:text-white transition-colors'>
                      Seasonal
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='#'
                      className='hover:text-white transition-colors'>
                      Popular
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className='font-medium mb-4'>Blog</h4>
                <ul className='space-y-2 text-green-200'>
                  <li>
                    <Link
                      href='#'
                      className='hover:text-white transition-colors'>
                      Nutrition Tips
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='#'
                      className='hover:text-white transition-colors'>
                      Cooking Guides
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='#'
                      className='hover:text-white transition-colors'>
                      Healthy Living
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className='font-medium mb-4'>Customer Support</h4>
                <ul className='space-y-2 text-green-200'>
                  <li>
                    <Link
                      href='#'
                      className='hover:text-white transition-colors'>
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='#'
                      className='hover:text-white transition-colors'>
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='#'
                      className='hover:text-white transition-colors'>
                      FAQs
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className='font-medium mb-4'>Your Profile</h4>
                <ul className='space-y-2 text-green-200'>
                  <li>
                    <Link
                      href='#'
                      className='hover:text-white transition-colors'>
                      Account Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='#'
                      className='hover:text-white transition-colors'>
                      My Recipes
                    </Link>
                  </li>
                  <li>
                    <Link
                      href='#'
                      className='hover:text-white transition-colors'>
                      Favorites
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className='pt-8 border-t border-green-800 flex flex-col md:flex-row justify-between items-center'>
            <p className='text-sm text-green-200 mb-4 md:mb-0'>
              © 2025 Recipe AI. All rights reserved.
            </p>

            <div className='flex space-x-6'>
              <Link
                href='#'
                className='text-green-200 hover:text-white transition-colors'>
                <span className='sr-only'>Facebook</span>
                <svg
                  className='h-6 w-6'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
                    clipRule='evenodd'></path>
                </svg>
              </Link>
              <Link
                href='#'
                className='text-green-200 hover:text-white transition-colors'>
                <span className='sr-only'>Twitter</span>
                <svg
                  className='h-6 w-6'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84'></path>
                </svg>
              </Link>
              <Link
                href='#'
                className='text-green-200 hover:text-white transition-colors'>
                <span className='sr-only'>Instagram</span>
                <svg
                  className='h-6 w-6'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fillRule='evenodd'
                    d='M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z'
                    clipRule='evenodd'></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

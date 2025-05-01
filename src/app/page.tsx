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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      setIsMenuOpen(false);
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
        <div className='container mx-auto px-4 py-3'>
          <div className='flex justify-between items-center'>
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
            
            {/* Desktop navigation */}
            <div className='hidden md:flex items-center space-x-6'>
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
                <button
                  onClick={() => scrollToSection('benefits-section')}
                  className='text-sm py-2 text-left text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors'>
                  Benefit
                </button>
                <button
                  onClick={() => scrollToSection('support-section')}
                  className='text-sm py-2 text-left text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors'>
                  Support
                </button>
                
                {user ? (
                  <>
                    <Link
                      href='/history'
                      className='text-sm py-2 text-green-600 dark:text-green-400 hover:underline'
                      onClick={() => setIsMenuOpen(false)}>
                      My Recipes
                    </Link>
                    <div className='pt-2 border-t border-gray-200 dark:border-gray-700'>
                      <p className='text-sm text-gray-600 dark:text-gray-300 py-2'>
                        Hello, {user.email?.split('@')[0]}
                      </p>
                      <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className='text-sm w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors'>
                        {isSigningOut ? 'Signing out...' : 'Sign out'}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      href='/login'
                      className='text-sm py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors'
                      onClick={() => setIsMenuOpen(false)}>
                      Log in
                    </Link>
                    <Link
                      href='/signup'
                      className='text-sm py-2 text-green-600 dark:text-green-400 hover:underline'
                      onClick={() => setIsMenuOpen(false)}>
                      Start For Free
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className='pt-24 pb-16 px-4 md:px-0'>
        <div className='container mx-auto max-w-6xl'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 items-center'>
            <div className='lg:col-span-7 order-2 lg:order-1'>
              <h1 className='text-3xl md:text-5xl font-light mb-4 text-gray-800 dark:text-gray-100 leading-tight text-center lg:text-left'>
                Elevate Your Mealtime with <br className="hidden md:block" />
                <span className='font-medium text-green-600 dark:text-green-400'>
                  AI-Powered Personalization
                </span>
              </h1>
              <p className='text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed text-center lg:text-left'>
                Effortless Planning, Healthier Eating
              </p>

              <div className='flex flex-wrap justify-center lg:justify-start gap-4 mb-10'>
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

              <div className='flex flex-wrap justify-center lg:justify-start items-center gap-4 md:gap-6'>
                {/* Stat boxes */}
                <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm relative overflow-hidden'>
                  <div className='text-3xl md:text-4xl font-bold mb-1 text-green-600'>95%</div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>Improved Eating Habits</div>
                  
                  <div className='mt-3'>
                    <div className='w-full h-24 md:h-32 relative'>
                      <Image
                        src="/img/4.jpg"
                        alt="Person with reusable grocery bag"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className='bg-green-800 text-white p-4 rounded-xl shadow-sm'>
                  <div className='text-3xl md:text-4xl font-bold mb-1'>30,000+</div>
                  <div className='text-sm opacity-80'>Happy Users</div>
                </div>

                <div className='bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm'>
                  <div className='text-3xl md:text-4xl font-bold mb-1 text-green-600'>25%</div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>Saved on Groceries</div>
                  
                  <div className='mt-3'>
                    <div className='w-full h-24 md:h-32 relative'>
                      <Image
                        src="/img/5.jpg"
                        alt="Grocery bag with vegetables"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='lg:col-span-5 grid grid-cols-2 gap-4 order-1 lg:order-2 mb-6 lg:mb-0'>
              {/* Main food image */}
              <div className='col-span-2 rounded-xl overflow-hidden h-48 md:h-64 relative'>
                <Image
                  src="/img/1.jpg"
                  alt="Delicious healthy meal"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Secondary food images */}
              <div className='rounded-xl overflow-hidden h-32 md:h-48 relative'>
                <Image
                  src="/img/2.jpg"
                  alt="Fresh ingredients"
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className='rounded-xl overflow-hidden h-32 md:h-48 relative'>
                <Image
                  src="/img/7.jpg"
                  alt="Meal preparation"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Decorative elements */}
              <div className='absolute -z-10 top-20 right-10 hidden md:block'>
                <div className='w-12 h-12 rounded-full bg-yellow-100 opacity-70'></div>
              </div>
              
              <div className='absolute -z-10 bottom-40 left-1/4 hidden md:block'>
                <div className='w-10 h-10 rounded-full bg-green-50 border border-green-200'></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Section */}
      <section className='py-16 px-4 md:px-0 bg-white dark:bg-gray-900'>
        <div className='container mx-auto max-w-6xl'>
          <div className='flex flex-col md:flex-row items-start gap-3 mb-10'>
            <h2 className='text-4xl font-medium text-gray-800 dark:text-gray-100'>
              Recipes
            </h2>
            <div className='w-10 h-0.5 bg-gray-300 dark:bg-gray-700 hidden md:block md:translate-y-5'></div>
            <p className='text-gray-600 dark:text-gray-300 max-w-md'>
              Recipes crafted by AI, personalized to perfectly align with your
              unique dietary needs and flavor preferences
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Left Column - Recipe Cards */}
            <div className='space-y-6'>
              {/* Recipe Card 1 */}
              <div className='bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm p-8 flex flex-col md:flex-row items-center md:items-start gap-6'>
                <div className='flex-1'>
                  <h3 className='text-xl font-medium text-gray-800 dark:text-gray-200 mb-3'>
                    Savory Quinoa and Roasted Vegetable Bowl
                  </h3>
                  <Link
                    href='/recipe/1'
                    className='inline-flex items-center px-6 py-2 bg-lime-200 text-green-800 hover:bg-lime-300 rounded-full text-sm font-medium transition-colors'>
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
                <div className='w-28 h-28 relative rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-md flex-shrink-0'>
                  <Image
                    src="/img/receipe/victoria-shes-Qa29U4Crvn4-unsplash 1.jpg"
                    alt="Quinoa and vegetable bowl"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Recipe Card 2 */}
              <div className='bg-lime-200 dark:bg-lime-900/30 rounded-3xl overflow-hidden shadow-sm p-8 flex flex-col md:flex-row items-center md:items-start gap-6'>
                <div className='flex-1'>
                  <h3 className='text-xl font-medium text-gray-800 dark:text-gray-200 mb-3'>
                    Herb-Infused Grilled Chicken with Seasonal Greens
                  </h3>
                  <Link
                    href='/recipe/2'
                    className='inline-flex items-center px-6 py-2 bg-white text-green-800 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors'>
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
                <div className='w-28 h-28 relative rounded-full overflow-hidden border-4 border-lime-100 shadow-md flex-shrink-0'>
                  <Image
                    src="/img/receipe/2.png"
                    alt="Grilled chicken with greens"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Recipe Card 3 */}
              <div className='bg-gray-100 dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm p-8 flex flex-col md:flex-row items-center md:items-start gap-6'>
                <div className='flex-1'>
                  <h3 className='text-xl font-medium text-gray-800 dark:text-gray-200 mb-3'>
                    Mediterranean Lentil and Kale Salad
                  </h3>
                  <Link
                    href='/recipe/3'
                    className='inline-flex items-center px-6 py-2 bg-lime-200 text-green-800 hover:bg-lime-300 rounded-full text-sm font-medium transition-colors'>
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
                <div className='w-28 h-28 relative rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-md flex-shrink-0'>
                  <Image
                    src="/img/receipe/3.png"
                    alt="Mediterranean salad"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Large Image */}
            <div className='relative h-[36rem] md:h-auto rounded-3xl overflow-hidden'>
              <div className='absolute top-6 right-6 z-10'>
                <Link
                  href='/recipes'
                  className='inline-flex items-center bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md text-gray-800 dark:text-gray-200 font-medium'>
                  Explore more recipes
                  <div className='w-8 h-8 bg-lime-200 rounded-full ml-3 flex items-center justify-center'>
                    <svg
                      className='w-4 h-4 text-gray-800'
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
                  </div>
                </Link>
              </div>
              <Image
                src="/img/receipe/Picture.png"
                alt="Various dishes showcase"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        id='benefits-section'
        className='py-16 px-4 md:px-0 bg-white dark:bg-gray-900'>
        <div className='container mx-auto max-w-6xl'>
          <div className='flex flex-col md:flex-row items-start gap-3 mb-10'>
            <h2 className='text-4xl font-medium text-gray-800 dark:text-gray-100'>
              Benefits
            </h2>
            <div className='hidden md:flex items-center'>
              <div className='w-10 h-0.5 bg-gray-300 dark:bg-gray-700 mx-4'></div>
              <p className='text-gray-600 dark:text-gray-300 max-w-md'>
                Get meal plans tailored to your unique dietary needs, preferences,
                and goals, ensuring a balanced and enjoyable diet.
              </p>
            </div>
            <p className='md:hidden text-gray-600 dark:text-gray-300'>
              Get meal plans tailored to your unique dietary needs, preferences,
              and goals, ensuring a balanced and enjoyable diet.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12'>
            {/* Personalized Nutrition */}
            <div className='group relative flex flex-col overflow-hidden'>
              <div className='rounded-full bg-lime-200 dark:bg-lime-900/30 aspect-square flex flex-col justify-center items-center text-center p-8'>
                <h3 className='text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200'>
                  Personalized Nutrition
                </h3>
                <p className='text-gray-700 dark:text-gray-300 max-w-xs'>
                  Get meal plans tailored to your unique dietary needs,
                  preferences, and goals, ensuring a balanced and
                  enjoyable diet.
                </p>
              </div>
            </div>

            {/* Time-Saving Convenience */}
            <div className='group relative flex flex-col overflow-hidden'>
              <div className='rounded-full bg-gray-200 dark:bg-gray-800 aspect-square flex flex-col justify-center items-center p-0'>
                <div className='relative w-full h-full overflow-hidden rounded-full'>
                  <Image
                    src="/img/benefit/1.jpg"
                    alt="Grocery bag with vegetables"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className='mt-6 text-left px-4'>
                <h3 className='text-2xl font-medium mb-3 text-gray-800 dark:text-gray-200'>
                  Time-Saving Convenience
                </h3>
                <p className='text-gray-600 dark:text-gray-300'>
                  Say goodbye to meal planning stress. Our AI-driven platform
                  simplifies your weekly meal preparation, saving you 
                  valuable time.
                </p>
              </div>
            </div>

            {/* Healthier Eating Habits */}
            <div className='group relative flex flex-col overflow-hidden'>
              <div className='rounded-full bg-gray-100 dark:bg-gray-800 aspect-square flex flex-col justify-center items-center text-center p-8'>
                <h3 className='text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200'>
                  Healthier Eating Habits
                </h3>
                <p className='text-gray-700 dark:text-gray-300 max-w-xs'>
                  Easily adopt a healthier lifestyle with nutrient-rich meal plans and
                  educational content on nutrition and wellness.
                </p>
              </div>
            </div>

            {/* Cost-Effective Shopping */}
            <div className='group relative flex flex-col overflow-hidden'>
              <div className='rounded-full bg-gray-100 dark:bg-gray-800 aspect-square flex flex-col justify-center items-center text-center p-8'>
                <h3 className='text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200'>
                  Cost-Effective Shopping
                </h3>
                <p className='text-gray-700 dark:text-gray-300 max-w-xs'>
                  Reduce food waste and save money with efficient
                  grocery shopping lists that align perfectly with your
                  meal plans.
                </p>
              </div>
            </div>

            {/* Seamless Grocery Delivery */}
            <div className='group relative flex flex-col overflow-hidden'>
              <div className='rounded-full bg-gray-100 dark:bg-gray-800 aspect-square flex flex-col justify-center items-center text-center p-8'>
                <h3 className='text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200'>
                  Seamless Grocery Delivery
                </h3>
                <p className='text-gray-700 dark:text-gray-300 max-w-xs'>
                  Enjoy the convenience of having all your meal
                  ingredients delivered right to your doorstep through
                  our local grocery store partnerships.
                </p>
              </div>
            </div>

            {/* Community Support */}
            <div className='group relative flex flex-col overflow-hidden'>
              <div className='rounded-full bg-green-800 text-white aspect-square flex flex-col justify-center items-center text-center p-8'>
                <h3 className='text-2xl font-medium mb-4'>
                  Community Support
                </h3>
                <p className='text-white/80 max-w-xs'>
                  Join a community of like-minded individuals, share
                  experiences, recipes, and tips, and get motivated on
                  your journey to healthier eating.
                </p>
              </div>
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
          <div className='flex flex-col md:flex-row items-center gap-3 mb-8'>
            <h2 className='text-4xl font-medium text-gray-800 dark:text-gray-100'>
              Need Assistance?
            </h2>
            <div className='hidden md:flex'>
              <div className='w-8 h-0.5 bg-gray-300 dark:bg-gray-700 mx-4 translate-y-3'></div>
              <p className='text-gray-600 dark:text-gray-300'>
                We're here to help!
              </p>
            </div>
            <p className='md:hidden text-gray-600 dark:text-gray-300'>
              We're here to help!
            </p>
          </div>

          <div className='mt-10 border-t border-b border-gray-100 dark:border-gray-800 py-12'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-center'>
              {/* Left side - Image with curved container */}
              <div className='relative'>
                <div className='rounded-[40px] overflow-hidden w-full h-64 md:h-96 relative'>
                  <Image
                    src="/img/assistance/Picture.png"
                    alt="Delivery person handing over groceries"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Right side - Content */}
              <div className='flex flex-col justify-center'>
                <h3 className='text-2xl font-medium mb-4 text-gray-800 dark:text-gray-200'>
                  Have questions or need help with Recipe AI?
                </h3>
                <p className='text-gray-600 dark:text-gray-300 mb-8 max-w-md'>
                  Our dedicated support team is ready to assist you. Get the
                  answers and assistance you need to make the most of your meal
                  planning experience.
                </p>
                <div>
                  <Link 
                    href="/support"
                    className='inline-flex items-center px-8 py-3 bg-lime-200 text-green-800 hover:bg-lime-300 rounded-full text-sm font-medium transition-colors'>
                    Get Support
                  </Link>
                </div>
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

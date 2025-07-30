"use client"

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Users, Sparkles, School, Landmark, Wheat, ArrowRight } from 'lucide-react';

// HELPER: Custom hook for scroll animations
const useOnScreen = (options) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return [ref, isVisible];
};

// COMPONENT: Animated Section Wrapper
const AnimatedSection = ({ children, className = '' }) => {
  const [ref, isVisible] = useOnScreen({ threshold: 0.15 });
  return (
    <section
      ref={ref}
      className={`transition-all duration-1000 ease-in-out ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {children}
    </section>
  );
};

// COMPONENT: Hero Section
const HeroSection = () => (
  <header className="min-h-screen bg-gradient-to-b from-gray-900 via-red-900/80 to-gray-900 text-white flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
    <div className="absolute inset-0 bg-grid-white/5"></div>
    <div className="relative z-10">
      <ShoppingCart size={48} className="mx-auto text-red-300 mb-4" />
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-300 to-orange-400">
        The Grocery Store Bridge
      </h1>
      <p className="mt-4 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
        The Chinese-American Experience in the 1932 Mississippi Delta
      </p>
      <div className="mt-8 flex items-center justify-center gap-4 text-lg text-red-200">
        <span>Navigating the Color Line as the Delta's Merchants</span>
      </div>
    </div>
  </header>
);

// COMPONENT: Journey Section
const JourneySection = () => (
    <AnimatedSection className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">From Field to Counter</h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                    Recruited for farm labor, the Chinese community quickly pivoted, creating a vital economic niche that would define their role in the Delta for generations.
                </p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center">
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-2 border-red-500/50 mb-4">
                        <Wheat size={40} className="text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold">Plantation Labor</h3>
                    <p className="text-gray-400 mt-1">1870s</p>
                </div>
                <div className="hidden md:block text-red-500">
                    <ArrowRight size={48} />
                </div>
                 <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-2 border-red-500/50 mb-4">
                        <ShoppingCart size={40} className="text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold">The Grocery Niche</h3>
                    <p className="text-gray-400 mt-1">By the 1930s</p>
                </div>
            </div>
             <p className="text-center text-gray-400 max-w-2xl mx-auto mt-8">
                Rejecting the exploitative conditions of sharecropping, Chinese families pooled resources to open small grocery stores, filling a critical gap in the segregated economy by serving the Black community.
            </p>
        </div>
    </AnimatedSection>
);

// COMPONENT: Institution Card
const InstitutionCard = ({ icon, title, description }) => (
    <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg border border-red-500/30 hover:border-red-400 transition-all duration-300 shadow-lg flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-red-900/50 border border-red-500/30">
            {icon}
        </div>
        <div>
            <h3 className="text-xl font-bold text-red-300">{title}</h3>
            <p className="text-gray-300 mt-2">{description}</p>
        </div>
    </div>
);

// COMPONENT: Community Institutions Section
const CommunityInstitutionsSection = () => {
    const institutions = [
        {
            icon: <Users size={24} className="text-red-300"/>,
            title: 'Merchants\' Associations',
            description: 'Organizations like the United Chinese Merchants Association provided mutual support, pooled resources, and funded legal challenges against discriminatory laws.'
        },
        {
            icon: <School size={24} className="text-red-300"/>,
            title: 'Community Schools',
            description: 'When excluded from white schools, the community established its own, like the one in Cleveland, to ensure their children received an education and preserved their heritage.'
        },
        {
            icon: <Landmark size={24} className="text-red-300"/>,
            title: 'Separate Cemeteries',
            description: 'Faced with segregation even in death, the Chinese community created their own cemeteries, allowing them to honor their dead according to their own cultural traditions.'
        },
    ];

    return (
        <AnimatedSection className="py-20 px-4 bg-gray-800 text-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">A World of Their Own</h2>
                    <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                        To navigate their precarious "in-between" status, the Chinese community built a robust network of institutions to preserve their culture and advocate for their rights.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {institutions.map(i => <InstitutionCard key={i.title} {...i} />)}
                </div>
            </div>
        </AnimatedSection>
    );
};

// COMPONENT: Gemini API Powered AI Storyteller
const AIStorytellerSection = () => {
    const [story, setStory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const getStory = async (prompt) => {
        setIsLoading(true);
        setError('');
        setStory('');

        try {
            let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            const apiKey = GEMINI_API_KEY; // API key will be injected by the environment
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json();
            
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setStory(text);
            } else {
                throw new Error("Unexpected response format from API.");
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "An error occurred while fetching the story.");
        } finally {
            setIsLoading(false);
        }
    };

    const prompts = [
        { title: "The Grocer's Ledger", prompt: "Tell a short, first-person story from the perspective of a Chinese grocer in 1932, reflecting on the trust and difficulty of extending credit to sharecropper families during the Depression." },
        { title: "A Meeting of Merchants", prompt: "Describe a scene at a Chinese Merchants' Association meeting where members discuss pooling funds to help a family or challenge a discriminatory local ordinance." },
        { title: "Behind the Counter", prompt: "Write a vivid description of an afternoon in a Delta Chinese grocery store, focusing on the interactions between the family members and their African-American customers." },
        { title: "The School Decision", prompt: "Imagine a conversation between a Chinese father and mother about the sacrifices needed to send their child to the community-run school, knowing they are barred from white schools." },
    ];

    return (
        <AnimatedSection className="py-20 px-4 bg-gray-900 text-white">
            <div className="max-w-4xl mx-auto text-center">
                <Sparkles size={48} className="mx-auto text-red-400 mb-4" />
                <h2 className="text-4xl font-bold mb-4">Voices from the Counter</h2>
                <p className="text-lg text-gray-300 mb-8">
                    Click a prompt to ask our AI to tell you a story from the heart of the Chinese-American experience.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {prompts.map((p) => (
                        <button
                            key={p.title}
                            onClick={() => getStory(p.prompt)}
                            disabled={isLoading}
                            className="bg-red-600/80 hover:bg-red-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                           <Sparkles size={18} /> {p.title}
                        </button>
                    ))}
                </div>

                {isLoading && (
                     <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-400"></div>
                     </div>
                )}
                {error && <div className="bg-red-900/50 border border-red-500 text-red-300 p-4 rounded-lg">{error}</div>}
                {story && (
                    <div className="bg-gray-800/60 p-6 rounded-lg border border-red-400/50 text-left whitespace-pre-wrap font-serif text-gray-300">
                        {story}
                    </div>
                )}
            </div>
        </AnimatedSection>
    );
};

// COMPONENT: Footer
const Footer = () => (
    <footer className="bg-gray-900 text-center p-8 text-gray-400 border-t border-gray-700">
        <p>A story of strategic survival, community resilience, and entrepreneurial adaptation.</p>
        <p className="text-sm mt-2">Infographic created with Next.js & React. AI stories by Gemini.</p>
    </footer>
);


// MAIN APP COMPONENT
export default function App() {
  return (
    <main className="bg-gray-900 font-sans">
      <HeroSection />
      <JourneySection />
      <CommunityInstitutionsSection />
      <AIStorytellerSection />
      <Footer />
    </main>
  );
}

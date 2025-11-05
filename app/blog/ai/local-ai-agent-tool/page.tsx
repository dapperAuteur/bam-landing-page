import type { FC, SVGProps } from 'react';

// Helper component for Icons
const Icon: FC<{ icon: 'shield' | 'user' | 'code' | 'rocket' | 'target' | 'stack' }> = ({ icon }) => {
    const icons = {
        shield: (props: SVGProps<SVGSVGElement>) => (
            <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-4.016a11.955 11.955 0 019 4.016A12.02 12.02 0 0021 7.056a11.955 11.955 0 01-5.382-3.04z" />
            </svg>
        ),
        user: (props: SVGProps<SVGSVGElement>) => (
             <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
        code: (props: SVGProps<SVGSVGElement>) => (
            <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.24a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 00.517 3.86l2.387.477a2 2 0 001.806.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 00-.517-3.86l-2.387-.477a2 2 0 00-.547-1.806zM15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        rocket: (props: SVGProps<SVGSVGElement>) => (
            <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        target: (props: SVGProps<SVGSVGElement>) => (
            <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
        ),
        stack: (props: SVGProps<SVGSVGElement>) => (
            <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 9h16" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 15h16" />
            </svg>
        ),
    };
    const SelectedIcon = icons[icon];
    return <SelectedIcon className="h-6 w-6" />;
};


// Main Infographic Component
const ProjectSpotlight: FC = () => {
    return (
        <div className="bg-gray-900 text-white antialiased">
            <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24">

                {/* Header */}
                <header className="mb-16 text-center">
                    <span className="font-semibold uppercase tracking-wider text-indigo-400">Project Spotlight</span>
                    <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                        Local AI Agent Tool
                    </h1>
                    <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-400">
                        A product requirements overview for a secure, private, and highly customizable interface for local Large Language Models (LLMs).
                    </p>
                </header>

                {/* Core Principles Section */}
                <section className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 mb-20">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
                           <Icon icon="shield" />
                        </div>
                        <h3 className="text-xl font-bold">Privacy First</h3>
                        <p className="text-gray-400">All data and processing remain on the user's local machine. No cloud storage, no external API calls.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-purple-300">
                           <Icon icon="user" />
                        </div>
                        <h3 className="text-xl font-bold">Deep Customization</h3>
                        <p className="text-gray-400">Users define specialized AI "agents" by providing simple `.txt` instruction files for tailored workflows.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/20 text-pink-300">
                           <Icon icon="code" />
                        </div>
                        <h3 className="text-xl font-bold">Developer Focused</h3>
                        <p className="text-gray-400">Built for a technical audience that values control, performance, and offline capability.</p>
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-16 lg:grid-cols-5 lg:gap-8">
                    
                    {/* Left Column: MVP Features */}
                    <div className="lg:col-span-3">
                         <h2 className="text-3xl font-bold tracking-tight mb-6 flex items-center">
                            <Icon icon="rocket" />
                            <span className="ml-3">MVP Feature Scope (v1.0)</span>
                        </h2>
                        <ul className="space-y-4">
                            {mvpFeatures.map((feature) => (
                                <li key={feature.id} className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 transition-all hover:border-indigo-500 hover:bg-gray-800">
                                    <p className="font-bold text-white">{feature.name}</p>
                                    <p className="text-sm text-gray-400">{feature.description}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Column: Audience & Tech Stack */}
                    <div className="lg:col-span-2">
                         <div className="mb-8">
                            <h2 className="text-3xl font-bold tracking-tight mb-6 flex items-center">
                                <Icon icon="target" />
                                <span className="ml-3">Target Audience</span>
                            </h2>
                            <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                               <p className="font-semibold text-white">Primary: Developers & AI Enthusiasts</p>
                               <p className="text-sm text-gray-400">Users comfortable with local servers (Ollama) who demand privacy and control.</p>
                            </div>
                         </div>
                         <div>
                            <h2 className="text-3xl font-bold tracking-tight mb-6 flex items-center">
                                <Icon icon="stack" />
                                <span className="ml-3">Technology Stack</span>
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {techStack.map(tech => (
                                    <span key={tech} className="rounded-md bg-gray-700 px-3 py-1 text-sm font-medium text-gray-300">{tech}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Data for the component
const mvpFeatures = [
    { id: 'FE-01', name: 'Ollama Connection', description: 'Clear UI status for the connection to the user\'s local Ollama server.' },
    { id: 'FE-02', name: 'Agent Management', description: 'Create and switch between multiple, locally-stored AI agent personas.' },
    { id: 'FE-03', name: 'Instruction File Upload', description: 'Define an agent\'s behavior and system prompt by uploading a simple .txt file.' },
    { id: 'FE-04', name: 'Local Model Selection', description: 'A dropdown to choose from any model available in the user\'s Ollama instance.' },
    { id: 'FE-05', name: 'Intuitive Chat Interface', description: 'A clean, standard interface for conversations with the selected agent.' },
    { id: 'FE-06', name: 'Code Rendering', description: 'Properly formatted syntax highlighting and a copy button for code blocks.' },
];

const techStack = ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "Ollama"];

export default ProjectSpotlight;

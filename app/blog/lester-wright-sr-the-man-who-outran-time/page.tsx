/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { BookOpen, Zap, Trophy, Heart, Brain, Clock, User, BarChart2 } from 'lucide-react';

// interface Color {
//     bg: string;
//     text: string;
// }

// Biography data - this would ideally be passed as a prop or fetched
const biography = `
# Lester Wright Sr.: A Century of Speed, Resilience, and Inspiration

**I. The Measure of a Century: Introducing Lester Wright Sr.**
The air at Franklin Field during the 2022 Penn Relays crackled with anticipation... As 100-year-old Lester Wright Sr. stepped onto the track... he crossed the finish line in 26.34 seconds, and the 38,000 spectators rose in a unified standing ovation. This was more than a race; it was a testament to a life lived with vigor and an unyielding spirit. Lester Wright Sr. is widely celebrated as the "world's fastest centenarian."

**II. Forged in Long Branch: Early Life and Enduring Love**
Lester Wright Sr.'s remarkable journey began on April 29, 1922, in Long Branch, New Jersey. During the 1930s, he was a track star at Long Branch High School, where he met Adele, his "high school sweetheart." Their connection blossomed into a marriage that would span an extraordinary 80 years.

**III. Service and Sacrifice: A World War II Veteran**
Lester Wright Sr. served in the U.S. Army during World War II. He was among the soldiers who endured the harrowing conditions of the Battle of the Bulge and earned four Bronze Battle Stars for his courage. He served in a segregated unit.

**IV. Building a Dream: Career, Community, and Family**
Upon returning from the war, he utilized the GI Bill for college and opened the first Black-owned dental lab in Monmouth County, New Jersey, crafting prosthetic teeth. He and Adele raised four children. His son, Lester E. Wright Jr., also became a competitive master runner.

**V. The Unrelenting Stride: A Lifetime Devoted to Running**
Wright maintained a remarkable routine, running a mile-and-a-half at least three times a week even as he approached his centenary. At age 76, he broke the 200-meter world record for the M75 age group. At 77, he won the 75-and-over 100-meter dash at the Penn Relays.

**VI. Racing into History: The Centenarian World Record Holder**
On April 30, 2022, one day after his 100th birthday, he ran the 100-meter dash in 26.34 seconds at the Penn Relays. This shattered the existing world record of 26.99 seconds for the M100 age group, previously held by Donald Pellmann.

**VII. The Wright Philosophy: Insights from a Century of Living**
Wright's philosophy: "If you're going to go out to run a race, you should really run the race to try to win." He also emphasized the power of the mind: "It all starts with self-belief... I think it's in the head more than it is physical." He deeply valued his 80-year partnership with his wife, Adele, as key to his "great life."

**VIII. An Enduring Legacy: The Man Who Outran Time**
Lester Wright Sr.'s life is a rich tapestry... a decorated World War II veteran, a pioneering African American entrepreneur, a devoted husband, and a record-breaking centenarian athlete. His story challenges ageist stereotypes and broadens perceptions of human capability.
`;


const colorStyles = {
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
};
type ColorKey = keyof typeof colorStyles;

interface InfoCardProps {
    icon: React.ElementType;
    title: string;
    content: string;
    color: ColorKey;
}

const InfoCard = ({ icon: Icon, title, content, color }: InfoCardProps) => {
    // Fallback to gray if color prop is invalid
    const styles = colorStyles[color] || { bg: 'bg-gray-100', text: 'text-gray-600' };

    return (
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 flex items-start space-x-4">
            <div className={`p-3 rounded-full ${styles.bg}`}>
                <Icon className={`w-6 h-6 ${styles.text}`} />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-gray-600 mt-1">{content}</p>
            </div>
        </div>
    );
};

const TimelineItem = ({ year, event, last = false }: { year: string, event: string, last?: boolean }) => (
    <div className="relative pl-8">
        {!last && <div className="absolute left-3 top-5 -bottom-2 w-0.5 bg-blue-300"></div>}
        <div className="absolute left-0 top-2.5 flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full text-white">
            <Clock size={14} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
            <p className="font-bold text-blue-600">{year}</p>
            <p className="text-gray-700">{event}</p>
        </div>
    </div>
);

export default function LesterWrightInfographic() {
    // const [question, setQuestion] = useState('');
    // const [answer, setAnswer] = useState('');
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState('');

    // const handleAskQuestion = async () => {
    //     if (!question.trim()) {
    //         setError('Please enter a question.');
    //         return;
    //     }
    //     setIsLoading(true);
    //     setError('');
    //     setAnswer('');

    //     const prompt = `Based *only* on the following biography of Lester Wright, answer the user's question. If the answer is not in the text, say you don't have that information. Keep the answer concise and to the point.

    //     Biography:
    //     ${biography}

    //     User's Question:
    //     ${question}

    //     Answer:`;

        // try {
        //     const chatHistory = [];
        //     chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        //     const payload = { contents: chatHistory };
            // const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
            // const apiKey = GEMINI_API_KEY;
            // const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            // const response = await fetch(apiUrl, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(payload)
            // });

            // if (!response.ok) {
            //     throw new Error(`API request failed with status ${response.status}`);
            // }

            // const result = await response.json();
            
    //         if (result.candidates && result.candidates.length > 0 &&
    //             result.candidates[0].content && result.candidates[0].content.parts &&
    //             result.candidates[0].content.parts.length > 0) {
    //           const text = result.candidates[0].content.parts[0].text;
    //           setAnswer(text);
    //         } else {
    //             console.error("Unexpected API response structure:", result);
    //             if (result.promptFeedback && result.promptFeedback.blockReason) {
    //                 setError(`Your request was blocked. Reason: ${result.promptFeedback.blockReason}`);
    //             } else {
    //                 setError("Couldn't get an answer. The API returned an unexpected response.");
    //             }
    //         }

    //     } catch (err) {
    //         console.error(err);
    //         setError('An error occurred while fetching the answer. Please try again.');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="container mx-auto p-4 md:p-8">
                {/* Header */}
                <header className="text-center mb-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 tracking-tight">Lester Wright Sr.</h1>
                    <p className="mt-3 text-xl md:text-2xl text-blue-600 font-semibold">The Man Who Outran Time</p>
                </header>

                <main className="space-y-12">
                    {/* Key Highlights Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">Life at a Glance</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InfoCard icon={Trophy} title="World Record Holder" content="Shattered the 100m world record for the M100 age group with a time of 26.34 seconds." color="yellow" />
                            <InfoCard icon={User} title="Pioneering Entrepreneur" content="Opened the first Black-owned dental lab in Monmouth County, NJ." color="blue" />
                            <InfoCard icon={Heart} title="80-Year Marriage" content="Shared a lifetime of love and partnership with his wife, Adele." color="red" />
                            <InfoCard icon={BookOpen} title="WWII Veteran" content="Served with distinction in the Battle of the Bulge, earning 4 Bronze Battle Stars." color="green" />
                            <InfoCard icon={Brain} title="The Wright Philosophy" content='"It all starts with self-belief... I think it`s in the head more than it is physical."' color="purple" />
                             <InfoCard icon={BarChart2} title="Decades of Dominance" content="Broke the M75 200m world record at age 76 and won the Penn Relays 100m at 77." color="indigo" />
                        </div>
                    </section>

                    {/* Timeline Section */}
                    <section>
                         <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">A Century&apos;s Journey</h2>
                        <div className="max-w-2xl mx-auto space-y-6">
                           <TimelineItem year="1922" event="Born in Long Branch, New Jersey." />
                           <TimelineItem year="1930s" event="Becomes a high school track star and meets his future wife, Adele." />
                           <TimelineItem year="WWII" event="Serves in the US Army, fighting in the Battle of the Bulge." />
                           <TimelineItem year="Post-WWII" event="Opens the first Black-owned dental lab in Monmouth County." />
                           <TimelineItem year="1998" event="At 76, breaks the M75 200-meter world record." />
                           <TimelineItem year="1999" event="At 77, wins the 75-and-over 100m dash at the Penn Relays." />
                           <TimelineItem year="2022" event="Celebrates his 100th birthday and sets a new 100m world record (M100) the next day." last={true}/>
                        </div>
                    </section>
                    
                    {/* Gemini Interactive Section */}
                    {/* <section className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200">
                        <div className="text-center">
                            <Zap className="mx-auto h-12 w-12 text-yellow-500" />
                            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Ask Me Anything</h2>
                            <p className="mt-4 text-lg leading-8 text-gray-600">
                                Have a question about Lester Wright&apos;s life? Ask Gemini for an answer based on his biography.
                            </p>
                        </div>
                        <div className="mt-8 max-w-xl mx-auto">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="e.g., How long was he married?"
                                    className="flex-grow w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                                />
                                <button
                                    onClick={handleAskQuestion}
                                    disabled={isLoading}
                                    className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Asking...
                                        </>
                                    ) : 'Ask Gemini'}
                                </button>
                            </div>
                             {error && <p className="mt-3 text-sm text-red-600 text-center">{error}</p>}
                        </div>

                        {answer && (
                            <div className="mt-8 p-6 bg-gray-100 rounded-lg max-w-xl mx-auto">
                                <p className="text-gray-800">{answer}</p>
                            </div>
                        )}
                    </section> */}
                </main>
                
                <footer className="text-center mt-12 py-6 border-t">
                    <p className="text-sm text-gray-500">An infographic celebrating the inspiring life of Lester Wright Sr.</p>
                    {/* <p className="text-sm text-gray-500">An interactive infographic celebrating the inspiring life of Lester Wright Sr.</p> */}
                </footer>
            </div>
        </div>
    );
}

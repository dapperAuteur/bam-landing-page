import React from 'react';

interface IInfoCardProps {
  icon: string;
  title: string;
  children: React.ReactNode;
  colorClass: string;
}

// Helper component for Icons (using Font Awesome)
const Icon = ({ className, fixedWidth = true }: { className: string, fixedWidth?: boolean }) => (
  <i className={`${className} ${fixedWidth ? 'fa-fw' : ''}`}></i>
);

// Reusable Section Title Component
const SectionTitle = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="text-center mb-12">
    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-3">{title}</h2>
    <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">{subtitle}</p>
    <div className="w-24 h-1 bg-cyan-500 mx-auto mt-4 rounded-full"></div>
  </div>
);

// Reusable Info Card Component
const InfoCard = ({ icon, title, children, colorClass = 'border-gray-300' }: IInfoCardProps) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300 ease-in-out border-l-4 ${colorClass}`}>
    <div className="flex items-center mb-4">
      <div className={`text-3xl mr-4 ${colorClass.replace('border', 'text')}`}>
        <Icon className={icon} />
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
    </div>
    <div className="text-gray-600 dark:text-gray-300 space-y-2">{children}</div>
  </div>
);

// Bristol Stool Chart Visual Component
const BristolStoolChart = () => {
    const stools = [
        { type: 1, desc: 'Severe Constipation', details: 'Separate hard lumps, like nuts.', color: 'bg-red-200 dark:bg-red-800', textColor: 'text-red-800 dark:text-red-200' },
        { type: 2, desc: 'Mild Constipation', details: 'Sausage-shaped, but lumpy.', color: 'bg-orange-200 dark:bg-orange-800', textColor: 'text-orange-800 dark:text-orange-200' },
        { type: 3, desc: 'Normal', details: 'Like a sausage but with cracks on its surface.', color: 'bg-green-200 dark:bg-green-800', textColor: 'text-green-800 dark:text-green-200' },
        { type: 4, desc: 'Normal / Ideal', details: 'Like a sausage or snake, smooth and soft.', color: 'bg-green-300 dark:bg-green-700', textColor: 'text-green-900 dark:text-green-100' },
        { type: 5, desc: 'Lacking Fiber', details: 'Soft blobs with clear-cut edges.', color: 'bg-yellow-200 dark:bg-yellow-800', textColor: 'text-yellow-800 dark:text-yellow-200' },
        { type: 6, desc: 'Mild Diarrhea', details: 'Fluffy pieces with ragged edges, a mushy stool.', color: 'bg-orange-200 dark:bg-orange-800', textColor: 'text-orange-800 dark:text-orange-200' },
        { type: 7, desc: 'Severe Diarrhea', details: 'Watery, no solid pieces, entirely liquid.', color: 'bg-red-200 dark:bg-red-800', textColor: 'text-red-800 dark:text-red-200' },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">The Bristol Stool Chart</h3>
            <div className="space-y-4">
                {stools.map(stool => (
                    <div key={stool.type} className={`p-4 rounded-lg flex items-center ${stool.color}`}>
                        <div className={`font-bold text-2xl w-12 text-center ${stool.textColor}`}>
                            {stool.type}
                        </div>
                        <div className="ml-4">
                            <p className={`font-semibold ${stool.textColor}`}>{stool.desc}</p>
                            <p className={`text-sm opacity-90 ${stool.textColor}`}>{stool.details}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// U-Shaped Mortality Curve Visualization
const UShapedCurveChart = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center">
        <h3 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">Bowel Frequency & Mortality Risk</h3>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Risk is lowest in the "Goldilocks Zone" and increases at both extremes.</p>
        <div className="w-full max-w-md">
            <div className="relative h-48">
                {/* U-Curve Path */}
                <svg className="absolute w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                    <path d="M 5,45 C 20,5 80,5 95,45" stroke="url(#gradient)" strokeWidth="3" fill="none" strokeLinecap="round"/>
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f87171" />
                            <stop offset="50%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#f87171" />
                        </linearGradient>
                    </defs>
                </svg>
                 {/* Labels */}
                <div className="absolute bottom-0 left-0 text-center w-1/4">
                    <p className="font-bold text-red-500">High Risk</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Constipation</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">&lt;3 / week</p>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-center">
                    <p className="font-bold text-green-500">Lowest Risk</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">"Goldilocks Zone"</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">~7-10 / week</p>
                </div>
                <div className="absolute bottom-0 right-0 text-center w-1/4">
                    <p className="font-bold text-red-500">High Risk</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Diarrhea</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">&gt;2-3 / day</p>
                </div>
            </div>
            <div className="w-full h-1 bg-gray-300 dark:bg-gray-600 mt-2 rounded-full"></div>
            <p className="text-center text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2">Bowel Movement Frequency</p>
        </div>
    </div>
);

// Metabolite Comparison Component
const MetaboliteComparison = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-green-50 dark:bg-green-900/50 p-6 rounded-2xl border-2 border-green-500 shadow-lg">
            <h4 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4 flex items-center">
                <Icon className="fas fa-leaf mr-3" /> Beneficial Metabolites
            </h4>
            <h5 className="text-xl font-semibold text-gray-800 dark:text-white">SCFAs (Butyrate)</h5>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
                Produced from <strong className="text-green-600 dark:text-green-400">dietary fiber</strong>. They are anti-inflammatory, feed gut cells, and strengthen the gut barrier.
            </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/50 p-6 rounded-2xl border-2 border-red-500 shadow-lg">
            <h4 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4 flex items-center">
                <Icon className="fas fa-skull-crossbones mr-3" /> Detrimental Metabolites
            </h4>
            <h5 className="text-xl font-semibold text-gray-800 dark:text-white">TMAO</h5>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
                Produced from choline/carnitine in <strong className="text-red-600 dark:text-red-400">red meat & eggs</strong>. Promotes plaque buildup in arteries (atherosclerosis).
            </p>
        </div>
    </div>
);


// Main Infographic Component
const BowelHealthInfographic = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="text-center py-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 mb-4">
            The Bowel as a Barometer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your Gut's Daily Report Card on Health, Disease Risk, and Longevity
          </p>
        </header>

        {/* Section 1: The Basics of Bowel Health */}
        <section className="mb-20">
            <SectionTitle 
                title="What is a 'Healthy' Bowel Movement?"
                subtitle="It's more than just going every day. Frequency, form, and ease are key."
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <InfoCard icon="fas fa-calendar-alt" title="Frequency: The 3 & 3 Rule" colorClass="border-blue-500">
                        <p>A healthy range is anywhere from <strong className="text-blue-500">three times a day to three times a week</strong>. Consistency in your own pattern is more important than a daily schedule.</p>
                    </InfoCard>
                    <InfoCard icon="fas fa-cogs" title="The Mechanics of Control" colorClass="border-teal-500">
                        <p>A sophisticated system of muscles (sphincters, puborectalis) and nerves work together. The "anal sampling reflex" allows your body to distinguish between gas, liquid, and solid, preventing accidents.</p>
                    </InfoCard>
                </div>
                <BristolStoolChart />
            </div>
        </section>

        {/* Section 2: The Microbiome Connection */}
        <section className="mb-20">
            <SectionTitle 
                title="The Gut-Health Bridge"
                subtitle="Your bowel habits shape the trillions of microbes in your gut, which in turn influence your entire body."
            />
            <div className="space-y-8">
                <InfoCard icon="fas fa-stopwatch" title="Transit Time is Everything" colorClass="border-purple-500">
                    <p>The speed at which food moves through your gut is the #1 factor shaping your microbiome.</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li><strong>Slow Transit (Constipation):</strong> Leads to a protein-fermenting, pro-inflammatory microbiome.</li>
                        <li><strong>Fast Transit (Diarrhea):</strong> Leads to a loss of microbial diversity.</li>
                        <li><strong>Optimal Transit:</strong> Fosters a diverse, fiber-fermenting, anti-inflammatory microbiome.</li>
                    </ul>
                </InfoCard>
                <MetaboliteComparison />
            </div>
        </section>

        {/* Section 3: Longevity & Disease Risk */}
        <section className="mb-20">
            <SectionTitle
                title="A Predictor of Healthspan"
                subtitle="Large-scale studies show a direct link between bowel habits and major diseases."
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <UShapedCurveChart />
                <div className="space-y-8">
                    <InfoCard icon="fas fa-heart-broken" title="Risks of Constipation" colorClass="border-red-500">
                        <p>Linked to a higher risk of:</p>
                        <ul className="list-disc list-inside mt-2">
                            <li>Cardiovascular Disease (Heart Attack, Stroke)</li>
                            <li>Colorectal Cancer</li>
                            <li>All-Cause Mortality</li>
                        </ul>
                    </InfoCard>
                    <InfoCard icon="fas fa-tint-slash" title="Risks of Chronic Diarrhea" colorClass="border-orange-500">
                        <p>Often signals underlying issues and can lead to:</p>
                         <ul className="list-disc list-inside mt-2">
                            <li>Malnutrition & Dehydration</li>
                            <li>Chronic Inflammation (as in IBD)</li>
                            <li>Increased Cancer Risk (in IBD)</li>
                        </ul>
                    </InfoCard>
                </div>
            </div>
        </section>
        
        {/* Section 4: The Centenarian Gut */}
        <section className="mb-20">
            <SectionTitle
                title="The Microbiome of Longevity"
                subtitle="The guts of centenarians (100+ years old) hold clues to healthy aging."
            />
            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 p-8 rounded-2xl shadow-2xl text-white">
                <h3 className="text-3xl font-bold mb-4">Centenarian Gut Signature:</h3>
                 <ul className="space-y-3 text-lg">
                    <li className="flex items-start"><Icon className="fas fa-star mt-1.5 mr-3" /> <div><strong>High Diversity:</strong> A resilient ecosystem, similar to healthy young adults.</div></li>
                    <li className="flex items-start"><Icon className="fas fa-shield-alt mt-1.5 mr-3" /> <div><strong>Unique Metabolites:</strong> Produce special bile acids that can kill multi-drug resistant "superbugs".</div></li>
                    <li className="flex items-start"><Icon className="fas fa-brain mt-1.5 mr-3" /> <div><strong>Gut-Brain Axis:</strong> A healthy gut is linked to better cognitive function in the very old.</div></li>
                </ul>
            </div>
        </section>

        {/* Section 5: How to Improve Your Gut Health */}
        <section className="mb-20">
            <SectionTitle
                title="Cultivating a 'Longevity' Gut"
                subtitle="You can actively improve your gut health with evidence-based lifestyle changes."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <InfoCard icon="fas fa-seedling" title="Eat More Fiber" colorClass="border-green-500">
                    <p>Aim for <strong className="text-green-500">25-30+ grams per day</strong> from diverse sources: fruits, vegetables, whole grains, legumes. This is the #1 intervention for gut health.</p>
                </InfoCard>
                <InfoCard icon="fas fa-dumbbell" title="Exercise Regularly" colorClass="border-sky-500">
                    <p>Physical activity stimulates gut motility and helps maintain a regular transit time. It's a proven way to reduce constipation risk.</p>
                </InfoCard>
                <InfoCard icon="fas fa-water" title="Stay Hydrated" colorClass="border-blue-500">
                    <p>Water is essential for fiber to do its job. It softens stool and ensures smooth passage. Aim for 2-3 liters of fluid daily.</p>
                </InfoCard>
            </div>
        </section>

        <footer className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <Icon className="fas fa-stethoscope text-cyan-500 text-4xl mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Your Gut is Talking. Are You Listening?</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                Persistent changes in your bowel habits are not trivial. They are important health signals. If you have concerns, speak with a healthcare professional.
            </p>
        </footer>

      </div>
      {/* Font Awesome Script for icons */}
      <script src="https://kit.fontawesome.com/a076d05399.js" crossOrigin="anonymous" async></script>
    </div>
  );
};

export default BowelHealthInfographic;

import React from 'react';

// Helper component for Font Awesome Icons
const Icon = ({ className }) => <i className={className}></i>;

// Individual Info Card Component
const InfoCard = ({ icon, title, children, colorClass }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300 ease-in-out border-l-4 ${colorClass}`}>
    <div className="flex items-center mb-4">
      <div className={`text-3xl mr-4 ${colorClass.replace('border', 'text')}`}>
        <Icon className={icon} />
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-300">{children}</p>
  </div>
);

// Section Title Component
const SectionTitle = ({ title, subtitle }) => (
    <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-white mb-2">
            {title}
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">{subtitle}</p>
        <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
    </div>
);


// Main Infographic Component
const BowelControlInfographic = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="text-center py-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-4">
            The Body's Gatekeeper
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            A Visual Guide to Understanding Bowel Control: Gas vs. Stool
          </p>
        </header>

        {/* Anatomy Section */}
        <section className="mb-20">
            <SectionTitle 
                title="The Anatomy of Continence"
                subtitle="Meet the key players responsible for keeping you in control."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <InfoCard icon="fas fa-box" title="Rectum" colorClass="border-blue-500">
                    The 'waiting room' for stool. It stretches to store waste temporarily, signaling when it's getting full.
                </InfoCard>
                <InfoCard icon="fas fa-door-closed" title="Internal Sphincter" colorClass="border-teal-500">
                    The involuntary 'inner gate'. It stays tightly closed automatically, providing most of the resting security.
                </InfoCard>
                <InfoCard icon="fas fa-user-shield" title="External Sphincter" colorClass="border-green-500">
                    The voluntary 'outer gate'. This is the muscle you consciously squeeze to 'hold it in'.
                </InfoCard>
                <InfoCard icon="fas fa-angle-double-down" title="Puborectalis Muscle" colorClass="border-yellow-500">
                    Creates a 'kink' in the system, like a bend in a hose, providing a crucial mechanical barrier to stop stool.
                </InfoCard>
            </div>
        </section>

        {/* The Sampling Reflex Section */}
        <section className="mb-20">
            <SectionTitle 
                title="The 'Sampling Reflex'"
                subtitle="How your body tells the difference in a few elegant steps."
            />
            <div className="relative">
                {/* Dotted line for visual flow on larger screens */}
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 dark:bg-gray-700 -translate-y-1/2"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                    <div className="relative flex flex-col items-center">
                        <div className="bg-indigo-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 z-10 shadow-lg">1</div>
                        <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Arrival & Stretch</h4>
                        <p className="text-gray-600 dark:text-gray-400">Waste arrives in the rectum, stretching its walls and signaling 'fullness'.</p>
                    </div>
                    <div className="relative flex flex-col items-center">
                        <div className="bg-purple-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 z-10 shadow-lg">2</div>
                        <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">The Sample</h4>
                        <p className="text-gray-600 dark:text-gray-400">The inner gate (IAS) relaxes slightly, allowing a tiny sample to enter the super-sensitive upper anal canal.</p>
                    </div>
                    <div className="relative flex flex-col items-center">
                        <div className="bg-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 z-10 shadow-lg">3</div>
                        <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Analysis & Decision</h4>
                        <p className="text-gray-600 dark:text-gray-400">Nerves analyze the sample's texture (gas, liquid, or solid) and send the info to the brain for a conscious decision.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* When The System Fails Section */}
        <section className="mb-20">
            <SectionTitle 
                title="When the System Fails"
                subtitle="Fecal incontinence is a symptom, not a disease. Here are some common underlying causes."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <InfoCard icon="fas fa-baby" title="Childbirth Injury" colorClass="border-red-500">
                    Stretching or tearing of nerves and muscles during delivery can weaken the control system.
                </InfoCard>
                <InfoCard icon="fas fa-brain" title="Nerve Damage" colorClass="border-orange-500">
                    Conditions like diabetes, spinal cord injury, or MS can disrupt communication between the brain and bowel.
                </InfoCard>
                <InfoCard icon="fas fa-fire" title="Bowel Disorders" colorClass="border-amber-500">
                    IBD and IBS can cause inflammation, urgency, and hypersensitivity that overwhelm the system.
                </InfoCard>
                <InfoCard icon="fas fa-user-clock" title="Aging" colorClass="border-lime-500">
                    Natural weakening of muscles and decline in nerve function can make the system less reliable over time.
                </InfoCard>
                <InfoCard icon="fas fa-pills" title="Chronic Constipation" colorClass="border-cyan-500">
                    A hard mass of stool can stretch and weaken muscles, leading to 'overflow' leakage of liquid stool.
                </InfoCard>
                <InfoCard icon="fas fa-briefcase-medical" title="Surgery or Trauma" colorClass="border-sky-500">
                    Operations in the anorectal area can sometimes damage the delicate sphincter muscles.
                </InfoCard>
            </div>
        </section>

        {/* Costs of an Error Section */}
        <section className="mb-20">
            <SectionTitle 
                title="The High Cost of an Error"
                subtitle="The impact of incontinence extends far beyond a physical symptom."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <InfoCard icon="fas fa-band-aid" title="Physical Toll" colorClass="border-rose-500">
                    Leads to skin irritation, pain, and breakdown. Requires constant, meticulous hygiene.
                </InfoCard>
                <InfoCard icon="fas fa-theater-masks" title="Psychological Burden" colorClass="border-fuchsia-500">
                    Causes deep embarrassment, shame, and anxiety, often leading to depression and isolation.
                </InfoCard>
                <InfoCard icon="fas fa-dollar-sign" title="Financial Impact" colorClass="border-violet-500">
                    Substantial costs from management products (pads, creams), medical care, and lost productivity.
                </InfoCard>
            </div>
        </section>

        {/* Call to Action Section */}
        <footer className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <Icon className="fas fa-info-circle text-indigo-500 text-4xl mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">You Are Not Alone. Help is Available.</h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                Loss of bowel control is a serious medical condition, not a personal failing. Effective treatments exist. The most important step is to break the silence and talk to a healthcare provider.
            </p>
            <button className="bg-indigo-500 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-600 transition-colors duration-300 shadow-lg">
                Seek Professional Advice
            </button>
        </footer>

      </div>
      {/* Add Font Awesome for icons */}
      <script src="https://kit.fontawesome.com/a076d05399.js" crossOrigin="anonymous" async></script>
    </div>
  );
};

export default BowelControlInfographic;

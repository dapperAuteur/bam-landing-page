"use client"
import React from 'react';

export default function BetterViceClubCurriculum() {
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 to-amber-700">
      {/* Print Button - Hidden in print */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <button
          onClick={handlePrintPDF}
          className="bg-white text-amber-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download PDF
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-2xl print:shadow-none">
        {/* Cover Page */}
        <div className="bg-gradient-to-br from-amber-900 to-amber-700 text-white p-16 text-center min-h-screen flex flex-col justify-center print:min-h-0 print:page-break-after-always">
          <h1 className="text-6xl font-bold mb-6 text-shadow-lg print:text-4xl">
            THE BETTER VICE CLUB
          </h1>
          <h2 className="text-2xl mb-8 opacity-90 italic print:text-xl">
            Cross-Curricular Storytelling Curriculum
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-12 opacity-90 leading-relaxed">
            Transform your classroom with engaging commodity narratives that connect English, History, Geography, and Economics through the stories of coffee, tea, chocolate, and more.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
              📚 Multi-Subject Integration
            </span>
            <span className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
              🎯 Standards Aligned
            </span>
            <span className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
              🌍 Global Perspectives
            </span>
          </div>
        </div>

        {/* Overview */}
        <div className="p-16 print:p-8 print:page-break-after-always">
          <h1 className="text-4xl font-bold text-amber-900 mb-8 border-b-4 border-amber-600 pb-4">
            Why Better Vice Club?
          </h1>
          
          <div className="bg-gradient-to-r from-amber-900 to-amber-700 text-white p-8 rounded-2xl mb-8">
            <h3 className="text-2xl font-semibold mb-4">🌟 Revolutionary Approach to Cross-Curricular Learning</h3>
            <p className="text-lg leading-relaxed">
              Students explore the fascinating stories behind everyday commodities - discovering history, geography, economics, and cultural analysis through engaging narratives that make learning memorable and meaningful.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-amber-900 mb-6">📖 What Makes This Different?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-amber-600">
              <div className="text-3xl mb-3">🎧</div>
              <h3 className="text-xl font-semibold mb-2">Audio Storytelling</h3>
              <p>Podcast-style episodes that capture student attention while delivering rich educational content</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-amber-600">
              <div className="text-3xl mb-3">🔗</div>
              <h3 className="text-xl font-semibold mb-2">Cross-Curricular Connections</h3>
              <p>Seamlessly integrates English, History, Geography, and Economics in authentic contexts</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-amber-600">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Global Perspectives</h3>
              <p>Students explore cultural connections and develop critical thinking about global systems</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-amber-600">
              <div className="text-3xl mb-3">📝</div>
              <h3 className="text-xl font-semibold mb-2">Ready-to-Use Materials</h3>
              <p>Complete lesson plans, activities, and assessments aligned with state standards</p>
            </div>
          </div>
        </div>

        {/* Episode Library */}
        <div className="p-16 print:p-8 print:page-break-after-always">
          <h1 className="text-4xl font-bold text-amber-900 mb-8 border-b-4 border-amber-600 pb-4">
            📻 Episode Library
          </h1>
          
          <div className="space-y-6">
            <div className="bg-white border border-amber-200 p-6 rounded-xl border-l-4 border-amber-600">
              <h3 className="text-xl font-semibold mb-2">☕ Episode 1: Coffee - "The Daily Global Connection"</h3>
              <p className="mb-2"><strong>Focus:</strong> Colonial history, global trade routes, economic inequality, cultural rituals</p>
              <p><strong>Activities:</strong> Historical research, economic analysis, creative writing from multiple perspectives</p>
            </div>

            <div className="bg-white border border-amber-200 p-6 rounded-xl border-l-4 border-amber-600">
              <h3 className="text-xl font-semibold mb-2">🍵 Episode 2: Tea - "Ceremonies and Colonialism"</h3>
              <p className="mb-2"><strong>Focus:</strong> Cultural traditions, British imperialism, geography of production, social movements</p>
              <p><strong>Activities:</strong> Cultural comparison essays, timeline creation, policy analysis</p>
            </div>

            <div className="bg-white border border-amber-200 p-6 rounded-xl border-l-4 border-amber-600">
              <h3 className="text-xl font-semibold mb-2">🍫 Episode 3: Chocolate - "Sweet Injustice"</h3>
              <p className="mb-2"><strong>Focus:</strong> Labor practices, environmental impact, indigenous knowledge, consumer ethics</p>
              <p><strong>Activities:</strong> Investigative journalism, ethical consumption debates, solution-oriented projects</p>
            </div>

            <div className="bg-white border border-amber-200 p-6 rounded-xl border-l-4 border-amber-600">
              <h3 className="text-xl font-semibold mb-2">🌶️ Episode 4: Spices - "Routes of Flavor and Power"</h3>
              <p className="mb-2"><strong>Focus:</strong> Maritime exploration, cultural exchange, economic competition, migration patterns</p>
              <p><strong>Activities:</strong> Map analysis, cultural synthesis projects, historical fiction writing</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-900 to-amber-700 text-white p-6 rounded-xl mt-8 text-center">
            <p className="text-lg">
              <strong>Each episode includes:</strong> 15-20 minute audio narrative • Standards-aligned activities • Differentiation strategies • Assessment rubrics • Extension projects
            </p>
          </div>
        </div>

        {/* Standards Alignment */}
        <div className="p-16 print:p-8 print:page-break-after-always">
          <h1 className="text-4xl font-bold text-amber-900 mb-8 border-b-4 border-amber-600 pb-4">
            🎯 Standards Alignment
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl text-center border-2 border-amber-600">
              <h3 className="text-xl font-semibold mb-3">📚 English</h3>
              <p>Reading comprehension, research skills, argumentative writing, multimedia analysis</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl text-center border-2 border-amber-600">
              <h3 className="text-xl font-semibold mb-3">🌍 Geography</h3>
              <p>Human-environment interaction, spatial analysis, cultural geography, economic systems</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl text-center border-2 border-amber-600">
              <h3 className="text-xl font-semibold mb-3">📜 History</h3>
              <p>Historical thinking, cause and effect, primary source analysis, global connections</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl text-center border-2 border-amber-600">
              <h3 className="text-xl font-semibold mb-3">💰 Economics</h3>
              <p>Global trade, market systems, economic inequality, consumer decision-making</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-amber-900 mb-6">📋 Sample Activity Types</h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <p><strong>Research Projects:</strong> Students investigate historical and contemporary issues using multiple sources</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <p><strong>Creative Writing:</strong> Personal narratives, historical fiction, and policy proposals</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <p><strong>Cultural Analysis:</strong> Compare traditions and practices across different societies</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <p><strong>Economic Modeling:</strong> Analyze supply chains and fair trade principles</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <p><strong>Multimedia Presentations:</strong> Students create documentaries, podcasts, and digital stories</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <p><strong>Ethical Debates:</strong> Examine consumer responsibility and global citizenship</p>
            </div>
          </div>
        </div>

        {/* Differentiation */}
        <div className="p-16 print:p-8 print:page-break-after-always">
          <h1 className="text-4xl font-bold text-amber-900 mb-8 border-b-4 border-amber-600 pb-4">
            ♿ Built for Every Student
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-amber-600">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="text-xl font-semibold mb-2">English Language Learners</h3>
              <p>Vocabulary scaffolding, cultural bridges, multimedia options, collaborative structures</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-amber-600">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="text-xl font-semibold mb-2">Gifted & Advanced</h3>
              <p>Independent research opportunities, primary source analysis, mentorship roles, publication projects</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-amber-600">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Learning Differences</h3>
              <p>Multiple modalities, flexible assessment, technology integration, strength-based approaches</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-amber-600">
              <div className="text-3xl mb-3">👂</div>
              <h3 className="text-xl font-semibold mb-2">Different Learning Styles</h3>
              <p>Visual, auditory, and kinesthetic options in every lesson with choice-based assessments</p>
            </div>
          </div>
        </div>

        {/* Implementation */}
        <div className="p-16 print:p-8 print:page-break-after-always">
          <h1 className="text-4xl font-bold text-amber-900 mb-8 border-b-4 border-amber-600 pb-4">
            🚀 Easy Implementation
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-amber-600">
              <div className="text-3xl mb-3">📁</div>
              <h3 className="text-xl font-semibold mb-2">Complete Lesson Plans</h3>
              <p>Day-by-day instructions with timing, materials lists, and preparation notes</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-amber-600">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-xl font-semibold mb-2">Assessment Tools</h3>
              <p>Rubrics, checklists, self-assessment forms, and portfolio guidelines</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-amber-600">
              <div className="text-3xl mb-3">💻</div>
              <h3 className="text-xl font-semibold mb-2">Digital Resources</h3>
              <p>Downloadable handouts, presentation slides, and multimedia links</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-amber-600">
              <div className="text-3xl mb-3">🔄</div>
              <h3 className="text-xl font-semibold mb-2">Flexible Pacing</h3>
              <p>Adapt to block schedules, traditional periods, or project-based learning cycles</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-900 to-amber-700 text-white p-8 rounded-2xl mb-8">
            <h3 className="text-xl font-semibold mb-4">🎯 What You Get:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p>✅ Audio episodes (MP3 format)</p>
                <p>✅ Complete lesson plans</p>
                <p>✅ Student handouts & worksheets</p>
              </div>
              <div className="space-y-2">
                <p>✅ Assessment rubrics</p>
                <p>✅ Extension activities</p>
                <p>✅ Implementation guide</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-amber-900 mb-6">⏰ Time Requirements</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <p><strong>Minimum Implementation:</strong> 2-3 weeks per episode (8-12 class periods)</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <p><strong>Full Implementation:</strong> One semester covering all episodes with extensions</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600 font-bold text-lg">✓</span>
              <p><strong>Flexible Options:</strong> Use individual episodes as standalone units or integrate throughout the year</p>
            </div>
          </div>
        </div>

        {/* Get Started */}
        <div className="p-16 print:p-8">
          <div className="bg-gradient-to-r from-amber-900 to-amber-700 text-white p-12 rounded-2xl text-center mb-8">
            <h2 className="text-3xl font-bold mb-6">🌟 Transform Your Classroom Today</h2>
            <p className="text-xl leading-relaxed">
              Join educators who are already using Better Vice Club to create engaged, critically thinking students who understand their place in the global community.
            </p>
          </div>

          <div className="bg-white border-2 border-amber-200 p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">🔗 Explore the Full Curriculum</h3>
            <p className="mb-4 text-lg">Visit our interactive website to browse sample materials, view detailed lesson plans, and request curriculum access:</p>
            
            <div className="bg-gray-100 border-2 border-dashed border-amber-600 p-4 rounded-lg text-center mb-6">
              <code className="text-lg font-mono">https://i.brandanthonymcdonald.com/commodities-curriculum</code>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p>✅ Download sample lessons</p>
                <p>✅ Preview audio episodes</p>
                <p>✅ View student work examples</p>
              </div>
              <div className="space-y-2">
                <p>✅ Access implementation guides</p>
                <p>✅ Request full curriculum</p>
                <p>✅ Connect with other educators</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-2xl mt-8 text-center">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">📞 Questions? Let's Talk!</h3>
            <p className="text-lg mb-4">Schedule a consultation to discuss how Better Vice Club can work in your specific teaching context.</p>
            <p className="text-xl font-semibold text-amber-900">
              Ready to give your students the global perspective they deserve?
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:min-h-0 {
            min-height: 0 !important;
          }
          .print\\:page-break-after-always {
            page-break-after: always;
          }
          .print\\:p-8 {
            padding: 2rem !important;
          }
          .print\\:text-4xl {
            font-size: 2.25rem !important;
            line-height: 2.5rem !important;
          }
          .print\\:text-xl {
            font-size: 1.25rem !important;
            line-height: 1.75rem !important;
          }
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
        .text-shadow-lg {
          text-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
}
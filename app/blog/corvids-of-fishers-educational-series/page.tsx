"use client"

import React, { useState } from 'react';

interface Activity {
  title: string;
  description: string;
  materials: string[];
  assessment: string;
  implementation: string;
  crossCurricular: {
    math: string;
    ela: string;
    socialStudies: string;
  };
}

interface GradeContent {
  standard: string;
  episodes: string[];
  activities: Activity[];
}

const grades = ['K', '1', '2', '3', '4', '5'] as const;
type GradeTab = typeof grades[number];

const educationalContent: Record<GradeTab, GradeContent> = {
    'K': {
      standard: 'K.Interdependent Relationships in Ecosystems',
      episodes: ['The Intelligence Network', 'The Cache Master'],
      activities: [
        {
          title: 'Corvid Family Tree',
          description: 'Sort corvid pictures by observable characteristics and create simple family trees',
          materials: ['Corvid picture cards', 'Large paper', 'Glue sticks', 'Markers'],
          assessment: 'Students identify one corvid species and explain identifying characteristics',
          implementation: 'Best done after watching Episode 1. Allow 30 minutes for sorting and discussion.',
          crossCurricular: {
            math: 'Counting and sorting by attributes',
            ela: 'Vocabulary development (crow, jay, grackle)',
            socialStudies: 'Family structures and relationships'
          }
        },
        {
          title: 'Acorn Hunt & Cache Game',
          description: 'Students hide plastic acorns like Blue Jays and try to relocate them',
          materials: ['Plastic acorns (30+)', 'Simple maps', 'Clipboards', 'Pencils'],
          assessment: 'Students explain why Blue Jays remember hiding spots and demonstrate mapping skills',
          implementation: 'Use playground or gym. Hide acorns in 10 locations, wait 15 minutes, then search.',
          crossCurricular: {
            math: 'Spatial reasoning and basic mapping',
            ela: 'Following and giving directions',
            socialStudies: 'Community helpers and planning'
          }
        }
      ]
    },
    '1': {
      standard: 'K.Interdependent Relationships in Ecosystems (continued)',
      episodes: ['The Imitator', 'The Mob Rules'],
      activities: [
        {
          title: 'Blue Jay Mimic Game',
          description: 'Students distinguish between Blue Jay calls and actual hawk calls',
          materials: ['Audio recordings', 'Speaker', 'Sound identification cards'],
          assessment: 'Students explain why Blue Jays mimic predator sounds',
          implementation: 'Play 5-second clips. Have students guess real vs. mimic before revealing.',
          crossCurricular: {
            math: 'Pattern recognition in sounds',
            ela: 'Listening skills and sound-letter connections',
            socialStudies: 'Communication methods'
          }
        },
        {
          title: 'Geist Reservoir Virtual Investigation',
          description: 'Explore corvid habitats through virtual field trip to local Fishers locations',
          materials: ['Tablets/computer', 'Virtual field trip links', 'Observation sheets'],
          assessment: 'Students identify habitat needs: trees, water, food sources',
          implementation: 'Use Google Earth to explore Geist area. Pause frequently for observations.',
          crossCurricular: {
            math: 'Counting habitat features',
            ela: 'Descriptive writing about habitats',
            socialStudies: 'Local community geography'
          }
        }
      ]
    },
    '2': {
      standard: '2.Life Science - Patterns of animal survival needs',
      episodes: ['The Generational Memory', 'The Weather Prophets'],
      activities: [
        {
          title: 'Fishers Neighborhood Memory Map',
          description: 'Create maps showing important neighborhood locations like crow families do',
          materials: ['Local maps', 'Colored pencils', 'Interview sheets', 'Clipboards'],
          assessment: 'Students explain how memory helps animals and humans survive',
          implementation: 'Interview family members about neighborhood changes. Create before/after maps.',
          crossCurricular: {
            math: 'Map reading and basic measurement',
            ela: 'Interview skills and descriptive writing',
            socialStudies: 'Community changes over time'
          }
        },
        {
          title: 'Weather Prediction Investigation',
          description: 'Track weather alongside corvid behavior observations',
          materials: ['Thermometers', 'Weather tracking sheets', 'Binoculars', 'Clipboards'],
          assessment: 'Students record weather patterns and corvid behavior correlations',
          implementation: 'Daily 10-minute observations for one week. Chart results together.',
          crossCurricular: {
            math: 'Data collection and simple graphing',
            ela: 'Scientific vocabulary and observation logs',
            socialStudies: 'How weather affects community activities'
          }
        }
      ]
    },
    '3': {
      standard: '3.Ecosystems - Environmental impacts on organisms',
      episodes: ['The Tool Users', 'The Urban Adapters'],
      activities: [
        {
          title: 'Corvid Intelligence Lab',
          description: 'Design problem-solving tests using classroom materials',
          materials: ['Puzzle pieces', 'Small containers', 'Various tools', 'Timer', 'Recording sheets'],
          assessment: 'Students document problem-solving strategies and compare to corvid methods',
          implementation: 'Set up 4 stations with different challenges. Rotate groups every 15 minutes.',
          crossCurricular: {
            math: 'Measurement and timing experiments',
            ela: 'Scientific method vocabulary and documentation',
            socialStudies: 'Innovation and technology development'
          }
        },
        {
          title: 'Urban Wildlife Impact Study',
          description: 'Survey Fishers development impact on corvid habitats',
          materials: ['Survey sheets', 'Cameras', 'Maps of Fishers', 'Poster supplies'],
          assessment: 'Students create recommendations for bird-friendly neighborhoods',
          implementation: 'Send surveys home to families. Compile results in class discussion.',
          crossCurricular: {
            math: 'Survey data analysis and percentage calculations',
            ela: 'Persuasive writing and presentation skills',
            socialStudies: 'Urban planning and community development'
          }
        }
      ]
    },
    '4': {
      standard: '3.Ecosystems (continued) & 5.Ecosystems foundation',
      episodes: ['The Night Shift', 'The Future Flock'],
      activities: [
        {
          title: 'Fish Crow Aquatic Adaptation',
          description: 'Compare Fish Crow bills to other corvid bills using measurements',
          materials: ['Rulers', 'Magnifying glasses', 'Bird specimen photos', 'Measurement charts'],
          assessment: 'Students explain adaptation advantages for aquatic environments',
          implementation: 'Use high-quality photos for measurement. Discuss form follows function.',
          crossCurricular: {
            math: 'Precise measurement and comparison calculations',
            ela: 'Scientific explanation writing',
            socialStudies: 'How geography affects lifestyles'
          }
        },
        {
          title: 'Fishers Urban Planning Project',
          description: 'Design corvid-friendly modifications to new subdivisions',
          materials: ['Planning maps', 'Design software/paper', 'Presentation tools', 'Research materials'],
          assessment: 'Students present proposals with scientific justification',
          implementation: 'Contact city planning office for simplified development maps.',
          crossCurricular: {
            math: 'Scale, proportion, and geometric design',
            ela: 'Research skills and presentations',
            socialStudies: 'Civic engagement and government processes'
          }
        }
      ]
    },
    '5': {
      standard: '5.Ecosystems - Matter and energy flow',
      episodes: ['All episodes for comprehensive understanding'],
      activities: [
        {
          title: 'White River Watershed Analysis',
          description: 'Map energy flow through Fishers ecosystems including corvid roles',
          materials: ['Ecosystem diagrams', 'Colored arrows', 'Research materials', 'Large poster board'],
          assessment: 'Students explain ecosystem impacts if corvids disappeared',
          implementation: 'Build complexity over several days. Start with simple food chains.',
          crossCurricular: {
            math: 'Complex data analysis and statistical interpretation',
            ela: 'Technical writing and scientific communication',
            socialStudies: 'Environmental policy and conservation history'
          }
        },
        {
          title: 'Conservation Action Implementation',
          description: 'Partner with Hamilton County Parks on real conservation project',
          materials: ['Project planning templates', 'Communication tools', 'Measurement equipment'],
          assessment: 'Students document project progress and measure outcomes',
          implementation: 'Contact parks department in advance. Plan 4-6 week project timeline.',
          crossCurricular: {
            math: 'Project management and outcome measurement',
            ela: 'Professional communication and documentation',
            socialStudies: 'Civic responsibility and community service'
          }
        }
      ]
    }
};

const CorvidEducationMarketing = () => {
  const [activeTab, setActiveTab] = useState<GradeTab>('K');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    schoolName: '',
    gradeTeaching: '',
    schoolDistrict: '',
    city: '',
    state: '',
    customCreationRequest: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.schoolName || !formData.gradeTeaching || !formData.schoolDistrict || !formData.city || !formData.state) {
      alert('Please fill in all required fields.');
      return;
    }
    console.log('Form submitted:', formData);
    alert('Thank you for your interest! We will contact you soon with complete curriculum access.');
  };
  const currentContent = educationalContent[activeTab];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Corvids of Fishers: Educational Series
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Planet Earth-Style Mini-Documentaries + Standards-Aligned Activities
        </p>
        <p className="text-lg text-gray-500">
          Bringing wildlife intelligence into your classroom through local corvid stories
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-bold text-lg text-blue-800 mb-3">🎬 Documentary Series</h3>
          <p className="text-gray-700">10 episodes featuring corvids in Fishers, Indiana with Planet Earth-style narration</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="font-bold text-lg text-green-800 mb-3">📚 Standards-Aligned</h3>
          <p className="text-gray-700">Activities meet Indiana Science Standards with cross-curricular connections</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="font-bold text-lg text-purple-800 mb-3">🏫 Ready to Implement</h3>
          <p className="text-gray-700">Complete materials lists, rubrics, and implementation notes included</p>
        </div>
      </div>

      {/* Grade Level Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => setActiveTab(grade)}
                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                  activeTab === grade
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Grade {grade}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Grade Content */}
      <div className="mb-8">
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Grade {activeTab} Activities</h2>
          <p className="text-gray-600 mb-2">
            <strong>Science Standard:</strong> {currentContent.standard}
          </p>
          <p className="text-gray-600">
            <strong>Featured Episodes:</strong> {currentContent.episodes.join(', ')}
          </p>
        </div>

        {/* Activities */}
        <div className="space-y-8">
          {currentContent.activities.map((activity, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{activity.title}</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">📝 Description</h4>
                  <p className="text-gray-600 mb-4">{activity.description}</p>
                  
                  <h4 className="font-semibold text-gray-700 mb-2">🎯 Implementation Notes</h4>
                  <p className="text-gray-600 mb-4">{activity.implementation}</p>
                  
                  <h4 className="font-semibold text-gray-700 mb-2">📊 Assessment Rubric</h4>
                  <p className="text-gray-600">{activity.assessment}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">🛠️ Materials Needed</h4>
                  <ul className="list-disc list-inside text-gray-600 mb-4">
                    {activity.materials.map((material, i) => (
                      <li key={i}>{material}</li>
                    ))}
                  </ul>
                  
                  <h4 className="font-semibold text-gray-700 mb-2">🌐 Cross-Curricular Extensions</h4>
                  <div className="space-y-2">
                    <div className="bg-blue-50 p-2 rounded">
                      <span className="font-medium text-blue-700">📊 Math:</span>
                      <span className="text-gray-700 ml-2">{activity.crossCurricular.math}</span>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <span className="font-medium text-green-700">📚 ELA:</span>
                      <span className="text-gray-700 ml-2">{activity.crossCurricular.ela}</span>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <span className="font-medium text-purple-700">🌍 Social Studies:</span>
                      <span className="text-gray-700 ml-2">{activity.crossCurricular.socialStudies}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Get Complete Curriculum Access</h2>
        <p className="text-gray-600 mb-6">
          Request full access to all documentary episodes, detailed lesson plans, assessment rubrics, 
          and printable materials. Custom wildlife content available for your local community!
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="teacher@school.edu"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School Name *
            </label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Elementary School"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grade(s) Teaching *
            </label>
            <select
              name="gradeTeaching"
              value={formData.gradeTeaching}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select grade level</option>
              <option value="K">Kindergarten</option>
              <option value="1">1st Grade</option>
              <option value="2">2nd Grade</option>
              <option value="3">3rd Grade</option>
              <option value="4">4th Grade</option>
              <option value="5">5th Grade</option>
              <option value="Multiple">Multiple Grades</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              School District *
            </label>
            <input
              type="text"
              name="schoolDistrict"
              value={formData.schoolDistrict}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Hamilton Southeastern Schools"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Fishers"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Indiana"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="flex items-center bg-yellow-50 p-3 rounded-md">
              <input
                type="checkbox"
                name="customCreationRequest"
                checked={formData.customCreationRequest}
                onChange={handleInputChange}
                className="mr-3 h-4 w-4 text-blue-600"
              />
              <span className="text-sm text-gray-700 font-medium">
                🌟 I'm interested in custom "Nature in My Community" content for our local area
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-7">
              We can create documentaries about wildlife in your specific region with locally-aligned activities
            </p>
          </div>
          
          <div className="md:col-span-2">
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-md hover:from-blue-700 hover:to-green-700 transition duration-300 font-medium text-lg"
            >
              🚀 Request Complete Curriculum Access
            </button>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Join 500+ educators already using wildlife documentaries to inspire young scientists
          </p>
        </div>
      </div>
    </div>
  );
};

export default CorvidEducationMarketing;
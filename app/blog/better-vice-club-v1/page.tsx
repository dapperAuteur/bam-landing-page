"use client"

import React, { useState, FC, ChangeEvent, FormEvent } from 'react';
import { ChevronDownIcon, ChevronUpIcon, PlayIcon, BookOpenIcon, GlobeAltIcon, BanknotesIcon, PencilIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface SubjectDetails {
  geography: string;
  socialStudies: string;
  economics: string;
  ela: string;
}

interface Episode {
  title: string;
  subtitle: string;
  description: string;
  subjects: SubjectDetails;
}

type EpisodeDataMap = {
  [key: string]: Episode;
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  schoolName: string;
  schoolDistrict: string;
  roleInEducation: string[];
  gradesWorking: string[];
  subjectInterests: string[];
  topicInterests: string[];
  customContentInterest: boolean;
  howDidYouHear: string;
  additionalQuestions: string;
}

const EpisodeData: EpisodeDataMap = {
  coffee: {
    title: "Stories in Every Cup",
    subtitle: "Coffee's Journey from Ethiopia to Your Morning Routine", 
    description: "Explore Ethiopian highlands, trade routes, fair trade economics, and cultural ceremonies through the lens of your daily coffee.",
    subjects: {
      geography: "Coffee belt regions, climate requirements, trade route mapping",
      socialStudies: "Ethiopian Buna ceremonies, colonial trade impact, cultural appropriation",
      economics: "Fair trade vs conventional pricing, cooperative business models, labor economics",
      ela: "Cultural storytelling, interview techniques, memoir writing"
    }
  },
  tea: {
    title: "The Way of Tea",
    subtitle: "From Chinese Mountains to Mindful Moments",
    description: "Discover Chinese traditions, meditation practices, and colonial impacts through tea ceremony exploration.",
    subjects: {
      geography: "Asian agricultural zones, monsoon patterns, cultural landscapes",
      socialStudies: "Buddhist monastery traditions, British colonial history, cultural preservation",
      economics: "Tea auction systems, processing value chains, traditional vs industrial economics",
      ela: "Philosophical texts analysis, cultural comparison writing, meditation narratives"
    }
  },
  chocolate: {
    title: "The Food of the Gods",
    subtitle: "Cacao's Sacred Journey Through Time",
    description: "Trace chocolate from Maya temples to modern bean-to-bar economics and cultural significance.",
    subjects: {
      geography: "Tropical rainforest ecosystems, Central American highlands, biodiversity zones",
      socialStudies: "Maya/Aztec civilizations, Spanish colonization, contemporary indigenous rights",
      economics: "Colonial extraction vs community cooperatives, direct trade principles, supply chain analysis",
      ela: "Creation myths analysis, historical narrative writing, cultural sensitivity in storytelling"
    }
  },
  sugar: {
    title: "The Sweet Celebration",
    subtitle: "Sugar's Complex Global Story",
    description: "Understand sugar's role in celebration, colonial history, and modern community economics.",
    subjects: {
      geography: "Tropical agriculture, plantation geography, seasonal production cycles",
      socialStudies: "Atlantic slave trade, plantation systems, contemporary labor rights",
      economics: "Commodity markets, price volatility, agricultural cooperatives",
      ela: "Historical documentation, family tradition stories, economic justice narratives"
    }
  },
  guayusa: {
    title: "The Communal Brew",
    subtitle: "Sacred Plants and Community Bonds",
    description: "Explore Amazon traditions, West African hospitality, and the role of ritual in community building.",
    subjects: {
      geography: "Amazon rainforest ecosystems, West African forests, traditional territory mapping",
      socialStudies: "Indigenous knowledge systems, community governance, cultural protocol",
      economics: "Traditional economies, community resource management, sustainable harvesting",
      ela: "Oral tradition documentation, community interview projects, cultural preservation writing"
    }
  },
  kava: {
    title: "The Root of Peace",
    subtitle: "Pacific Island Ceremonies and Social Harmony",
    description: "Learn about Pacific Island ceremonies, conflict resolution, and social harmony practices.",
    subjects: {
      geography: "Pacific Island formations, maritime climates, volcanic soil systems",
      socialStudies: "Polynesian navigation, traditional governance, peace-making ceremonies",
      economics: "Island economies, sustainable resource use, traditional exchange systems",
      ela: "Cultural protocol documentation, conflict resolution narratives, community storytelling"
    }
  },
  synthesis: {
    title: "My Daily Altar",
    subtitle: "Creating Personal Rituals from Global Wisdom",
    description: "Synthesize learning to create meaningful personal practices that honor global cultures.",
    subjects: {
      geography: "Global synthesis mapping, climate zone connections, cultural geography integration",
      socialStudies: "Cultural appropriation vs appreciation, global citizenship, ethical consumption",
      economics: "Conscious consumerism, economic impact analysis, personal choice economics",
      ela: "Reflective writing, personal narrative development, cultural synthesis projects"
    }
  }
};

const LearnWitUSLandingV1 = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeEpisode, setActiveEpisode] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    schoolName: '',
    schoolDistrict: '',
    roleInEducation: [],
    gradesWorking: [],
    subjectInterests: [],
    topicInterests: [],
    customContentInterest: false,
    howDidYouHear: '',
    additionalQuestions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      if (name === 'customContentInterest') {
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else if (['roleInEducation', 'gradesWorking', 'subjectInterests', 'topicInterests'].includes(name)) {
        const key = name as keyof Pick<FormData, 'roleInEducation' | 'gradesWorking' | 'subjectInterests' | 'topicInterests'>;
        setFormData(prev => ({
          ...prev,
          [key]: checked 
            ? [...prev[key], value]
            : prev[key].filter(item => item !== value)
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.schoolName) {
      setSubmitMessage("Please fill in all required fields.");
      setIsError(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          formType: 'learn-witus-v1'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'An error occurred.');
      }

      setSubmitMessage("Thank you! We'll be in touch with access information soon.");
      setIsError(false);
      setFormData({
        name: '', email: '', phone: '', country: '', state: '', city: '',
        schoolName: '', schoolDistrict: '', roleInEducation: [], gradesWorking: [],
        subjectInterests: [], topicInterests: [], customContentInterest: false,
        howDidYouHear: '', additionalQuestions: ''
      });

    } catch (error: any) {
      console.error("Submission failed:", error);
      setSubmitMessage(error.message);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  interface TabButtonProps {
    tabName: string;
    label: string;
    icon: React.ElementType;
    isActive: boolean;
    onClick: () => void;
  }

  const TabButton: FC<TabButtonProps> = ({ tabName, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  interface EpisodeCardProps {
    episodeKey: string;
    episode: Episode;
    isActive: boolean;
    onClick: () => void;
  }

  const EpisodeCard: FC<EpisodeCardProps> = ({ episodeKey, episode, isActive, onClick }) => (
    <div className={`border rounded-lg transition-all cursor-pointer ${
      isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      <div className="p-4" onClick={onClick}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <PlayIcon className="w-6 h-6 text-blue-600" />
            <div>
              <h4 className="font-semibold text-gray-900">{episode.title}</h4>
              <p className="text-sm text-gray-600">{episode.subtitle}</p>
            </div>
          </div>
          {isActive ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </div>
      </div>
      
      {isActive && (
        <div className="border-t bg-gray-50 p-4">
          <p className="text-gray-700 mb-4">{episode.description}</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-2">
              <GlobeAltIcon className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-gray-900">Geography</h5>
                <p className="text-sm text-gray-600">{episode.subjects.geography}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <BookOpenIcon className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-gray-900">Social Studies</h5>
                <p className="text-sm text-gray-600">{episode.subjects.socialStudies}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <BanknotesIcon className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-gray-900">Economics</h5>
                <p className="text-sm text-gray-600">{episode.subjects.economics}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <PencilIcon className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-gray-900">ELA</h5>
                <p className="text-sm text-gray-600">{episode.subjects.ela}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Two Learning Formats Available:</strong> Choose distinct educational segments for focused subject instruction, or education naturally woven into narrative for integrated learning.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-6">
            <h1 className="text-5xl font-bold mb-4">Learn.WitUS.Online</h1>
            <div className="flex items-center justify-center space-x-4 text-blue-100 mb-6">
              <span className="text-lg">#LearnWitUS</span>
              <span>•</span>
              <span className="text-lg">#WitUS</span>
            </div>
          </div>
          <h2 className="text-3xl font-semibold mb-6">Revolutionary Cross-Curricular Education</h2>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto mb-8">
            Transform everyday student experiences into comprehensive lessons spanning Geography, Social Studies, Economics, and ELA. 
            Connect coffee shops to Ethiopian highlands, chocolate bars to Maya ceremonies, and tea breaks to Chinese traditions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setActiveTab('episodes')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Explore Curriculum
            </button>
            <button 
              onClick={() => setActiveTab('request')}
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Request Access
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <TabButton 
              tabName="overview" 
              label="Overview" 
              icon={BookOpenIcon}
              isActive={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')} 
            />
            <TabButton 
              tabName="episodes" 
              label="Episodes" 
              icon={PlayIcon}
              isActive={activeTab === 'episodes'} 
              onClick={() => setActiveTab('episodes')} 
            />
            <TabButton 
              tabName="subjects" 
              label="Subjects" 
              icon={GlobeAltIcon}
              isActive={activeTab === 'subjects'} 
              onClick={() => setActiveTab('subjects')} 
            />
            <TabButton 
              tabName="request" 
              label="Request Access" 
              icon={CheckCircleIcon}
              isActive={activeTab === 'request'} 
              onClick={() => setActiveTab('request')} 
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {activeTab === 'overview' && (
          <div className="space-y-12">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Journey Mapping Education</h3>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Students trace familiar products from global origins to their daily experiences, discovering how their morning latte connects to world geography, colonial history, fair trade economics, and cultural storytelling.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <GlobeAltIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Cross-Curricular Integration</h4>
                <p className="text-gray-600">Single episodes teach geography, social studies, economics, and ELA simultaneously, maximizing instructional time.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpenIcon className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Standards Aligned</h4>
                <p className="text-gray-600">Content meets Indiana Department of Education requirements for grades 9-12 across multiple subject areas.</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircleIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Ready-to-Use</h4>
                <p className="text-gray-600">Complete lesson plans, activities, and assessments reduce teacher prep time while maintaining academic rigor.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Developed by Experienced Educators</h4>
              <p className="text-gray-700 mb-4">
                Created by Anthony McDonald, substitute teacher across Hamilton Southeastern, Westfield Washington, and Michigan City school districts. 
                Identified through classroom experience: students naturally curious about global culture through daily products, but struggling to connect to academic content.
              </p>
              <p className="text-gray-700">
                Learn.WitUS.Online channels existing student engagement into rigorous academic learning while supporting teacher effectiveness through ready-to-use materials.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'episodes' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Documentary Episodes</h3>
              <p className="text-xl text-gray-600">Seven immersive episodes connecting global culture to academic learning</p>
            </div>

            <div className="space-y-4">
              {Object.entries(EpisodeData).map(([key, episode]) => (
                <EpisodeCard 
                  key={key}
                  episodeKey={key}
                  episode={episode}
                  isActive={activeEpisode === key}
                  onClick={() => setActiveEpisode(activeEpisode === key ? null : key)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'subjects' && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Subject Integration</h3>
              <p className="text-xl text-gray-600 mb-8">How each episode addresses multiple academic standards</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <GlobeAltIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Geography</h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Climate and agricultural zones</li>
                  <li>• Trade route mapping</li>
                  <li>• Cultural landscapes</li>
                  <li>• Human-environment interaction</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpenIcon className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Social Studies</h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Cultural ceremonies and traditions</li>
                  <li>• Colonial history and impact</li>
                  <li>• Indigenous knowledge systems</li>
                  <li>• Contemporary social justice</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <BanknotesIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">Economics</h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Fair trade vs conventional systems</li>
                  <li>• Global supply chain analysis</li>
                  <li>• Labor economics and rights</li>
                  <li>• Cooperative business models</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <PencilIcon className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">ELA</h4>
                <ul className="text-gray-600 space-y-2 text-sm">
                  <li>• Cultural storytelling techniques</li>
                  <li>• Interview and research skills</li>
                  <li>• Memoir and narrative writing</li>
                  <li>• Media literacy and analysis</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'request' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Request Curriculum Access</h3>
              <p className="text-xl text-gray-600">Get pilot access to Learn.WitUS.Online educational series</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
              {submitMessage && (
                <div className={`p-4 rounded-lg ${isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                  {submitMessage}
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Indiana"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Fishers"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Name *</label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School District</label>
                  <input
                    type="text"
                    name="schoolDistrict"
                    value={formData.schoolDistrict}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Hamilton Southeastern"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role in Education (select all that apply)</label>
                <div className="grid md:grid-cols-4 gap-2">
                  {['Teacher', 'Administrator', 'Curriculum Director', 'Principal', 'District Leadership', 'Media/Journalist', 'Parent/Guardian', 'Government Official'].map(role => (
                    <label key={role} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="roleInEducation"
                        value={role}
                        checked={formData.roleInEducation.includes(role)}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grades You Work With</label>
                <div className="grid grid-cols-7 gap-2">
                  {['6', '7', '8', '9', '10', '11', '12'].map(grade => (
                    <label key={grade} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="gradesWorking"
                        value={grade}
                        checked={formData.gradesWorking.includes(grade)}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{grade}th</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Interests</label>
                <div className="grid md:grid-cols-5 gap-2">
                  {['Geography', 'Social Studies', 'Economics', 'ELA', 'All Subjects'].map(subject => (
                    <label key={subject} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="subjectInterests"
                        value={subject}
                        checked={formData.subjectInterests.includes(subject)}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Episode Topics of Interest</label>
                <div className="grid md:grid-cols-4 gap-2">
                  {['Coffee', 'Tea', 'Chocolate', 'Sugar', 'Guayusa & Kola Nut', 'Kava', 'Personal Rituals', 'All Topics'].map(topic => (
                    <label key={topic} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="topicInterests"
                        value={topic}
                        checked={formData.topicInterests.includes(topic)}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{topic}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="customContentInterest"
                    checked={formData.customContentInterest}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Custom Content Creation</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Interested in custom Learn.WitUS.Online content featuring local cultural products, community businesses, or regional traditions specific to your area.
                    </p>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about Learn.WitUS.Online?</label>
                <select
                  name="howDidYouHear"
                  value={formData.howDidYouHear}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select one...</option>
                  <option value="Press Release">Press Release</option>
                  <option value="Educational Conference">Educational Conference</option>
                  <option value="Colleague Referral">Colleague Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Professional Development">Professional Development</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Questions or Comments</label>
                <textarea
                  name="additionalQuestions"
                  value={formData.additionalQuestions}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Let us know about your specific curriculum needs, implementation timeline, or other questions..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Request Curriculum Access'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnWitUSLandingV1;
"use client"

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { PlayCircleIcon, AcademicCapIcon, GlobeAltIcon, ChatBubbleLeftRightIcon, NewspaperIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface Episode {
  title: string;
  description: string;
  keyLearning: string;
  stats: string;
}

type EpisodeKey = 'coffee' | 'tea' | 'chocolate' | 'sugar';

type EpisodeMap = {
  [key in EpisodeKey]: Episode;
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  position: string;
  roleInEducation: string[];
  gradesWorking: string[];
  topicInterests: string[];
  primaryInterest: string;
  timeline: string;
  customContentInterest: boolean;
  mediaInquiry: boolean;
  additionalQuestions: string;
}

const LearnWitUSLandingV2 = () => {
  const [selectedEpisode, setSelectedEpisode] = useState<EpisodeKey>('coffee');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
    roleInEducation: [],
    gradesWorking: [],
    topicInterests: [],
    primaryInterest: '',
    timeline: '',
    customContentInterest: false,
    mediaInquiry: false,
    additionalQuestions: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const episodes: EpisodeMap = {
    coffee: {
      title: "Stories in Every Cup",
      description: "Coffee's global journey from Ethiopian highlands to student morning routines",
      keyLearning: "Trade routes, fair economics, cultural ceremonies, storytelling",
      stats: "Covers 4 subjects, 15+ countries, 1000+ years of history"
    },
    tea: {
      title: "The Way of Tea",
      description: "Chinese meditation traditions and colonial trade impact",
      keyLearning: "Agricultural zones, Buddhist practices, economic systems",
      stats: "Spans 3 continents, 8 cultural ceremonies, 2000+ years"
    },
    chocolate: {
      title: "The Food of the Gods",
      description: "Maya sacred traditions to modern bean-to-bar economics",
      keyLearning: "Rainforest ecosystems, colonization history, supply chains",
      stats: "20+ countries, indigenous rights, cooperative economics"
    },
    sugar: {
      title: "The Sweet Celebration",
      description: "Colonial plantation systems to community celebrations",
      keyLearning: "Atlantic trade, labor history, agricultural cooperatives",
      stats: "Global commodity markets, 400+ years of history"
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      const key = name as keyof FormData;

      if (['customContentInterest', 'mediaInquiry'].includes(name)) {
        setFormData(prev => ({ ...prev, [key]: checked }));
      } else if (['roleInEducation', 'gradesWorking', 'topicInterests'].includes(name)) {
        const listKey = key as 'roleInEducation' | 'gradesWorking' | 'topicInterests';
        const currentValues = formData[listKey];
        const newValues = checked
          ? [...currentValues, value]
          : currentValues.filter(item => item !== value);
        setFormData(prev => ({ ...prev, [listKey]: newValues }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.organization) {
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
          formType: 'learn-witus-v2'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'An error occurred.');
      }

      setSubmitMessage("Thank you! We'll connect with you soon with more information.");
      setIsError(false);
      setFormData({
        name: '', email: '', phone: '', organization: '', position: '',
        roleInEducation: [], gradesWorking: [], topicInterests: [],
        primaryInterest: '', timeline: '', customContentInterest: false, 
        mediaInquiry: false, additionalQuestions: ''
      });

    } catch (error: any) {
      console.error("Submission failed:", error.message);
      setSubmitMessage(error.message);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold">Learn.WitUS.Online</h1>
              <div className="hidden md:flex items-center space-x-4 text-blue-200">
                <span>#LearnWitUS</span>
                <span>•</span>
                <span>#WitUS</span>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="w-4 h-4" />
                <span>Media Inquiries Welcome</span>
              </div>
              <div className="flex items-center space-x-2">
                <PhoneIcon className="w-4 h-4" />
                <span>Partnership Opportunities</span>
              </div>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6 leading-tight">
                Revolutionary Education That Connects Global Culture to Academic Standards
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Students explore world geography, economics, social studies, and ELA through their daily experiences with coffee, chocolate, tea, and cultural products. Seven documentary episodes transform familiar products into comprehensive cross-curricular learning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('preview')?.scrollIntoView({behavior: 'smooth'})}
                  className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 hover:bg-blue-50 transition-colors"
                >
                  <PlayCircleIcon className="w-5 h-5" />
                  <span>Preview Content</span>
                </button>
                <button 
                  onClick={() => document.getElementById('connect')?.scrollIntoView({behavior: 'smooth'})}
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors"
                >
                  Request Information
                </button>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4">Impact Highlights</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200">4</div>
                  <div className="text-sm">Subjects Integrated</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200">7</div>
                  <div className="text-sm">Documentary Episodes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200">9-12</div>
                  <div className="text-sm">Grade Levels</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-200">2</div>
                  <div className="text-sm">Learning Formats</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Addressing Educational Challenges</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Developed by substitute teacher Anthony McDonald through experience across Hamilton County school districts
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AcademicCapIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Teacher Workload Reduction</h4>
              <p className="text-gray-600">Complete lesson plans for four subjects simultaneously. Ready-to-use activities and assessments reduce prep time by 60%.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <GlobeAltIcon className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Student Engagement</h4>
              <p className="text-gray-600">Connect familiar experiences to academic content. Students explore global culture through products they already know and use.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Standards Alignment</h4>
              <p className="text-gray-600">All content meets Indiana Department of Education requirements for grades 9-12 across geography, social studies, economics, and ELA.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div id="preview" className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Educational Content Preview</h3>
            <p className="text-xl text-gray-600">Select an episode to explore the curriculum approach</p>
          </div>
          
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-3">
                {Object.entries(episodes).map(([key, episode]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedEpisode(key as EpisodeKey)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      selectedEpisode === key 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md'
                    }`}
                  >
                    <h4 className="font-semibold mb-2">{episode.title}</h4>
                    <p className={`text-sm ${selectedEpisode === key ? 'text-blue-100' : 'text-gray-600'}`}>
                      {episode.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-3">
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <PlayCircleIcon className="w-8 h-8 text-blue-600" />
                  <h4 className="text-2xl font-bold text-gray-900">{episodes[selectedEpisode].title}</h4>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Episode Overview</h5>
                    <p className="text-gray-700">{episodes[selectedEpisode].description}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Key Learning Components</h5>
                    <p className="text-gray-700">{episodes[selectedEpisode].keyLearning}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Scope & Impact</h5>
                    <p className="text-gray-700">{episodes[selectedEpisode].stats}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-900 mb-2">Two Learning Formats Available</h5>
                    <div className="text-sm text-blue-800 space-y-2">
                      <div>• <strong>Distinct Educational Segments:</strong> Clear subject-specific sections for focused instruction</div>
                      <div>• <strong>Education Woven Naturally:</strong> Integrated learning within narrative flow</div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4 text-center">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-blue-600 font-semibold">Geography</div>
                      <div className="text-sm text-gray-600">Climate & Trade</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-green-600 font-semibold">Social Studies</div>
                      <div className="text-sm text-gray-600">Culture & History</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-purple-600 font-semibold">Economics</div>
                      <div className="text-sm text-gray-600">Trade & Labor</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-orange-600 font-semibold">ELA</div>
                      <div className="text-sm text-gray-600">Stories & Writing</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media and Partnership Section */}
      <div className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <NewspaperIcon className="w-8 h-8 text-blue-600" />
                <h3 className="text-3xl font-bold text-gray-900">Media & Partnership Opportunities</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">For Media Professionals</h4>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Innovative education stories connecting global culture to local learning</li>
                    <li>• Hamilton County educator addresses curriculum challenges through creativity</li>
                    <li>• Revolutionary approach to cross-curricular education implementation</li>
                    <li>• Student engagement through culturally relevant learning connections</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">Strategic Partnerships</h4>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Educational organization collaborations for teacher professional development</li>
                    <li>• University research partnerships on culturally relevant pedagogy</li>
                    <li>• School district pilot programs and implementation support</li>
                    <li>• Custom content development for regional cultural products</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">Implementation Support</h4>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Comprehensive teacher training and professional development</li>
                    <li>• Standards alignment documentation and assessment rubrics</li>
                    <li>• Pilot program coordination and outcome evaluation</li>
                    <li>• Community partnership development for local relevance</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">Priority Contact Areas</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <div className="font-semibold text-gray-900">Hamilton Southeastern Schools</div>
                    <div className="text-sm text-gray-600">Pilot implementation target district</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <span className="text-2xl">📰</span>
                  <div>
                    <div className="font-semibold text-gray-900">Education Media</div>
                    <div className="text-sm text-gray-600">Innovative curriculum story opportunities</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                  <span className="text-2xl">💬</span>
                  <div>
                    <div className="font-semibold text-gray-900">Educational Organizations</div>
                    <div className="text-sm text-gray-600">Professional development partnerships</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
                  <span className="text-2xl">🌍</span>
                  <div>
                    <div className="font-semibold text-gray-900">University Research</div>
                    <div className="text-sm text-gray-600">Academic validation and studies</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div id="connect" className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Connect with Learn.WitUS.Online</h3>
            <p className="text-xl text-gray-600">Media inquiries, partnership opportunities, and curriculum access requests</p>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-lg p-8">
            {submitMessage && (
              <div className={`p-4 rounded-lg mb-6 ${isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {submitMessage}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-6">
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
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization *</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="School, Media Outlet, etc."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position/Title</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Teacher, Reporter, etc."
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Interest</label>
              <div className="grid md:grid-cols-3 gap-4">
                {['Curriculum Access', 'Media Coverage', 'Partnership Opportunities', 'Research Collaboration', 'Professional Development', 'Custom Content'].map(interest => (
                  <label key={interest} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="primaryInterest"
                      value={interest}
                      checked={formData.primaryInterest === interest}
                      onChange={handleInputChange}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Role in Education (select all that apply)</label>
              <div className="grid md:grid-cols-4 gap-2">
                {['Teacher', 'Administrator', 'Media/Journalist', 'Researcher', 'Curriculum Director', 'District Leadership', 'Parent/Guardian', 'Government Official'].map(role => (
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
            
            {formData.roleInEducation.includes('Teacher') && (
              <div className="mb-6">
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
            )}
            
            <div className="mb-6">
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
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="mediaInquiry"
                    checked={formData.mediaInquiry}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Media Inquiry</span>
                    <p className="text-sm text-gray-600 mt-1">
                      I'm interested in covering this story or featuring Learn.WitUS.Online in media coverage.
                    </p>
                  </div>
                </label>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="customContentInterest"
                    checked={formData.customContentInterest}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500 mt-1"
                  />
                  <div>
                    <span className="font-medium text-gray-900">Custom Content</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Interested in Learn.WitUS.Online content featuring local cultural products or regional traditions.
                    </p>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Implementation Timeline</label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select timeline...</option>
                <option value="Immediate">Immediate (1-3 months)</option>
                <option value="Next Semester">Next Semester (4-6 months)</option>
                <option value="Next School Year">Next School Year (6-12 months)</option>
                <option value="Future Planning">Future Planning (12+ months)</option>
                <option value="Not Applicable">Not Applicable</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Questions or Comments</label>
              <textarea
                name="additionalQuestions"
                value={formData.additionalQuestions}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about your specific interests, story angles, partnership ideas, or implementation questions..."
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Connect with Learn.WitUS.Online'}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h4 className="text-2xl font-bold mb-4">Learn.WitUS.Online</h4>
          <p className="text-gray-300 mb-6">Revolutionary cross-curricular education connecting global culture to academic standards</p>
          <div className="flex items-center justify-center space-x-6 text-gray-400">
            <span>#LearnWitUS</span>
            <span>•</span>
            <span>#WitUS</span>
            <span>•</span>
            <span>Developed by Anthony McDonald</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnWitUSLandingV2;
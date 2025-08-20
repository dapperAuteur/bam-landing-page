/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { ChevronDown, ChevronUp, MessageCircle, X, Send, User, Stethoscope, GraduationCap } from 'lucide-react';

// Type definitions
type UserType = 'general' | 'student' | 'healthcare';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ModuleData {
  id: string;
  title: string;
  keyPoints: string[];
  expandedContent: {
    general: string;
    student: string;
    healthcare: string;
  };
  chartData?: any[];
  chartType?: 'line' | 'pie' | 'bar';
}

// interface ECSInfographicProps {
//   className?: string;
// }

// Sample data for ECS modules based on curriculum
const ecsModulesData: ModuleData[] = [
  {
    id: 'foundations',
    title: 'ECS Foundations',
    keyPoints: [
      'The ECS has 3 main parts: receptors (CB1 & CB2), endocannabinoids (anandamide & 2-AG), and enzymes',
      'CB1 receptors are mostly in the brain, CB2 receptors are mostly in immune tissues',
      'The ECS helps maintain balance (homeostasis) throughout your body'
    ],
    expandedContent: {
      general: 'The endocannabinoid system (ECS) was discovered in the 1990s. It works like a communication network in your body, helping different systems talk to each other and stay balanced.',
      student: 'The ECS consists of cannabinoid receptors (CB1 and CB2), endogenous cannabinoids (anandamide and 2-AG), and metabolic enzymes (FAAH, MAGL). This system uses retrograde signaling and on-demand activation.',
      healthcare: 'The ECS represents a complex neuromodulatory system with CB1 receptors primarily in CNS (hippocampus, cortex, cerebellum) and CB2 in peripheral immune tissues. Endocannabinoid tone varies significantly between individuals and clinical populations.'
    },
    chartData: [
      { name: 'CB1 Brain', value: 65 },
      { name: 'CB2 Immune', value: 25 },
      { name: 'Other Receptors', value: 10 }
    ],
    chartType: 'pie'
  },
  {
    id: 'wellness',
    title: 'ECS & Wellness',
    keyPoints: [
      'The ECS helps control pain, inflammation, stress, and sleep',
      'Exercise can boost your endocannabinoid levels naturally',
      'Good nutrition with omega-3 fats supports healthy ECS function'
    ],
    expandedContent: {
      general: 'Your ECS acts like a master controller for wellness. When it works well, you feel more balanced, sleep better, and handle stress more easily.',
      student: 'The ECS regulates homeostasis through multiple pathways: HPA axis modulation for stress, inflammatory regulation via CB2 receptors, and circadian rhythm coordination for sleep-wake cycles.',
      healthcare: 'Clinical Endocannabinoid Deficiency (CECD) theory suggests ECS dysfunction may contribute to conditions like fibromyalgia, migraine, and IBS. Moderate exercise increases circulating endocannabinoid levels, particularly anandamide.'
    },
    chartData: [
      { week: 'Baseline', anandamide: 2.1, exercise: 2.1 },
      { week: 'Week 2', anandamide: 2.3, exercise: 2.8 },
      { week: 'Week 4', anandamide: 2.5, exercise: 3.2 },
      { week: 'Week 6', anandamide: 2.4, exercise: 3.5 },
      { week: 'Week 8', anandamide: 2.6, exercise: 3.8 }
    ],
    chartType: 'line'
  },
  {
    id: 'cognition',
    title: 'ECS & Learning',
    keyPoints: [
      'The ECS is involved in memory formation and learning processes',
      'It helps with neuroplasticity - your brain\'s ability to change and adapt',
      'The ECS plays a role in attention and focus'
    ],
    expandedContent: {
      general: 'Your ECS helps your brain learn new things and remember important information while forgetting what you don\'t need. It\'s like having a smart filing system in your brain.',
      student: 'The ECS modulates synaptic plasticity through LTP and LTD mechanisms. It\'s directly involved in memory consolidation, extinction learning, and executive function via prefrontal cortex modulation.',
      healthcare: 'ECS dysfunction may contribute to cognitive disorders. CB1 receptors are highly expressed in hippocampus and cortex. Exercise-induced neuroplasticity is partially mediated through endocannabinoid signaling, particularly in adult neurogenesis.'
    },
    chartData: [
      { process: 'Memory Formation', involvement: 85 },
      { process: 'Learning', involvement: 78 },
      { process: 'Attention', involvement: 65 },
      { process: 'Executive Function', involvement: 72 }
    ],
    chartType: 'bar'
  },
  {
    id: 'longevity',
    title: 'ECS & Longevity',
    keyPoints: [
      'The ECS changes as we age, often becoming less effective',
      'It helps fight inflammation that contributes to aging',
      'Supporting your ECS may help with healthy aging'
    ],
    expandedContent: {
      general: 'As you get older, your ECS may not work as well. Taking care of it through good lifestyle choices might help you age more gracefully and stay healthier longer.',
      student: 'Age-related ECS changes include decreased receptor density, altered endocannabinoid production, and reduced enzymatic efficiency. The ECS combats "inflammaging" through CB2-mediated anti-inflammatory pathways.',
      healthcare: 'ECS decline correlates with increased inflammatory markers, neurodegeneration risk, and metabolic dysfunction. Therapeutic targeting of CB2 receptors shows promise for age-related diseases. Research indicates ECS modulation may influence longevity pathways including sirtuins and autophagy.'
    },
    chartData: [
      { age: '20-30', ecsFunction: 100 },
      { age: '30-40', ecsFunction: 95 },
      { age: '40-50', ecsFunction: 85 },
      { age: '50-60', ecsFunction: 75 },
      { age: '60-70', ecsFunction: 65 },
      { age: '70+', ecsFunction: 55 }
    ],
    chartType: 'line'
  },
  {
    id: 'applications',
    title: 'Practical Applications',
    keyPoints: [
      'Assess ECS function through symptoms and lifestyle factors',
      'Support ECS with exercise, nutrition, stress management, and sleep',
      'Different approaches work for different people'
    ],
    expandedContent: {
      general: 'You can support your ECS through simple daily choices: regular exercise, eating well, managing stress, and getting good sleep. Small changes can make a big difference.',
      student: 'ECS assessment involves comprehensive evaluation of sleep, stress, pain, mood, and inflammatory markers. Intervention protocols include targeted nutrition, specific exercise modalities, and botanical supports.',
      healthcare: 'Clinical applications require individualized assessment considering genetic variations, comorbidities, and medication interactions. Evidence-based protocols integrate lifestyle interventions with potential targeted therapies. Monitor outcomes through validated assessment tools and biomarkers where available.'
    },
    chartData: [
      { intervention: 'Exercise', effectiveness: 88 },
      { intervention: 'Nutrition', effectiveness: 75 },
      { intervention: 'Stress Management', effectiveness: 82 },
      { intervention: 'Sleep Optimization', effectiveness: 79 },
      { intervention: 'Botanical Support', effectiveness: 65 }
    ],
    chartType: 'bar'
  }
];

export default function ECSInfographic() {
  const [userType, setUserType] = useState<UserType>('general');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || !GEMINI_API_KEY) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + GEMINI_API_KEY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert on the Endocannabinoid System (ECS) helping ${userType === 'general' ? 'the general public' : userType === 'student' ? 'students' : 'healthcare professionals'} understand this important biological system. 

Context: The ECS consists of cannabinoid receptors (CB1 and CB2), endocannabinoids (anandamide and 2-AG), and metabolic enzymes. It regulates homeostasis, wellness, learning, and aging processes.

Please answer this question about the ECS: ${message}

Respond appropriately for a ${userType} audience with accurate, evidence-based information. Keep responses conversational but scientifically accurate.`
            }]
          }]
        })
      });

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process that request.';

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error processing your request. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderChart = (module: ModuleData) => {
    if (!module.chartData) return null;

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

    switch (module.chartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={module.chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({name, value}) => `${name}: ${value}%`}
              >
                {module.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={module.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              {Object.keys(module.chartData[0]).filter(key => key !== 'week' && key !== 'age').map((key, index) => (
                <Line 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stroke={colors[index]} 
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={module.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={Object.keys(module.chartData[0])[0]} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={Object.keys(module.chartData[0])[1]} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const getUserTypeIcon = (type: UserType) => {
    switch (type) {
      case 'general': return <User className="w-4 h-4" />;
      case 'student': return <GraduationCap className="w-4 h-4" />;
      case 'healthcare': return <Stethoscope className="w-4 h-4" />;
    }
  };

  const getUserTypeLabel = (type: UserType) => {
    switch (type) {
      case 'general': return 'General Public';
      case 'student': return 'Student';
      case 'healthcare': return 'Healthcare Professional';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          The Endocannabinoid System
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Your Body&apos;s Master Regulatory Network
        </p>
        
        {/* User Type Selector */}
        <div className="flex justify-center space-x-4 mb-6">
          {(['general', 'student', 'healthcare'] as UserType[]).map((type) => (
            <button
              key={type}
              onClick={() => setUserType(type)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                userType === type 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {getUserTypeIcon(type)}
              <span>{getUserTypeLabel(type)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-6">
        {ecsModulesData.map((module) => (
          <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition-colors"
            >
              <h2 className="text-xl font-semibold text-gray-800">{module.title}</h2>
              {expandedModules.has(module.id) ? 
                <ChevronUp className="w-5 h-5 text-gray-600" /> : 
                <ChevronDown className="w-5 h-5 text-gray-600" />
              }
            </button>
            
            {expandedModules.has(module.id) && (
              <div className="p-6 bg-white">
                {/* Key Points */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Key Points:</h3>
                  <ul className="space-y-2">
                    {module.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Expanded Content */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Learn More:</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700">{module.expandedContent[userType]}</p>
                  </div>
                </div>

                {/* Chart */}
                {module.chartData && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Data Visualization:</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {renderChart(module)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chat Button */}
      <button
        onClick={() => setShowChat(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md h-96 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Ask about the ECS</h3>
              <button 
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-gray-500 text-center">
                  Ask me anything about the endocannabinoid system!
                </div>
              )}
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    {message.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
                  placeholder="Type your question..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage(inputMessage)}
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// export default ECSInfographic;
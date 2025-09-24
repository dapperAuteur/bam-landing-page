"use client"

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Download, Play, BookOpen, Users, Settings, Home, PenTool, Eraser, RotateCcw } from 'lucide-react';

// Types
interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Episode {
  id: number;
  title: string;
  description: string;
}

// Main App Component
const CorvidEducationApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');

  const pages = {
    home: <HomePage setCurrentPage={setCurrentPage} />,
    identification: <CorvidIdentificationTool />,
    portfolio: <StudentPortfolio />,
    teacher: <TeacherPortal />
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="container mx-auto px-4 py-8">
        {pages[currentPage as keyof typeof pages]}
      </main>
    </div>
  );
};

// Navigation Component
const Navigation: React.FC<{ currentPage: string; setCurrentPage: (page: string) => void }> = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐦</span>
            <h1 className="text-xl font-bold text-blue-900">Corvids of Fishers</h1>
          </div>
          
          <div className="flex space-x-4">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'identification', label: 'Identify Birds', icon: BookOpen },
              { id: 'portfolio', label: 'My Portfolio', icon: Users },
              { id: 'teacher', label: 'Teacher Portal', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentPage(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === id
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-600 hover:bg-blue-100'
                }`}
              >
                <Icon size={18} />
                <span className="hidden md:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Home Page Component
const HomePage: React.FC<{ setCurrentPage: (page: string) => void }> = ({ setCurrentPage }) => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          🐦 Welcome to Corvids of Fishers
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Discover the intelligent birds living right in your community!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setCurrentPage('identification')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg"
          >
            Start Learning About Corvids
          </button>
          <button
            onClick={() => setCurrentPage('portfolio')}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg"
          >
            Open My Portfolio
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "American Crow",
            description: "All black, walks on ground, highly intelligent",
            emoji: "🐦‍⬛",
            facts: ["Can use tools", "Remembers faces", "Lives in family groups"]
          },
          {
            title: "Blue Jay",
            description: "Bright blue with crest, caches thousands of acorns",
            emoji: "🐦",
            facts: ["Mimics other birds", "Plants forests", "Very social"]
          },
          {
            title: "Common Grackle",
            description: "Iridescent black, forms large flocks",
            emoji: "🐦‍⬛",
            facts: ["City specialist", "Rainbow feathers", "Flexible diet"]
          }
        ].map((bird, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="text-6xl text-center mb-4">{bird.emoji}</div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">{bird.title}</h3>
            <p className="text-gray-600 mb-4">{bird.description}</p>
            <ul className="space-y-2">
              {bird.facts.map((fact, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <span className="text-green-500">•</span>
                  <span className="text-sm">{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

// Corvid Identification Tool Component
const CorvidIdentificationTool: React.FC = () => {
  const [selectedBird, setSelectedBird] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [quizComplete, setQuizComplete] = useState<boolean>(false);

  const quizQuestions: QuizQuestion[] = [
    {
      question: "Which corvid is completely black and walks on the ground?",
      options: ["Blue Jay", "American Crow", "Common Grackle", "Fish Crow"],
      correct: 1,
      explanation: "American Crows are all black and prefer to walk rather than hop!"
    },
    {
      question: "Which bird has a bright blue crest and caches acorns?",
      options: ["Common Grackle", "American Crow", "Blue Jay", "Magpie"],
      correct: 2,
      explanation: "Blue Jays are famous for their blue crests and storing thousands of acorns!"
    },
    {
      question: "Which corvid has a long tail and shiny, rainbow-colored feathers?",
      options: ["Common Grackle", "Blue Jay", "American Crow", "Raven"],
      correct: 0,
      explanation: "Common Grackles have iridescent feathers that shimmer with purple, green, and bronze!"
    }
  ];

  const corvids = [
    {
      id: 'crow',
      name: 'American Crow',
      emoji: '🐦‍⬛',
      features: [
        { icon: '📏', text: 'Size: 17-21 inches long' },
        { icon: '🎨', text: 'Color: All black' },
        { icon: '🔊', text: 'Sound: "Caw-caw-caw"' },
        { icon: '👣', text: 'Behavior: Walks on ground' },
        { icon: '🏠', text: 'Habitat: Parks, neighborhoods' }
      ]
    },
    {
      id: 'bluejay',
      name: 'Blue Jay',
      emoji: '🐦',
      features: [
        { icon: '📏', text: 'Size: 11-12 inches long' },
        { icon: '🎨', text: 'Color: Bright blue and white' },
        { icon: '🔊', text: 'Sound: "Jay-jay-jay"' },
        { icon: '👑', text: 'Feature: Blue crest on head' },
        { icon: '🌰', text: 'Behavior: Caches acorns' }
      ]
    },
    {
      id: 'grackle',
      name: 'Common Grackle',
      emoji: '🐦‍⬛',
      features: [
        { icon: '📏', text: 'Size: 11-13 inches long' },
        { icon: '🎨', text: 'Color: Black with rainbow shine' },
        { icon: '🔊', text: 'Sound: Harsh "chuck" calls' },
        { icon: '↗️', text: 'Feature: Long, wedge-shaped tail' },
        { icon: '👥', text: 'Behavior: Forms large flocks' }
      ]
    }
  ];

  const checkAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correct;
    if (isCorrect) setScore(score + 1);
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setQuizComplete(true);
      }
    }, 3000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          🐦 Corvid Identification Tool
        </h1>
        <p className="text-xl text-gray-600">
          Learn to identify the intelligent corvids of Fishers, Indiana!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {corvids.map((bird) => (
          <div
            key={bird.id}
            onClick={() => setSelectedBird(bird.id === selectedBird ? null : bird.id)}
            className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl ${
              selectedBird === bird.id ? 'ring-4 ring-blue-500 transform scale-105' : ''
            }`}
          >
            <div className="text-6xl text-center mb-4">{bird.emoji}</div>
            <h3 className="text-2xl font-bold text-blue-900 text-center mb-4">{bird.name}</h3>
            <ul className="space-y-3">
              {bird.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <span className="text-xl">{feature.icon}</span>
                  <span className="text-gray-700">{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-6">
          🧠 Test Your Corvid Knowledge!
        </h2>
        
        {!quizComplete ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </h3>
              <p className="text-xl font-medium mb-6">
                {quizQuestions[currentQuestion].question}
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedAnswer(index)}
                    disabled={showResult}
                    className={`p-4 rounded-xl border-2 transition-all font-medium ${
                      showResult
                        ? index === quizQuestions[currentQuestion].correct
                          ? 'bg-green-500 text-white border-green-600'
                          : index === selectedAnswer && index !== quizQuestions[currentQuestion].correct
                          ? 'bg-red-500 text-white border-red-600'
                          : 'bg-gray-200 text-gray-500 border-gray-300'
                        : selectedAnswer === index
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-white hover:bg-blue-50 border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              {!showResult && selectedAnswer !== null && (
                <button
                  onClick={checkAnswer}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all"
                >
                  Check Answer
                </button>
              )}
              
              {showResult && (
                <div className={`p-4 rounded-xl ${
                  selectedAnswer === quizQuestions[currentQuestion].correct
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-red-100 border-2 border-red-500'
                }`}>
                  <p className="font-bold text-lg mb-2">
                    {selectedAnswer === quizQuestions[currentQuestion].correct ? '✅ Correct!' : '❌ Incorrect'}
                  </p>
                  <p>{quizQuestions[currentQuestion].explanation}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">🎉 Quiz Complete!</h3>
            <p className="text-xl mb-6">
              You scored {score} out of {quizQuestions.length}!
            </p>
            <button
              onClick={resetQuiz}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Student Portfolio Component
const StudentPortfolio: React.FC = () => {
  const [studentInfo, setStudentInfo] = useState({
    name: '',
    teacher: '',
    school: '',
    startDate: ''
  });
  const [expandedSections, setExpandedSections] = useState<string[]>(['episodes']);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');

  const episodes: Episode[] = [
    { id: 1, title: "The Intelligence Network", description: "Crow communication and social structures" },
    { id: 2, title: "The Cache Master", description: "Blue Jay memory and planning abilities" },
    { id: 3, title: "The Imitator", description: "Blue Jay vocal abilities and mimicry" },
    { id: 4, title: "The Mob Rules", description: "Cooperative defense behaviors" },
    { id: 5, title: "The Urban Adapters", description: "City living adaptations" }
  ];

  const vocabulary = [
    { word: 'Corvid', definition: '' },
    { word: 'Intelligence', definition: '' },
    { word: 'Adaptation', definition: '' },
    { word: 'Conservation', definition: '' }
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const updateProgress = () => {
    const totalFields = 20;
    let filledFields = 0;
    
    // Count filled inputs (simplified for demo)
    if (studentInfo.name) filledFields++;
    if (studentInfo.teacher) filledFields++;
    if (studentInfo.school) filledFields++;
    if (studentInfo.startDate) filledFields++;
    
    const newProgress = Math.round((filledFields / totalFields) * 100);
    setProgress(newProgress);
  };

  useEffect(() => {
    updateProgress();
  }, [studentInfo]);

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineCap = 'round';
    ctx.lineWidth = currentTool === 'pen' ? 3 : 10;

    if (currentTool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#333';
    } else {
      ctx.globalCompositeOperation = 'destination-out';
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    if (!isDrawing || !canvasRef.current) return;
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) ctx.beginPath();
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const savePortfolio = () => {
    alert('Portfolio saved successfully! 🎉\n\nIn a real classroom, this would save your work for your teacher to review.');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          🐦 My Corvid Learning Portfolio
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Track your journey learning about the intelligent birds of Fishers!
        </p>
        
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <input
            type="text"
            placeholder="Student Name"
            value={studentInfo.name}
            onChange={(e) => setStudentInfo({...studentInfo, name: e.target.value})}
            className="p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Teacher"
            value={studentInfo.teacher}
            onChange={(e) => setStudentInfo({...studentInfo, teacher: e.target.value})}
            className="p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="School"
            value={studentInfo.school}
            onChange={(e) => setStudentInfo({...studentInfo, school: e.target.value})}
            className="p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
          />
          <input
            type="date"
            value={studentInfo.startDate}
            onChange={(e) => setStudentInfo({...studentInfo, startDate: e.target.value})}
            className="p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
          />
        </div>

        <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-500 flex items-center justify-center text-white font-bold text-sm"
            style={{ width: `${progress}%` }}
          >
            {progress}% Complete
          </div>
        </div>
      </div>

      {/* Episode Reflections Section */}
      <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
        <button
          onClick={() => toggleSection('episodes')}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-left flex items-center justify-between text-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          Episode Reflections
          {expandedSections.includes('episodes') ? <ChevronDown /> : <ChevronRight />}
        </button>
        
        {expandedSections.includes('episodes') && (
          <div className="p-6">
            <div className="space-y-6">
              {episodes.map((episode) => (
                <div key={episode.id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-blue-900">
                      Episode {episode.id}: {episode.title}
                    </h3>
                    <input type="date" className="p-2 border rounded-lg" />
                  </div>
                  <p className="text-gray-600 mb-4">{episode.description}</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block font-medium mb-2">What did you learn from this episode?</label>
                      <textarea
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                        rows={3}
                        placeholder="Write your reflection here..."
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">What questions do you have?</label>
                      <textarea
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                        rows={2}
                        placeholder="Write your questions here..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Vocabulary Section */}
      <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
        <button
          onClick={() => toggleSection('vocabulary')}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-left flex items-center justify-between text-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          Vocabulary Learning
          {expandedSections.includes('vocabulary') ? <ChevronDown /> : <ChevronRight />}
        </button>
        
        {expandedSections.includes('vocabulary') && (
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {vocabulary.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-purple-800 mb-4">{item.word}</h3>
                  <div className="mb-4">
                    <label className="block font-medium mb-2">What it means:</label>
                    <input
                      type="text"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                      placeholder="Write your definition"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Drawing Section */}
      <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
        <button
          onClick={() => toggleSection('observations')}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-left flex items-center justify-between text-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          My Observations
          {expandedSections.includes('observations') ? <ChevronDown /> : <ChevronRight />}
        </button>
        
        {expandedSections.includes('observations') && (
          <div className="p-6">
            <div className="mb-6">
              <label className="block font-bold text-lg mb-4">
                Draw the most interesting corvid behavior you observed:
              </label>
              
              <div className="flex justify-center space-x-4 mb-4">
                <button
                  onClick={() => setCurrentTool('pen')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    currentTool === 'pen' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <PenTool size={18} />
                  <span>Pen</span>
                </button>
                <button
                  onClick={() => setCurrentTool('eraser')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    currentTool === 'eraser' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <Eraser size={18} />
                  <span>Eraser</span>
                </button>
                <button
                  onClick={clearCanvas}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  <RotateCcw size={18} />
                  <span>Clear</span>
                </button>
              </div>
              
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="border-2 border-dashed border-gray-300 rounded-lg bg-white cursor-crosshair mx-auto block"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>
            
            <div>
              <label className="block font-medium mb-2">
                Describe what you drew and why it was interesting:
              </label>
              <textarea
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                rows={4}
                placeholder="Write about your drawing here..."
              />
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={savePortfolio}
          className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-green-700 transition-all shadow-lg"
        >
          💾 Save My Portfolio
        </button>
      </div>
    </div>
  );
};

// Teacher Portal Component
const TeacherPortal: React.FC = () => {
  const [selectedModal, setSelectedModal] = useState<string | null>(null);

  const dashboardCards = [
    {
      id: 'lesson-plans',
      title: 'Lesson Plans',
      icon: '📚',
      description: 'Complete, detailed lesson plans for all 10 episodes with timing, materials, and differentiation strategies.',
      actions: ['View All Plans', 'Download PDF']
    },
    {
      id: 'student-materials',
      title: 'Student Materials',
      icon: '📝',
      description: 'Recording sheets, observation journals, activity handouts, and assessment forms ready to print.',
      actions: ['Browse Materials', 'Print Package']
    },
    {
      id: 'episodes',
      title: 'Documentary Episodes',
      icon: '🎬',
      description: 'High-quality corvid documentaries with teacher viewing guides and discussion prompts.',
      actions: ['Watch Episodes', 'Viewing Guides']
    },
    {
      id: 'assessment',
      title: 'Assessment Tools',
      icon: '📊',
      description: 'Rubrics, portfolio guidelines, self-assessment forms, and progress tracking sheets.',
      actions: ['View Rubrics', 'Track Progress']
    },
    {
      id: 'tech-setup',
      title: 'Technology Setup',
      icon: '💻',
      description: 'Step-by-step guides for eBird, iNaturalist, and digital tools integration.',
      actions: ['Setup Guides', 'Troubleshooting']
    },
    {
      id: 'materials-sourcing',
      title: 'Materials Sourcing',
      icon: '🛒',
      description: 'Vendor lists, pricing guides, budget planning tools, and DIY alternatives.',
      actions: ['Shopping Lists', 'Budget Planner']
    }
  ];

  const timelineWeeks = [
    {
      number: 1,
      title: 'Foundation Building',
      activities: 'Episodes 1-2: Intelligence Network, Cache Master + Acorn Hunt Activity',
      status: 'ready'
    },
    {
      number: 2,
      title: 'Behavior Studies',
      activities: 'Episodes 3-4: Imitator, Mob Rules + Sound Detective Game',
      status: 'prep'
    },
    {
      number: 3,
      title: 'Adaptation Focus',
      activities: 'Episodes 5-6: Urban Adapters, Generational Memory + Family Interviews',
      status: 'ready'
    },
    {
      number: 4,
      title: 'Intelligence Lab',
      activities: 'Episodes 7-8: Tool Users, Weather Prophets + Problem-Solving Stations',
      status: 'prep'
    },
    {
      number: 5,
      title: 'Conservation & Future',
      activities: 'Episodes 9-10: Night Shift, Future Flock + Action Planning',
      status: 'ready'
    },
    {
      number: 6,
      title: 'Assessment & Sharing',
      activities: 'Portfolio completion, presentations, family showcase',
      status: 'optional'
    }
  ];

  const quickLinks = [
    'Implementation Checklist',
    'Troubleshooting FAQ',
    'Family Resources',
    'Community Partners',
    'Support Contact',
    'Standards Alignment'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-500';
      case 'prep': return 'bg-yellow-500';
      case 'optional': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDownload = (item: string) => {
    alert(`📥 Download started! ${item} will open in new tab.`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">
          🎓 Corvids of Fishers Teacher Portal
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Your complete resource center for implementing the curriculum
        </p>
        
        <div className="bg-blue-50 rounded-2xl p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-bold text-blue-800 mb-2">👋 Welcome, Educator!</h3>
          <p className="text-blue-700">
            This portal contains everything you need to successfully implement the Corvids of Fishers curriculum. 
            Click on any card below to access resources, download materials, or get implementation guidance.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {dashboardCards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer hover:transform hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">{card.icon}</div>
              <h3 className="text-xl font-bold text-blue-900">{card.title}</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">{card.description}</p>
            <div className="flex flex-wrap gap-2">
              {card.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleDownload(`${card.title} - ${action}`)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    index === 0 
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-blue-900 text-center mb-8">
          📅 Implementation Timeline
        </h2>
        
        <div className="space-y-4">
          {timelineWeeks.map((week) => (
            <div key={week.number} className="flex items-center bg-gray-50 rounded-xl p-6">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-6">
                {week.number}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-blue-900 text-lg mb-1">{week.title}</h3>
                <p className="text-gray-600">{week.activities}</p>
              </div>
              <div className={`w-4 h-4 rounded-full ${getStatusColor(week.status)}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-blue-900 text-center mb-6">🔗 Quick Access Links</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {quickLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => handleDownload(link)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all hover:transform hover:scale-105"
            >
              {link}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CorvidEducationApp;
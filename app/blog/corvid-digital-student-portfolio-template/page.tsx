"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, ChevronRight, Save, Download, PenTool, Eraser, RotateCcw, Star, Calendar, BookOpen, Palette, Target } from 'lucide-react';

// Types
interface StudentInfo {
  name: string;
  teacher: string;
  school: string;
  grade: string;
  startDate: string;
}

interface EpisodeReflection {
  id: number;
  title: string;
  date: string;
  learning: string;
  questions: string;
  completed: boolean;
}

interface VocabularyWord {
  word: string;
  definition: string;
  example: string;
}

interface SelfAssessment {
  topic: string;
  rating: number;
}

interface PortfolioData {
  studentInfo: StudentInfo;
  episodes: EpisodeReflection[];
  vocabulary: VocabularyWord[];
  observations: string;
  canvasData: string;
  selfAssessment: SelfAssessment[];
  progress: number;
}

// Main Portfolio App Component
const CorvidPortfolioApp: React.FC = () => {
  // State management
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    studentInfo: { name: '', teacher: '', school: '', grade: '', startDate: '' },
    episodes: [],
    vocabulary: [],
    observations: '',
    canvasData: '',
    selfAssessment: [],
    progress: 0
  });

  const [expandedSections, setExpandedSections] = useState<string[]>(['info']);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser'>('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Episodes data
  const episodes = [
    { id: 1, title: "The Intelligence Network", description: "Crow communication and social structures" },
    { id: 2, title: "The Cache Master", description: "Blue Jay memory and planning abilities" },
    { id: 3, title: "The Imitator", description: "Blue Jay vocal abilities and mimicry" },
    { id: 4, title: "The Mob Rules", description: "Cooperative defense behaviors" },
    { id: 5, title: "The Urban Adapters", description: "City living adaptations" },
    { id: 6, title: "The Generational Memory", description: "Family knowledge transfer" },
    { id: 7, title: "The Tool Users", description: "Problem-solving and innovation" },
    { id: 8, title: "The Weather Prophets", description: "Natural prediction abilities" },
    { id: 9, title: "The Night Shift", description: "Fish Crow specialized behaviors" },
    { id: 10, title: "The Future Flock", description: "Conservation and coexistence" }
  ];

  // Vocabulary words
  const vocabularyList = [
    { word: 'Corvid', definition: '', example: '' },
    { word: 'Intelligence', definition: '', example: '' },
    { word: 'Communication', definition: '', example: '' },
    { word: 'Territory', definition: '', example: '' },
    { word: 'Cache', definition: '', example: '' },
    { word: 'Habitat', definition: '', example: '' },
    { word: 'Adaptation', definition: '', example: '' },
    { word: 'Ecosystem', definition: '', example: '' },
    { word: 'Conservation', definition: '', example: '' },
    { word: 'Migration', definition: '', example: '' }
  ];

  // Self-assessment topics
  const assessmentTopics = [
    'I can identify different corvids',
    'I understand corvid intelligence',
    'I know how corvids adapt to cities',
    'I can help wildlife in my community',
    'I enjoyed learning about corvids'
  ];

  // Initialize portfolio data
  useEffect(() => {
    const savedData = localStorage.getItem('corvidPortfolio');
    if (savedData) {
      setPortfolioData(JSON.parse(savedData));
    } else {
      // Initialize with default data
      setPortfolioData(prev => ({
        ...prev,
        episodes: episodes.map(ep => ({
          id: ep.id,
          title: ep.title,
          date: '',
          learning: '',
          questions: '',
          completed: false
        })),
        vocabulary: vocabularyList,
        selfAssessment: assessmentTopics.map(topic => ({ topic, rating: 0 }))
      }));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('corvidPortfolio', JSON.stringify(portfolioData));
    updateProgress();
  }, [portfolioData]);

  // Progress calculation
  const updateProgress = useCallback(() => {
    let completed = 0;
    let total = 0;

    // Student info (5 fields)
    total += 5;
    Object.values(portfolioData.studentInfo).forEach(value => {
      if (value.trim()) completed++;
    });

    // Episodes (20 fields - 2 per episode)
    total += 20;
    portfolioData.episodes.forEach(episode => {
      if (episode.learning.trim()) completed++;
      if (episode.questions.trim()) completed++;
    });

    // Vocabulary (20 fields - 2 per word)
    total += 20;
    portfolioData.vocabulary.forEach(word => {
      if (word.definition.trim()) completed++;
      if (word.example.trim()) completed++;
    });

    // Observations (1 field)
    total += 1;
    if (portfolioData.observations.trim()) completed++;

    // Self-assessment (5 fields)
    total += 5;
    portfolioData.selfAssessment.forEach(assessment => {
      if (assessment.rating > 0) completed++;
    });

    const progress = Math.round((completed / total) * 100);
    setPortfolioData(prev => ({ ...prev, progress }));
  }, [portfolioData.studentInfo, portfolioData.episodes, portfolioData.vocabulary, portfolioData.observations, portfolioData.selfAssessment]);

  // Section toggle
  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Student info updates
  const updateStudentInfo = (field: keyof StudentInfo, value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      studentInfo: { ...prev.studentInfo, [field]: value }
    }));
  };

  // Episode updates
  const updateEpisode = (id: number, field: 'date' | 'learning' | 'questions', value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      episodes: prev.episodes.map(ep => 
        ep.id === id 
          ? { ...ep, [field]: value, completed: field === 'learning' && value.trim() !== '' }
          : ep
      )
    }));
  };

  // Vocabulary updates
  const updateVocabulary = (index: number, field: 'definition' | 'example', value: string) => {
    setPortfolioData(prev => ({
      ...prev,
      vocabulary: prev.vocabulary.map((word, i) => 
        i === index ? { ...word, [field]: value } : word
      )
    }));
  };

  // Self-assessment updates
  const updateSelfAssessment = (index: number, rating: number) => {
    setPortfolioData(prev => ({
      ...prev,
      selfAssessment: prev.selfAssessment.map((assessment, i) => 
        i === index ? { ...assessment, rating } : assessment
      )
    }));
  };

  // Canvas drawing functions
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  }, [currentTool]);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineCap = 'round';
    ctx.lineWidth = currentTool === 'pen' ? 3 : 15;

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
  }, [isDrawing, currentTool]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing || !canvasRef.current) return;
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      // Save canvas data
      setPortfolioData(prev => ({
        ...prev,
        canvasData: canvasRef.current?.toDataURL() || ''
      }));
    }
  }, [isDrawing]);

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setPortfolioData(prev => ({ ...prev, canvasData: '' }));
    }
  };

  // Save and export functions
  const savePortfolio = () => {
    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${portfolioData.studentInfo.name || 'Student'}_Corvid_Portfolio.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateReport = () => {
    const completed = portfolioData.episodes.filter(ep => ep.completed).length;
    const vocabCompleted = portfolioData.vocabulary.filter(word => word.definition.trim()).length;
    
    alert(`Portfolio Summary for ${portfolioData.studentInfo.name}:
    
✅ Episodes Completed: ${completed}/10
✅ Vocabulary Words Learned: ${vocabCompleted}/10  
✅ Overall Progress: ${portfolioData.progress}%
✅ Observations Recorded: ${portfolioData.observations ? 'Yes' : 'No'}

Great work learning about corvids! 🐦`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">🐦</div>
              <div>
                <h1 className="text-3xl font-bold text-blue-900">My Corvid Learning Portfolio</h1>
                <p className="text-gray-600">Track your journey learning about Fishers' intelligent birds</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{portfolioData.progress}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
              <div className="w-24 h-24">
                <div className="relative w-24 h-24">
                  <svg className="transform -rotate-90 w-24 h-24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                      fill="transparent"
                      className="scale-[4] origin-center"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#10b981"
                      strokeWidth="2"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 10}`}
                      strokeDashoffset={`${2 * Math.PI * 10 * (1 - portfolioData.progress / 100)}`}
                      className="scale-[4] origin-center transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Student Information Section */}
        <div className="bg-white rounded-3xl shadow-xl mb-8 overflow-hidden">
          <button
            onClick={() => toggleSection('info')}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between text-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6" />
              <span>Student Information</span>
            </div>
            {expandedSections.includes('info') ? <ChevronDown /> : <ChevronRight />}
          </button>
          
          {expandedSections.includes('info') && (
            <div className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Student Name</label>
                  <input
                    type="text"
                    value={portfolioData.studentInfo.name}
                    onChange={(e) => updateStudentInfo('name', e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Teacher Name</label>
                  <input
                    type="text"
                    value={portfolioData.studentInfo.teacher}
                    onChange={(e) => updateStudentInfo('teacher', e.target.value)}
                    placeholder="Your teacher's name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">School Name</label>
                  <input
                    type="text"
                    value={portfolioData.studentInfo.school}
                    onChange={(e) => updateStudentInfo('school', e.target.value)}
                    placeholder="Your school"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Grade</label>
                  <select
                    value={portfolioData.studentInfo.grade}
                    onChange={(e) => updateStudentInfo('grade', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    <option value="">Select grade</option>
                    <option value="K">Kindergarten</option>
                    <option value="1">1st Grade</option>
                    <option value="2">2nd Grade</option>
                    <option value="3">3rd Grade</option>
                    <option value="4">4th Grade</option>
                    <option value="5">5th Grade</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Started Learning</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={portfolioData.studentInfo.startDate}
                      onChange={(e) => updateStudentInfo('startDate', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Episode Reflections Section */}
        <div className="bg-white rounded-3xl shadow-xl mb-8 overflow-hidden">
          <button
            onClick={() => toggleSection('episodes')}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 flex items-center justify-between text-xl font-bold hover:from-purple-700 hover:to-purple-800 transition-all"
          >
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6" />
              <span>Episode Reflections</span>
            </div>
            {expandedSections.includes('episodes') ? <ChevronDown /> : <ChevronRight />}
          </button>
          
          {expandedSections.includes('episodes') && (
            <div className="p-8">
              <div className="space-y-6">
                {portfolioData.episodes.map((episode) => (
                  <div key={episode.id} className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-purple-900">
                          Episode {episode.id}: {episode.title}
                        </h3>
                        <p className="text-gray-600">
                          {episodes.find(ep => ep.id === episode.id)?.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={episode.date}
                          onChange={(e) => updateEpisode(episode.id, 'date', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block font-semibold text-gray-700">
                          What did you learn from this episode?
                        </label>
                        <textarea
                          value={episode.learning}
                          onChange={(e) => updateEpisode(episode.id, 'learning', e.target.value)}
                          placeholder="Write about what you discovered..."
                          rows={4}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block font-semibold text-gray-700">
                          What questions do you have?
                        </label>
                        <textarea
                          value={episode.questions}
                          onChange={(e) => updateEpisode(episode.id, 'questions', e.target.value)}
                          placeholder="What do you want to know more about?"
                          rows={4}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none"
                        />
                      </div>
                    </div>
                    
                    {episode.completed && (
                      <div className="mt-4 flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vocabulary Section */}
        <div className="bg-white rounded-3xl shadow-xl mb-8 overflow-hidden">
          <button
            onClick={() => toggleSection('vocabulary')}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex items-center justify-between text-xl font-bold hover:from-green-700 hover:to-green-800 transition-all"
          >
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6" />
              <span>Vocabulary Learning</span>
            </div>
            {expandedSections.includes('vocabulary') ? <ChevronDown /> : <ChevronRight />}
          </button>
          
          {expandedSections.includes('vocabulary') && (
            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {portfolioData.vocabulary.map((word, index) => (
                  <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-l-4 border-green-500">
                    <h3 className="text-2xl font-bold text-green-800 mb-4">{word.word}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-2">What it means:</label>
                        <input
                          type="text"
                          value={word.definition}
                          onChange={(e) => updateVocabulary(index, 'definition', e.target.value)}
                          placeholder="Write your definition..."
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block font-semibold text-gray-700 mb-2">Example or drawing:</label>
                        <input
                          type="text"
                          value={word.example}
                          onChange={(e) => updateVocabulary(index, 'example', e.target.value)}
                          placeholder="Give an example or describe your drawing..."
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawing Section */}
        <div className="bg-white rounded-3xl shadow-xl mb-8 overflow-hidden">
          <button
            onClick={() => toggleSection('drawing')}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 flex items-center justify-between text-xl font-bold hover:from-orange-700 hover:to-orange-800 transition-all"
          >
            <div className="flex items-center space-x-3">
              <Palette className="w-6 h-6" />
              <span>My Observations</span>
            </div>
            {expandedSections.includes('drawing') ? <ChevronDown /> : <ChevronRight />}
          </button>
          
          {expandedSections.includes('drawing') && (
            <div className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-4">
                    Draw the most interesting corvid behavior you observed:
                  </label>
                  
                  <div className="flex justify-center space-x-4 mb-6">
                    <button
                      onClick={() => setCurrentTool('pen')}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                        currentTool === 'pen' 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <PenTool size={20} />
                      <span>Draw</span>
                    </button>
                    
                    <button
                      onClick={() => setCurrentTool('eraser')}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                        currentTool === 'eraser' 
                          ? 'bg-blue-600 text-white shadow-lg' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Eraser size={20} />
                      <span>Erase</span>
                    </button>
                    
                    <button
                      onClick={clearCanvas}
                      className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all shadow-lg"
                    >
                      <RotateCcw size={20} />
                      <span>Clear All</span>
                    </button>
                  </div>
                  
                  <div className="flex justify-center">
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={400}
                      className="border-2 border-dashed border-gray-300 rounded-2xl bg-white cursor-crosshair shadow-inner"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-3">
                    Describe what you drew and why it was interesting:
                  </label>
                  <textarea
                    value={portfolioData.observations}
                    onChange={(e) => setPortfolioData(prev => ({ ...prev, observations: e.target.value }))}
                    placeholder="Tell about your drawing and what made the corvid behavior special..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Self-Assessment Section */}
        <div className="bg-white rounded-3xl shadow-xl mb-8 overflow-hidden">
          <button
            onClick={() => toggleSection('assessment')}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 flex items-center justify-between text-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <div className="flex items-center space-x-3">
              <Star className="w-6 h-6" />
              <span>How Am I Doing?</span>
            </div>
            {expandedSections.includes('assessment') ? <ChevronDown /> : <ChevronRight />}
          </button>
          
          {expandedSections.includes('assessment') && (
            <div className="p-8">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-6 text-center">
                  Rate how well you understand each topic:
                </h3>
                
                <div className="space-y-6">
                  {portfolioData.selfAssessment.map((assessment, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium text-gray-800">
                          {assessment.topic}
                        </span>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => updateSelfAssessment(index, rating)}
                              className="transition-all duration-200"
                            >
                              <Star
                                size={28}
                                className={`${
                                  rating <= assessment.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                } hover:text-yellow-300 hover:scale-110`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center text-sm text-gray-600">
                  ⭐ = Still learning  ⭐⭐⭐ = Getting better  ⭐⭐⭐⭐⭐ = I've got this!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={savePortfolio}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Download size={24} />
            <span>Save My Portfolio</span>
          </button>
          
          <button
            onClick={generateReport}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Save size={24} />
            <span>View Summary</span>
          </button>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-white rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-2">🎉 Great Job Learning About Corvids!</h3>
          <p className="text-gray-600">
            You're becoming a corvid expert! Keep observing these amazing birds in Fishers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CorvidPortfolioApp;
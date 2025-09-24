"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, RotateCcw, BookOpen, Volume2, Eye, Award, Settings } from 'lucide-react';

// Story data from the Excel file
const storyData = [
  {
    id: 1,
    englishMeaning: "to help",
    spanishVerb: "ayudar",
    frenchTranslation: "aider",
    italianTranslation: "aiutare",
    portugueseTranslation: "ajudar",
    spanishSentence: "Curb Appeall ayuda a Platypus a preparar un picnic saludable.",
    englishSentence: "Curb Appeall helps Platypus prepare a healthy picnic.",
    frenchSentence: "Curb Appeall aide Platypus à préparer un pique-nique.",
    italianSentence: "Curb Appeall aiuta Platypus a preparare un picnic.",
    portugueseSentence: "Curb Appeall ajuda o Platypus a preparar um piquenique."
  },
  {
    id: 2,
    englishMeaning: "to study",
    spanishVerb: "estudiar",
    frenchTranslation: "étudier",
    italianTranslation: "studiare",
    portugueseTranslation: "estudar",
    spanishSentence: "Curb y sus amigos decidieron estudiar nutrición para entender mejor sus alimentos favoritos.",
    englishSentence: "Curb and his friends decided to study nutrition to better understand their favorite foods.",
    frenchSentence: "Curb et ses amis ont décidé d'étudier la nutrition pour mieux comprendre leurs aliments préférés.",
    italianSentence: "Curb e i suoi amici hanno deciso di studiare la nutrizione per capire meglio i loro cibi preferiti.",
    portugueseSentence: "Curb e seus amigos decidiram estudar nutrição para entender melhor seus alimentos favoritos."
  },
  {
    id: 3,
    englishMeaning: "to teach",
    spanishVerb: "enseñar",
    frenchTranslation: "enseigner",
    italianTranslation: "insegnare",
    portugueseTranslation: "ensinar",
    spanishSentence: "El canguro enseñó a los demás a preparar un batido saludable con frutas y verduras.",
    englishSentence: "The kangaroo taught the others how to make a healthy smoothie with fruits and vegetables.",
    frenchSentence: "Le kangourou a appris aux autres à préparer un smoothie sain avec des fruits et des légumes.",
    italianSentence: "Il canguro ha insegnato agli altri come preparare un frullato sano con frutta e verdura.",
    portugueseSentence: "O canguru ensinou os outros a fazer um smoothie saudável com frutas e vegetais."
  },
  {
    id: 4,
    englishMeaning: "to enjoy",
    spanishVerb: "disfrutar",
    frenchTranslation: "profiter de",
    italianTranslation: "godere",
    portugueseTranslation: "aproveitar",
    spanishSentence: "Todos disfrutaron el batido mientras discutían formas de ahorrar dinero en alimentos saludables.",
    englishSentence: "Everyone enjoyed the smoothie while discussing ways to save money on healthy food.",
    frenchSentence: "Tout le monde a profité du smoothie tout en discutant des moyens d'économiser de l'argent sur la nourriture saine.",
    italianSentence: "Tutti hanno goduto del frullato mentre discutevano modi per risparmiare denaro sugli alimenti sani.",
    portugueseSentence: "Todos aproveitaram o smoothie enquanto discutiam maneiras de economizar dinheiro em alimentos saudáveis."
  },
  {
    id: 5,
    englishMeaning: "to work",
    spanishVerb: "trabajar",
    frenchTranslation: "travailler",
    italianTranslation: "lavorare",
    portugueseTranslation: "trabalhar",
    spanishSentence: "Decidieron trabajar juntos en un jardín comunitario para cultivar alimentos frescos.",
    englishSentence: "They decided to work together in a community garden to grow fresh food.",
    frenchSentence: "Ils ont décidé de travailler ensemble dans un jardin communautaire pour cultiver des aliments frais.",
    italianSentence: "Hanno deciso di lavorare insieme in un giardino comunitario per coltivare cibo fresco.",
    portugueseSentence: "Decidiram trabalhar juntos em um jardim comunitário para cultivar alimentos frescos."
  }
];

type LearningMode = 'flashcards' | 'practice' | 'quiz' | 'story';
type Language = 'english' | 'spanish' | 'french' | 'italian' | 'portuguese';

interface UserProgress {
  currentCard: number;
  correctAnswers: number;
  totalAttempts: number;
  studiedCards: Set<number>;
}

function SignLanguageLearningApp() {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [learningMode, setLearningMode] = useState<LearningMode>('flashcards');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english');
  const [progress, setProgress] = useState<UserProgress>({
    currentCard: 0,
    correctAnswers: 0,
    totalAttempts: 0,
    studiedCards: new Set()
  });
  const [isPlaying, setIsPlaying] = useState(false);

  const currentStoryItem = storyData[currentCard];

  // Simulate sign language video playback
  const playSignLanguageDemo = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const nextCard = () => {
    if (currentCard < storyData.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
      setProgress(prev => ({
        ...prev,
        currentCard: currentCard + 1,
        studiedCards: new Set([...Array.from(prev.studiedCards), currentCard])
      }));
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setShowAnswer(false);
    }
  };

  const resetProgress = () => {
    setCurrentCard(0);
    setShowAnswer(false);
    setProgress({
      currentCard: 0,
      correctAnswers: 0,
      totalAttempts: 0,
      studiedCards: new Set()
    });
  };

  const getLanguageText = (item: typeof currentStoryItem, lang: Language, type: 'verb' | 'sentence') => {
    if (type === 'verb') {
      switch (lang) {
        case 'english': return item.englishMeaning;
        case 'spanish': return item.spanishVerb;
        case 'french': return item.frenchTranslation;
        case 'italian': return item.italianTranslation;
        case 'portuguese': return item.portugueseTranslation;
        default: return item.englishMeaning;
      }
    } else {
      switch (lang) {
        case 'english': return item.englishSentence;
        case 'spanish': return item.spanishSentence;
        case 'french': return item.frenchSentence;
        case 'italian': return item.italianSentence;
        case 'portuguese': return item.portugueseSentence;
        default: return item.englishSentence;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <BookOpen className="mr-3 text-blue-600" />
              Sign Language Story Learning
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Progress: {progress.studiedCards.size}/{storyData.length} cards
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.studiedCards.size / storyData.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="flex space-x-2 mb-4">
            {['flashcards', 'practice', 'quiz', 'story'].map((mode) => (
              <button
                key={mode}
                onClick={() => setLearningMode(mode as LearningMode)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  learningMode === mode 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Language Selection */}
          <div className="flex space-x-2">
            {['english', 'spanish', 'french', 'italian', 'portuguese'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang as Language)}
                className={`px-3 py-1 text-sm rounded capitalize ${
                  selectedLanguage === lang 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Card Display */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Card Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Card {currentCard + 1} of {storyData.length}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={playSignLanguageDemo}
                  disabled={isPlaying}
                  className={`p-2 rounded ${
                    isPlaying 
                      ? 'bg-blue-700 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-400'
                  } transition-colors`}
                  title="Play Sign Language Demo"
                >
                  <Play className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="p-2 bg-blue-500 hover:bg-blue-400 rounded transition-colors"
                  title="Toggle Answer"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Sign Language Video Area */}
            <div className="bg-gray-900 p-8 flex items-center justify-center min-h-64">
              <div className="text-center">
                {isPlaying ? (
                  <div className="animate-pulse">
                    <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <p className="text-white text-lg">Playing Sign Language Demo...</p>
                    <p className="text-gray-400 text-sm">"{getLanguageText(currentStoryItem, selectedLanguage, 'verb')}"</p>
                  </div>
                ) : (
                  <div>
                    <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Volume2 className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-lg">Sign Language Demo Area</p>
                    <p className="text-gray-500 text-sm">Click play to see the sign for:</p>
                    <p className="text-white text-xl font-semibold mt-2">
                      "{getLanguageText(currentStoryItem, selectedLanguage, 'verb')}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Verb to Practice</h3>
                <div className="bg-yellow-100 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-800 text-center">
                    {getLanguageText(currentStoryItem, selectedLanguage, 'verb')}
                  </p>
                </div>
              </div>

              {showAnswer && (
                <div className="mb-4 animate-fade-in">
                  <h4 className="text-md font-semibold text-gray-700 mb-2">All Language Translations</h4>
                  <div className="space-y-2">
                    <div className="p-2 bg-blue-50 rounded">
                      <span className="font-medium text-blue-700">English:</span> {currentStoryItem.englishMeaning}
                    </div>
                    <div className="p-2 bg-red-50 rounded">
                      <span className="font-medium text-red-700">Spanish:</span> {currentStoryItem.spanishVerb}
                    </div>
                    <div className="p-2 bg-purple-50 rounded">
                      <span className="font-medium text-purple-700">French:</span> {currentStoryItem.frenchTranslation}
                    </div>
                    <div className="p-2 bg-green-50 rounded">
                      <span className="font-medium text-green-700">Italian:</span> {currentStoryItem.italianTranslation}
                    </div>
                    <div className="p-2 bg-orange-50 rounded">
                      <span className="font-medium text-orange-700">Portuguese:</span> {currentStoryItem.portugueseTranslation}
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-md font-semibold text-gray-700 mb-2">Story Context ({selectedLanguage})</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 leading-relaxed">
                    {getLanguageText(currentStoryItem, selectedLanguage, 'sentence')}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-gray-50 p-4 flex items-center justify-between">
              <button
                onClick={prevCard}
                disabled={currentCard === 0}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={resetProgress}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                  title="Reset Progress"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={nextCard}
                disabled={currentCard === storyData.length - 1}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Progress Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Your Progress
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Cards Studied:</span>
                  <span className="font-semibold text-blue-600">
                    {progress.studiedCards.size}/{storyData.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Streak:</span>
                  <span className="font-semibold text-green-600">3 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Languages:</span>
                  <span className="font-semibold text-purple-600">5 active</span>
                </div>
              </div>
            </div>

            {/* Story Overview */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Story Overview</h3>
              <p className="text-gray-600 text-sm mb-4">
                Follow the adventures of Curb Appeall and friends as they learn about healthy living, 
                nutrition, and community cooperation through fun activities and challenges.
              </p>
              <div className="space-y-2">
                {storyData.map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-2 rounded text-sm cursor-pointer transition-colors ${
                      index === currentCard
                        ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
                        : progress.studiedCards.has(index)
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => setCurrentCard(index)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.englishMeaning}</span>
                      {progress.studiedCards.has(index) && (
                        <span className="text-green-500 text-xs">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Tips */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Learning Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Practice the hand movements while reading the text
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Try to understand the story context before focusing on signs
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Switch between languages to strengthen connections
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Use the pause button to practice at your own pace
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignLanguageLearningApp;
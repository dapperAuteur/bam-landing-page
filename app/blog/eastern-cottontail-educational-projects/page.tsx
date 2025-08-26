"use client"

import React, { useState } from 'react';
import { ChevronRight, BookOpen, Users, Target, Beaker, GraduationCap, CheckCircle, Clock, Star } from 'lucide-react';

// Define interfaces for better type safety and clarity
interface CrossCurricular {
  math?: string;
  ela?: string;
  art?: string;
  socialStudies?: string;
  engineering?: string;
  technology?: string;
}

interface Project {
  title: string;
  description: string;
  duration: string;
  episode: string;
  materials: string[];
  assessment: string;
  crossCurricular: CrossCurricular;
}

interface GradeContent {
  standard: string;
  projects: Project[];
}

const grades = ['K', '1', '2', '3', '4', '5'] as const; // 'as const' infers literal types
type GradeTab = typeof grades[number]; // Creates a union type: 'K' | '1' | '2' | '3' | '4' | '5'

const CottontailEducationMarketing = () => {
  const [activeTab, setActiveTab] = useState<GradeTab>('K');

  const projectData: Record<GradeTab, GradeContent> = {
    'K': {
      standard: 'K-LS1-1 - Animals need food, water, and shelter',
      projects: [
        {
          title: 'Cottontail Needs Chart',
          description: 'Students create visual charts comparing cottontail and human basic needs',
          duration: '45 minutes',
          episode: 'Episode 1: Suburban Survivors',
          materials: ['Construction paper', 'Magazines for cutting', 'Glue sticks', 'Markers'],
          assessment: 'Students explain one thing cottontails need to survive',
          crossCurricular: {
            math: 'Counting needs (1-5)',
            ela: 'Vocabulary building: shelter, habitat, survival',
            art: 'Drawing and collaging'
          }
        },
        {
          title: 'Build a Backyard Habitat',
          description: 'Design shoebox habitats showing food, water, and shelter needs',
          duration: '60 minutes',
          episode: 'Episode 1: Suburban Survivors',
          materials: ['Shoeboxes', 'Natural materials', 'Craft supplies', 'Animal figures'],
          assessment: 'Portfolio with labeled habitat components',
          crossCurricular: {
            math: 'Measuring spaces, counting objects',
            ela: 'Descriptive words for habitat features',
            art: '3D construction and design'
          }
        }
      ]
    },
    '1': {
      standard: '1-LS1-2 - Animal behaviors help survival; 1-LS3-1 - Young animals are like parents',
      projects: [
        {
          title: 'Cottontail Behavior Book',
          description: 'Create illustrated books showing survival behaviors',
          duration: '90 minutes (2 sessions)',
          episode: 'Episode 2: The Killing Fields',
          materials: ['Paper', 'Stapler', 'Colored pencils', 'Behavior cards'],
          assessment: 'Book demonstrates understanding of 3+ behaviors',
          crossCurricular: {
            math: 'Sequencing pages (1st, 2nd, 3rd)',
            ela: 'Simple sentence writing, illustration matching',
            art: 'Book illustration and design'
          }
        },
        {
          title: 'Baby Animals Investigation',
          description: 'Compare baby and adult cottontails through observation',
          duration: '45 minutes',
          episode: 'Episode 3: The Matriarch\'s Gamble',
          materials: ['Comparison charts', 'Magnifying glasses', 'Animal photos'],
          assessment: 'Identify 2 similarities and 1 difference',
          crossCurricular: {
            math: 'Size comparisons, measurement',
            ela: 'Comparison vocabulary',
            art: 'Scientific drawing'
          }
        }
      ]
    },
    '2': {
      standard: '2-LS4-1 - Plant and animal diversity in different habitats',
      projects: [
        {
          title: 'Fishers Habitat Map',
          description: 'Map local habitats and identify cottontail resources',
          duration: '75 minutes',
          episode: 'Episode 5: The Fishers Rabbit Highway',
          materials: ['Large paper', 'Colored pencils', 'Local maps', 'Stickers'],
          assessment: 'Map includes 3+ habitats with resources labeled',
          crossCurricular: {
            math: 'Basic mapping, distance concepts',
            ela: 'Location vocabulary, map legends',
            socialStudies: 'Community geography'
          }
        },
        {
          title: 'Seasonal Survival Wheel',
          description: 'Spinning wheel showing seasonal adaptations',
          duration: '60 minutes',
          episode: 'Episode 4: Winter Warriors',
          materials: ['Paper plates', 'Brads', 'Markers', 'Seasonal pictures'],
          assessment: 'Wheel demonstrates seasonal changes in behavior/diet',
          crossCurricular: {
            math: 'Graphing temperature and food data',
            ela: 'Seasonal vocabulary',
            art: 'Circular design and color theory'
          }
        }
      ]
    },
    '3': {
      standard: '3-LS2-1 - Environmental impacts on organisms; 3-LS4-3 - Environmental changes affect organisms',
      projects: [
        {
          title: 'Urban Wildlife Impact Study',
          description: 'Research positive and negative human impacts on cottontails',
          duration: '120 minutes (3 sessions)',
          episode: 'Episode 6: Empire\'s End',
          materials: ['Research sheets', 'Internet access', 'Poster board', 'Markers'],
          assessment: 'Presentation identifies 3 impacts and 2 solutions',
          crossCurricular: {
            math: 'Data collection and basic statistics',
            ela: 'Research skills, presentation writing',
            socialStudies: 'Human-environment interaction'
          }
        },
        {
          title: 'Predator-Prey Mobile',
          description: 'Hanging mobile showing food web relationships',
          duration: '90 minutes',
          episode: 'Episode 2: The Killing Fields',
          materials: ['Hangers', 'String', 'Card stock', 'Hole punch'],
          assessment: 'Mobile shows 5+ relationships accurately',
          crossCurricular: {
            math: 'Balance and symmetry concepts',
            ela: 'Cause and effect vocabulary',
            art: 'Mobile construction and balance'
          }
        }
      ]
    },
    '4': {
      standard: '4-LS1-1 - Internal/external structures for survival; 4-LS1-2 - Animal senses and information processing',
      projects: [
        {
          title: 'Cottontail Adaptation Portfolio',
          description: 'Detailed study of physical adaptations and their functions',
          duration: '150 minutes (4 sessions)',
          episode: 'All Episodes',
          materials: ['Portfolio folders', 'Rulers', 'Research materials', 'Diagram templates'],
          assessment: 'Portfolio contains 4 adaptations with detailed explanations',
          crossCurricular: {
            math: 'Measurement and proportion',
            ela: 'Technical writing, research skills',
            art: 'Scientific illustration techniques'
          }
        },
        {
          title: 'Engineering Solutions for Wildlife',
          description: 'Design and build models addressing real wildlife challenges',
          duration: '180 minutes (5 sessions)',
          episode: 'Episode 5: The Fishers Rabbit Highway',
          materials: ['Building materials', 'Design templates', 'Testing supplies'],
          assessment: 'Working model with design process documentation',
          crossCurricular: {
            math: 'Measurement, geometry, data analysis',
            ela: 'Technical writing, process documentation',
            engineering: 'Design thinking process'
          }
        }
      ]
    },
    '5': {
      standard: '5-LS2-1 - Food webs in ecosystems; 5-ESS3-1 - Human impact on environment',
      projects: [
        {
          title: 'Fishers Ecosystem Web',
          description: 'Complex food web showing all ecosystem interconnections',
          duration: '120 minutes (3 sessions)',
          episode: 'Episode 2: The Killing Fields',
          materials: ['Large poster board', 'Yarn', 'Research access', 'Organism cards'],
          assessment: 'Web demonstrates 10+ connections with explanations',
          crossCurricular: {
            math: 'Population calculations, energy transfer',
            ela: 'Research synthesis, presentation skills',
            technology: 'Digital presentation tools'
          }
        },
        {
          title: 'Conservation Action Plan',
          description: 'Develop real conservation plan for local cottontails',
          duration: '200 minutes (6 sessions)',
          episode: 'Episode 6: Empire\'s End',
          materials: ['Research materials', 'Presentation tools', 'Contact information'],
          assessment: 'Complete action plan with implementation timeline',
          crossCurricular: {
            math: 'Budget calculations, statistical analysis',
            ela: 'Persuasive writing, formal presentation',
            socialStudies: 'Civic engagement, local government'
          }
        }
      ]
    }
  };

  const renderProject = (project: Project) => (
    <div key={project.title} className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-green-500">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          {project.duration}
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{project.description}</p>
      
      <div className="bg-blue-50 p-3 rounded-lg mb-4">
        <p className="text-sm text-blue-800"><strong>Featured Episode:</strong> {project.episode}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Beaker className="w-4 h-4" />
            Materials Needed
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {project.materials.map((material, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                {material}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Assessment
          </h4>
          <p className="text-sm text-gray-600">{project.assessment}</p>
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          Cross-Curricular Extensions
        </h4>
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          {Object.entries(project.crossCurricular).map(([subject, description]) => (
            <div key={subject} className="bg-white p-2 rounded border">
              <span className="font-medium text-blue-600 capitalize">{subject}:</span>
              <p className="text-gray-600 mt-1">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Eastern Cottontail Educational Projects
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Standards-Aligned Learning Adventures from Fishers, Indiana
        </p>
        <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            NGSS Aligned
          </span>
          <span className="flex items-center gap-1">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            K-5 Ready
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4 text-green-500" />
            Multi-Subject Integration
          </span>
        </div>
      </div>

      {/* Benefits Banner */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Teachers Love These Projects</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Standards Aligned</h3>
            <p className="text-sm text-gray-600">Every project directly addresses Indiana Science Standards</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Cross-Curricular</h3>
            <p className="text-sm text-gray-600">Integrates Math, ELA, Art, and Social Studies naturally</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Local Connection</h3>
            <p className="text-sm text-gray-600">Features wildlife students can observe in their community</p>
          </div>
        </div>
      </div>

      {/* Grade Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b">
        {grades.map(grade => (
          <button
            key={grade}
            onClick={() => setActiveTab(grade)}
            className={`px-6 py-3 font-semibold rounded-t-lg transition-colors ${
              activeTab === grade 
                ? 'bg-blue-500 text-white border-b-2 border-blue-500' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {grade === 'K' ? 'Kindergarten' : `Grade ${grade}`}
          </button>
        ))}
      </div>

      {/* Active Grade Content */}
      <div className="mb-8">
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">
            {activeTab === 'K' ? 'Kindergarten' : `Grade ${activeTab}`} Projects
          </h2>
          <p className="text-blue-700 font-semibold">
            Indiana Standard: {projectData[activeTab].standard}
          </p>
        </div>

        {projectData[activeTab].projects.map(renderProject)}
      </div>

      {/* Implementation Support */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Complete Implementation Support</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">What's Included:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                6 Documentary Episodes (100 seconds each)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Detailed Lesson Plans & Timing Guides
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Assessment Rubrics for Each Grade
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Materials Lists & Shopping Links
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Differentiation Strategies
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Professional Development:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Teacher Training Workshop Available
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Implementation Timeline & Support
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Community Partnership Connections
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Ongoing Curriculum Support
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Bring Wildlife Learning to Your Classroom?</h2>
        <p className="text-xl mb-6">
          Connect your students with local wildlife through engaging, standards-aligned projects
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Schedule a Demo
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Download Sample Materials
          </button>
        </div>
      </div>
    </div>
  );
};

export default CottontailEducationMarketing;
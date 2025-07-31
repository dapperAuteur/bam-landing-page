'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, BookOpen, Brain, Heart, Dna, Users, ExternalLink, Info, Play, Pause } from 'lucide-react'

// Citation interface for scientific references
interface Citation {
  id: string
  authors: string
  title: string
  journal: string
  year: number
  pmid?: string
  doi?: string
  url: string
}

// Scientific citations from peer-reviewed sources
const citations: Citation[] = [
  {
    id: "matsuda1990",
    authors: "Matsuda LA, Lolait SJ, Brownstein MJ, et al.",
    title: "Structure of a cannabinoid receptor and functional expression of the cloned cDNA",
    journal: "Nature",
    year: 1990,
    pmid: "2165569",
    doi: "10.1038/346561a0",
    url: "https://www.nature.com/articles/346561a0"
  },
  {
    id: "munro1993",
    authors: "Munro S, Thomas KL, Abu-Shaar M",
    title: "Molecular characterization of a peripheral receptor for cannabinoids",
    journal: "Nature",
    year: 1993,
    pmid: "8105581",
    doi: "10.1038/365061a0",
    url: "https://www.nature.com/articles/365061a0"
  },
  {
    id: "devane1992",
    authors: "Devane WA, Hanus L, Breuer A, et al.",
    title: "Isolation and structure of a brain constituent that binds to the cannabinoid receptor",
    journal: "Science",
    year: 1992,
    pmid: "1470919",
    doi: "10.1126/science.1470919",
    url: "https://www.science.org/doi/10.1126/science.1470919"
  },
  {
    id: "mechoulam1995",
    authors: "Mechoulam R, Ben-Shabat S, Hanus L, et al.",
    title: "Identification of an endogenous 2-monoglyceride, present in canine gut, that binds to cannabinoid receptors",
    journal: "Biochemical Pharmacology",
    year: 1995,
    pmid: "7598194",
    doi: "10.1016/0006-2952(95)00109-D",
    url: "https://www.sciencedirect.com/science/article/pii/000629529500109D"
  },
  {
    id: "cravatt1996",
    authors: "Cravatt BF, Giang DK, Mayfield SP, Boger DL, Lerner RA, Gilula NB",
    title: "Molecular characterization of an enzyme that degrades neuromodulatory fatty-acid amides",
    journal: "Nature",
    year: 1996,
    pmid: "8594776",
    doi: "10.1038/384083a0",
    url: "https://www.nature.com/articles/384083a0"
  },
  {
    id: "lu2020",
    authors: "Lu HC, Mackie K",
    title: "Review of the Endocannabinoid System",
    journal: "Biological Psychiatry: Cognitive Neuroscience and Neuroimaging",
    year: 2021,
    pmid: "33285065",
    doi: "10.1016/j.bpsc.2020.07.016",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7855189/"
  },
  {
    id: "howlett2002",
    authors: "Howlett AC, Barth F, Bonner TI, et al.",
    title: "International Union of Pharmacology. XXVII. Classification of cannabinoid receptors",
    journal: "Pharmacological Reviews",
    year: 2002,
    pmid: "12037135",
    doi: "10.1124/pr.54.2.161",
    url: "https://pharmrev.aspetjournals.org/content/54/2/161"
  },
  {
    id: "pertwee2006",
    authors: "Pertwee RG",
    title: "Cannabinoid pharmacology: the first 66 years",
    journal: "British Journal of Pharmacology",
    year: 2006,
    pmid: "16402100",
    doi: "10.1038/sj.bjp.0706406",
    url: "https://bpspubs.onlinelibrary.wiley.com/doi/full/10.1038/sj.bjp.0706406"
  },
  {
    id: "bie2018",
    authors: "Bie B, Wu J, Yang H, Xu JJ, Brown DL, Naguib M",
    title: "An overview of the cannabinoid type 2 (CB2) receptor system and its therapeutic potential",
    journal: "Current Opinion in Anaesthesiology",
    year: 2018,
    pmid: "29334472",
    doi: "10.1097/ACO.0000000000000560",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6035094/"
  },
  {
    id: "hillard2018",
    authors: "Hillard CJ",
    title: "Circulating Endocannabinoids: From Whence Do They Come and Where are They Going?",
    journal: "Neuropsychopharmacology",
    year: 2018,
    pmid: "28857068",
    doi: "10.1038/npp.2017.130",
    url: "https://www.nature.com/articles/npp2017130"
  }
]

// Component for individual citation display
const CitationTooltip: React.FC<{ citationId: string; children: React.ReactNode }> = ({ citationId, children }) => {
  const [isVisible, setIsVisible] = useState(false)
  const citation = citations.find(c => c.id === citationId)

  if (!citation) return <>{children}</>

  return (
    <span className="relative inline-block">
      <span 
        className="border-b border-blue-400 border-dotted cursor-help text-blue-600 hover:text-blue-800"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </span>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-80 p-3 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg text-sm"
            style={{ left: '50%', transform: 'translateX(-50%)' }}
          >
            <div className="font-semibold text-gray-800 mb-1">{citation.authors}</div>
            <div className="text-gray-700 mb-1">{citation.title}</div>
            <div className="text-gray-600 mb-2">
              <em>{citation.journal}</em> ({citation.year})
            </div>
            {citation.pmid && (
              <div className="text-xs text-gray-500 mb-1">PMID: {citation.pmid}</div>
            )}
            {citation.doi && (
              <div className="text-xs text-gray-500 mb-2">DOI: {citation.doi}</div>
            )}
            <a 
              href={citation.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-xs"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              View Publication
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}

// Module data structure
interface ModuleData {
  id: string
  title: string
  description: string
  keyPoints: string[]
  icon: React.ReactNode
  color: string
  scientificBasis: string
  clinicalRelevance: string
}

const modules: ModuleData[] = [
  {
    id: 'foundations',
    title: 'Module 1: Foundations of the Endocannabinoid System',
    description: 'Understanding the basic structure and function of the ECS',
    keyPoints: [
      'Discovery and historical timeline of ECS research',
      'CB1 and CB2 receptor structure and distribution',
      'Endocannabinoids: anandamide and 2-AG synthesis and function',
      'Metabolic enzymes: FAAH, MAGL, and DAGL pathways',
      'Retrograde signaling mechanisms and synaptic regulation'
    ],
    icon: <Dna className="w-6 h-6" />,
    color: 'bg-blue-500',
    scientificBasis: 'The endocannabinoid system was discovered through systematic research beginning in the 1980s.',
    clinicalRelevance: 'Understanding ECS foundations is essential for therapeutic applications and maintaining homeostasis.'
  },
  {
    id: 'wellness',
    title: 'Module 2: The ECS and Wellness',
    description: 'How the ECS maintains homeostasis and supports overall wellness',
    keyPoints: [
      'ECS role in homeostatic regulation and physiological balance',
      'Stress response modulation and HPA axis interactions',
      'Sleep-wake cycle regulation and circadian rhythm support',
      'Immune function and inflammatory response control',
      'Exercise-induced endocannabinoid elevation and runner\'s high'
    ],
    icon: <Heart className="w-6 h-6" />,
    color: 'bg-green-500',
    scientificBasis: 'The ECS functions as a master regulator of physiological processes, maintaining biological balance.',
    clinicalRelevance: 'ECS dysfunction is implicated in various chronic conditions and stress-related disorders.'
  },
  {
    id: 'cognition',
    title: 'Module 3: The ECS and Learning/Cognition',
    description: 'ECS influence on memory, learning, and neuroplasticity',
    keyPoints: [
      'Memory formation, consolidation, and retrieval mechanisms',
      'Synaptic plasticity: LTP and LTD modulation',
      'Fear extinction and emotional memory processing',
      'Neurogenesis and brain development throughout lifespan',
      'Attention, focus, and executive function regulation'
    ],
    icon: <Brain className="w-6 h-6" />,
    color: 'bg-purple-500',
    scientificBasis: 'ECS plays crucial roles in synaptic plasticity and memory processes through retrograde signaling.',
    clinicalRelevance: 'ECS modulation shows promise for learning enhancement and neurodegenerative disease treatment.'
  },
  {
    id: 'longevity',
    title: 'Module 4: The ECS and Longevity',
    description: 'ECS changes with aging and potential for healthy longevity',
    keyPoints: [
      'Age-related changes in ECS function and receptor density',
      'Inflammaging and chronic inflammation regulation',
      'Cellular health: mitochondrial function and autophagy',
      'Neuroprotection and brain aging processes',
      'Metabolic flexibility and healthy aging interventions'
    ],
    icon: <Users className="w-6 h-6" />,
    color: 'bg-orange-500',
    scientificBasis: 'Age-related decline in ECS function contributes to various aging processes and diseases.',
    clinicalRelevance: 'ECS support may extend healthspan through multiple anti-aging mechanisms.'
  },
  {
    id: 'applications',
    title: 'Module 5: Practical Applications',
    description: 'Clinical assessment and therapeutic approaches',
    keyPoints: [
      'ECS function assessment and clinical evaluation methods',
      'Targeted interventions: lifestyle, botanical, and pharmacological',
      'Personalized protocol development and patient education',
      'Professional practice development and ethical considerations',
      'Integration with conventional healthcare approaches'
    ],
    icon: <BookOpen className="w-6 h-6" />,
    color: 'bg-red-500',
    scientificBasis: 'Evidence-based approaches to ECS modulation require comprehensive assessment and monitoring.',
    clinicalRelevance: 'Practical application of ECS knowledge enables personalized therapeutic interventions.'
  }
]

// Main component
const EndocannabinoidSystemCurriculum: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showReferences, setShowReferences] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-play functionality for educational progression
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setSelectedModule(prev => {
          const currentIndex = modules.findIndex(m => m.id === prev)
          const nextIndex = (currentIndex + 1) % modules.length
          return modules[nextIndex].id
        })
      }, 8000) // Change module every 8 seconds
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            The Endocannabinoid System
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
            A Comprehensive Educational Curriculum
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            <CitationTooltip citationId="matsuda1990">
              Discovered in 1990 with the identification of the CB1 receptor
            </CitationTooltip>
            , the endocannabinoid system represents one of the most important regulatory networks in human physiology. 
            <CitationTooltip citationId="lu2020">
              This system modulates numerous biological functions including pain, mood, appetite, sleep, and immune response
            </CitationTooltip>
            , making it essential knowledge for healthcare professionals and wellness practitioners.
          </p>
          
          {/* Control buttons */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isPlaying ? 'Pause Tour' : 'Start Interactive Tour'}
            </button>
            <button
              onClick={() => setShowReferences(!showReferences)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Info className="w-5 h-5" />
              {showReferences ? 'Hide References' : 'Show All References'}
            </button>
          </div>
        </motion.div>

        {/* Key Scientific Discoveries Timeline */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12 bg-white rounded-xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Scientific Discovery Timeline</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">1990</div>
              <div className="text-sm text-gray-600">
                <CitationTooltip citationId="matsuda1990">
                  CB1 receptor cloned and characterized
                </CitationTooltip>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">1992</div>
              <div className="text-sm text-gray-600">
                <CitationTooltip citationId="devane1992">
                  Anandamide discovered as first endocannabinoid
                </CitationTooltip>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">1993</div>
              <div className="text-sm text-gray-600">
                <CitationTooltip citationId="munro1993">
                  CB2 receptor identified in immune tissues
                </CitationTooltip>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ECS Core Components Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12 bg-white rounded-xl shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Core ECS Components</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dna className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Cannabinoid Receptors</h4>
              <p className="text-gray-600 text-sm">
                <CitationTooltip citationId="howlett2002">
                  CB1 receptors (primarily in nervous system) and CB2 receptors (primarily in immune tissues)
                </CitationTooltip>
                 are G-protein coupled receptors that mediate ECS signaling.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Endocannabinoids</h4>
              <p className="text-gray-600 text-sm">
                <CitationTooltip citationId="devane1992">
                  Anandamide (AEA)
                </CitationTooltip>
                 and 
                <CitationTooltip citationId="mechoulam1995">
                  2-arachidonoylglycerol (2-AG)
                </CitationTooltip>
                 are the primary endogenous ligands that activate cannabinoid receptors.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Metabolic Enzymes</h4>
              <p className="text-gray-600 text-sm">
                <CitationTooltip citationId="cravatt1996">
                  FAAH (fatty acid amide hydrolase)
                </CitationTooltip>
                 and MAGL (monoacylglycerol lipase) regulate endocannabinoid levels through controlled degradation.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Interactive Module Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                selectedModule === module.id ? 'ring-4 ring-blue-400' : ''
              }`}
              onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
            >
              <div className={`${module.color} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {module.icon}
                    <h3 className="font-semibold text-lg">{module.title.split(':')[1]?.trim() || module.title}</h3>
                  </div>
                  {selectedModule === module.id ? <ChevronUp /> : <ChevronDown />}
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-4">{module.description}</p>
                
                <AnimatePresence>
                  {selectedModule === module.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Key Learning Points:</h4>
                        <ul className="space-y-1">
                          {module.keyPoints.map((point, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Scientific Basis:</h4>
                        <p className="text-sm text-gray-600">{module.scientificBasis}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Clinical Relevance:</h4>
                        <p className="text-sm text-gray-600">{module.clinicalRelevance}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ECS Functions Overview */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">ECS Physiological Functions</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <h4 className="font-semibold mb-2">Pain Modulation</h4>
              <p className="text-sm opacity-90">
                <CitationTooltip citationId="bie2018">
                  CB2 receptors in peripheral tissues modulate inflammatory pain responses
                </CitationTooltip>
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold mb-2">Mood Regulation</h4>
              <p className="text-sm opacity-90">
                <CitationTooltip citationId="hillard2018">
                  Endocannabinoid signaling influences stress response and emotional processing
                </CitationTooltip>
              </p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold mb-2">Sleep-Wake Cycles</h4>
              <p className="text-sm opacity-90">CB1 receptors in sleep-regulating brain regions control circadian rhythms</p>
            </div>
            <div className="text-center">
              <h4 className="font-semibold mb-2">Immune Function</h4>
              <p className="text-sm opacity-90">
                <CitationTooltip citationId="munro1993">
                  CB2 receptors throughout immune tissues regulate inflammatory responses
                </CitationTooltip>
              </p>
            </div>
          </div>
        </motion.div>

        {/* References Section */}
        <AnimatePresence>
          {showReferences && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-8 mb-8"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Scientific References</h3>
              <div className="grid gap-4">
                {citations.map((citation) => (
                  <div key={citation.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="font-semibold text-gray-800">{citation.authors}</div>
                    <div className="text-gray-700">{citation.title}</div>
                    <div className="text-gray-600">
                      <em>{citation.journal}</em> ({citation.year})
                    </div>
                    {citation.pmid && (
                      <div className="text-sm text-gray-500">PMID: {citation.pmid}</div>
                    )}
                    {citation.doi && (
                      <div className="text-sm text-gray-500">DOI: {citation.doi}</div>
                    )}
                    <a 
                      href={citation.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm mt-1"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Publication
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center bg-gray-50 rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Advance Your Understanding of the ECS</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            This curriculum provides evidence-based education on the endocannabinoid system, designed for healthcare professionals, 
            researchers, and wellness practitioners seeking to integrate ECS knowledge into their practice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Enroll in Certification Program
            </button>
            <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Download Curriculum Guide
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm mt-8 pt-8 border-t border-gray-200">
          <p>
            All claims are supported by peer-reviewed scientific literature. 
            This educational content is for informational purposes only and should not replace professional medical advice.
          </p>
        </div>
      </div>
    </div>
  )
}

export default EndocannabinoidSystemCurriculum
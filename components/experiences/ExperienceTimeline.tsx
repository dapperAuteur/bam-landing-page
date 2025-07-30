'use client'

import { experiences } from './../../lib/experienceData'

export default function ExperienceTimeline() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A timeline of developer advocacy, technical education, and community leadership roles 
            that demonstrate expertise in building developer experiences and educational content.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="relative mb-12 last:mb-0">
              {/* Timeline line */}
              {index !== experiences.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-full bg-blue-200"></div>
              )}
              
              {/* Timeline dot */}
              <div className={`absolute left-4 top-8 w-4 h-4 rounded-full border-4 border-white shadow-lg ${
                exp.featured ? 'bg-blue-600' : 'bg-gray-400'
              }`}></div>
              
              {/* Content */}
              <div className={`ml-16 rounded-xl p-8 hover:shadow-lg transition-shadow ${
                exp.featured ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
              }`}>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className={`inline-block text-sm px-3 py-1 rounded-full font-medium ${
                    exp.featured 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {exp.type}
                  </span>
                  {exp.featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                      FEATURED
                    </span>
                  )}
                  <span className="text-gray-600 font-medium">{exp.period}</span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {exp.title}
                </h3>
                <h4 className="text-xl text-blue-600 font-semibold mb-4">
                  {exp.company}
                </h4>
                
                <p className="text-gray-600 mb-6">
                  {exp.description}
                </p>
                
                <div className="mb-6">
                  <h5 className="font-bold text-gray-900 mb-3">Key Achievements:</h5>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} className="flex items-start text-gray-700">
                        <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-bold text-gray-900 mb-3">Technologies & Skills:</h5>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
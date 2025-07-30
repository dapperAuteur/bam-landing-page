import { projects } from './../../lib/projectData'

export default function ProjectHighlights() {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Project Highlights
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Key projects that demonstrate technical expertise, innovation, and impact 
            in developer tools, education, and community solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div key={index} className={`p-8 rounded-xl hover:shadow-lg transition-shadow ${
              project.featured ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
            }`}>
              <div className="mb-4 flex items-center justify-between">
                <span className={`inline-block text-sm px-3 py-1 rounded-full font-medium ${
                  project.featured 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.type}
                </span>
                {project.featured && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                    FEATURED
                  </span>
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {project.title}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:text-blue-800">
                    <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {project.description}
              </p>
              
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Impact:</h4>
                <p className="text-gray-700 italic">"{project.impact}"</p>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Technologies:</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
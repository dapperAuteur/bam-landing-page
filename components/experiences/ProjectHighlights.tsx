export default function ProjectHighlights() {
  const projects = [
    {
      title: "Science Clickbait Decoder",
      description: "RAG-based tool using Python FastAPI, Next.js, and MongoDB with Hugging Face SciBERT for natural language processing.",
      type: "Open Source Project",
      technologies: ["Python", "FastAPI", "Next.js", "MongoDB", "Hugging Face", "SciBERT"],
      impact: "Helps users identify and decode misleading science headlines using AI"
    },
    {
      title: "FDA Food Recall App",
      description: "Application that tracks and alerts users about FDA food recalls with real-time data integration.",
      type: "Consumer Safety Tool",
      technologies: ["JavaScript", "API Integration", "Real-time Data", "Food Safety"],
      impact: "Provides critical food safety information to consumers"
    },
    {
      title: "FreeCodeCamp Curriculum Development",
      description: "Developed project-based computer science curriculum focused on practical application with automated progress tracking.",
      type: "Educational Content",
      technologies: ["Curriculum Design", "JavaScript", "Full-Stack Development", "Education"],
      impact: "Helped 100+ developers transition to tech careers"
    },
    {
      title: "Automated Training Systems",
      description: "Designed and implemented automated training and evaluation systems integrating multiple third-party services.",
      type: "EdTech Platform",
      technologies: ["LMS Integration", "Automation", "Training Systems", "Performance Tracking"],
      impact: "13 consecutive months of efficiency improvements"
    }
  ]

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
            <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full font-medium">
                  {project.type}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {project.title}
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
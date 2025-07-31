export default function Portfolio() {
  const projects = [
    {
      title: "Audiobook Narration",
      description: "Professional narration for educational and fiction content",
      category: "Voiceover"
    },
    {
      title: "Corporate Training Videos",
      description: "Voiceover for e-learning and corporate training materials",
      category: "Voiceover"
    },
    {
      title: "Daily Morning Show",
      description: "Consistent content creation and audience engagement",
      category: "Content Creation"
    },
    {
      title: "Business Turnaround Consulting",
      description: "Strategic consulting for business optimization and growth",
      category: "Consulting"
    },
    {
      title: "Educational Course Development",
      description: "Foundations of Fitness and Intervention Design curricula",
      category: "Education"
    },
    {
      title: "Technical Project Development",
      description: "Spaced Recall Flashcard AI App and Fitness Assessment App",
      category: "Technology"
    }
  ]

  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Portfolio & Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A showcase of voiceover work, business consulting projects, and innovative solutions 
            across multiple industries and disciplines.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {project.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {project.title}
              </h3>
              <p className="text-gray-600">
                {project.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
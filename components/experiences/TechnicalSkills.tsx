export default function TechnicalSkills() {
  const skillCategories = [
    {
      category: "Programming Languages",
      skills: ["Python", "JavaScript", "TypeScript", "HTML/CSS"]
    },
    {
      category: "AI/ML & Data",
      skills: ["RAG Systems", "Weaviate", "Verba", "Ollama", "Hugging Face", "LLMs", "SciBERT"]
    },
    {
      category: "APIs & Frameworks",
      skills: ["REST APIs", "FastAPI", "Next.js", "React.js", "Node.js", "GraphQL"]
    },
    {
      category: "Developer Tools",
      skills: ["Postman", "Docker", "MongoDB", "AWS", "Git", "Docker"]
    },
    {
      category: "Education & Content",
      skills: ["LMS Platforms", "Technical Writing", "Curriculum Development", "Video Production"]
    },
    {
      category: "Community & Advocacy",
      skills: ["Community Building", "Public Speaking", "Event Management", "Technical Training"]
    }
  ]

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Technical Skills & Expertise
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive technical skills developed through years of hands-on experience 
            in developer relations, education, and community building.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
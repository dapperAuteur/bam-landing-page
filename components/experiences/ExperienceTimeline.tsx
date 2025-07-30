'use client'

const experiences = [
  // {
  //   id: 1,
  //   title: "Developer Advocate",
  //   company: "Mux",
  //   period: "2023-Present",
  //   type: "Developer Relations",
  //   description: "Empowering developers through empathetic technical problem-solving, automation, creative storytelling, and AI/ML expertise.",
  //   achievements: [
  //     "15+ years solving complex technical problems and building developer tools",
  //     "Hands-on experience with API integrations and ML/RAG implementations",
  //     "Led development of open-source projects using TypeScript, Python, and AI technologies",
  //     "Created weekly technical content including blog posts, tutorials, and live coding sessions"
  //   ],
  //   technologies: ["Python", "JavaScript", "TypeScript", "FastAPI", "NextJS", "RAG Systems"]
  // },
  // {
  //   id: 2,
  //   title: "Customer Education Engineer",
  //   company: "Postman",
  //   period: "2022-2023",
  //   type: "Technical Education",
  //   description: "Technical educator combining deep technical expertise with proven ability to create effective learning experiences for diverse learning preferences.",
  //   achievements: [
  //     "Designed and implemented automated training and evaluation systems",
  //     "Created virtual learning environments using LMS platforms",
  //     "Developed comprehensive onboarding documentation and training materials",
  //     "Led 'Teach What You Know' program resulting in 3 job placements within 6 months"
  //   ],
  //   technologies: ["Postman", "LMS Platforms", "API Testing", "Documentation", "Training Systems"]
  // },
  // {
  //   id: 3,
  //   title: "Developer Relations Engineer",
  //   company: "Dgraph",
  //   period: "2021-2022",
  //   type: "Developer Relations",
  //   description: "Built community engagement and technical documentation while gathering user feedback for product improvements.",
  //   achievements: [
  //     "Created technical documentation and training materials",
  //     "Engaged with user community through Slack and local meetups",
  //     "Built and maintained sample applications and integrations",
  //     "Reduced support queries by 50% through comprehensive documentation"
  //   ],
  //   technologies: ["GraphQL", "Documentation", "Community Management", "API Integration"]
  // },
  {
    id: 4,
    title: "Community Leader & Technical Educator",
    company: "FreeCodeCamp",
    // period: "2018-Present",
    type: "Community Leadership",
    description: "Managed multiple developer communities across San Francisco, Phoenix, and Indianapolis.",
    achievements: [
      "Supported 100+ developers through technical challenges and career transitions",
      "Created and led 'Teach What You Know' series",
      "Organized weekly pair programming sessions and technical workshops",
      "Developed curriculum for JavaScript and full-stack development training"
    ],
    technologies: ["JavaScript", "Full-Stack Development", "Community Building", "Curriculum Development"]
  },
  {
    id: 5,
    title: "Brand Ambassador Professional",
    company: "Various Clients",
    // period: "2016-Present",
    type: "Brand Ambassador",
    description: "Dynamic professional with proven expertise in technical product demonstrations, live event engagement, and audience education.",
    achievements: [
      "Led product demonstrations for technical tools to audiences of 10-25 people monthly",
      "Managed live events including workshops, presentations, and community gatherings",
      "Coordinated contractors and volunteers for technical demonstrations",
      "Built authentic relationships with community members through genuine passion for technology"
    ],
    technologies: ["Event Management", "Product Demonstrations", "Public Speaking", "Community Engagement"]
  }
]

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
              <div className="absolute left-4 top-8 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
              
              {/* Content */}
              <div className="ml-16 bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                    {exp.type}
                  </span>
                  {/* <span className="text-gray-600 font-medium">{exp.period}</span> */}
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
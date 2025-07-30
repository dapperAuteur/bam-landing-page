import { Experience, Project, SkillCategory } from "./../types/types"


export const experiences: Experience[] = [
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
  //   technologies: ["Python", "JavaScript", "TypeScript", "FastAPI", "NextJS", "RAG Systems"],
  //   featured: true
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
  //   technologies: ["Postman", "LMS Platforms", "API Testing", "Documentation", "Training Systems"],
  //   featured: true
  // },
  {
    id: 3,
    title: "Developer Relations Engineer",
    company: "Dgraph",
    type: "Developer Relations",
    description: "Built community engagement and technical documentation while gathering user feedback for product improvements.",
    achievements: [
      "Created technical documentation and training materials",
      "Engaged with user community through Slack and local meetups",
      "Built and maintained sample applications and integrations",
      "Reduced support queries by 50% through comprehensive documentation"
    ],
    technologies: ["GraphQL", "Documentation", "Community Management", "API Integration"]
  },
  {
    id: 4,
    title: "Community Leader & Technical Educator",
    company: "FreeCodeCamp",
    type: "Community Leadership/Admin",
    description: "Managed multiple developer communities across San Francisco, Phoenix, and Indianapolis.",
    achievements: [
      "Supported 100+ developers through technical challenges and career transitions",
      "Created and led 'Teach What You Know' series",
      "Organized weekly pair programming sessions and technical workshops",
      "Developed curriculum for JavaScript and full-stack development training"
    ],
    technologies: ["JavaScript", "Full-Stack Development", "Community Building", "Curriculum Development"],
    featured: true
  },
  {
    id: 5,
    title: "Brand Ambassador Professional",
    company: "Various Clients",
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
  // 🔥 TO ADD A NEW EXPERIENCE:
  // 1. Copy the format above
  // 2. Update the id number (next highest number)
  // 3. Fill in your details
  // 4. Set featured: true if you want it highlighted
  // 5. Save the file - that's it!
]

// Helper functions for filtering and displaying data
export const getFeaturedExperiences = () => experiences.filter(exp => exp.featured)
export const getExperiencesByType = (type: string) => experiences.filter(exp => exp.type === type)
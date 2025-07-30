import { Metadata } from 'next'
import ExperienceHeader from './../../components/experiences/ExperienceHeader'
import ExperienceTimeline from './../../components/experiences/ExperienceTimeline'
import TechnicalSkills from './../../components/experiences/TechnicalSkills'
import ProjectHighlights from './../../components/experiences/ProjectHighlights'

export const metadata: Metadata = {
  title: 'Experience | Brand Anthony McDonald - Developer Advocate & Brand Ambassador',
  description: 'Developer Advocate and Brand Ambassador experience including Mux, Postman, FreeCodeCamp communities, and technical education.',
}

export default function ExperiencePage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <ExperienceHeader />
      <ExperienceTimeline />
      <TechnicalSkills />
      <ProjectHighlights />
    </main>
  )
}
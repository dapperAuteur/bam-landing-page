export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white section-padding pt-32">
      <div className="container-max">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Brand Anthony McDonald
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-blue-100">
            Developer Relations, Software Developer, AI Adviser, Business Consultant & Voiceover Artist 
          </p>
          <p className="text-lg mb-8 text-blue-200 max-w-2xl mx-auto">
            Developer advocacy, professional voiceover, and strategic consulting —
            building tools and documenting the journey to become the world's fastest centenarian.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/hire" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
              Hire me
            </a>
            <a href="/partner" className="btn-primary bg-purple-600 text-white hover:bg-purple-700 border-2 border-purple-400">
              Partner with me
            </a>
            <a href="/projects" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600">
              See what I&apos;m building
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
export default function About() {
  return (
    <section id="about" className="section-padding bg-gray-50">
      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              About Brand Anthony McDonald
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              I'm building something unique: the world's smallest conglomerate while training to become 
              the world's fastest centenarian. This isn't just about longevity. It's about optimizing 
              every aspect of life and business for peak performance and sustainable success.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              My background spans developer relations, education, content creation, and health 
              optimization. I bring a multidisciplinary approach to both voiceover work and business consulting.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Developer Advocacy</h3>
                <p className="text-gray-600">API documentation, community building, and technical content creation</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Voiceover & Narration</h3>
                <p className="text-gray-600">Audiobooks, commercials, e-learning, and corporate content</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Technical Projects</h3>
                <p className="text-gray-600">Flashlearn AI, Fitness Assessment App, Science tools, and more</p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Community Focus</h3>
                <p className="text-gray-600">Helping others achieve their goals and build success</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Years in Business</span>
                <span className="font-bold text-blue-600">25+</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Daily Content Creation</span>
                <span className="font-bold text-blue-600">Morning Show</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Specializations</span>
                <span className="font-bold text-blue-600">Dev Rel + Voiceover</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mission</span>
                <span className="font-bold text-blue-600">World's Fastest Centenarian</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
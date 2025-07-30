export default function Services() {
  const services = [
    {
      title: "Voice Over Services",
      description: "Professional narration for audiobooks, commercials, e-learning, and corporate content.",
      features: ["Audiobook Narration", "Commercial Voice Over", "E-Learning Content", "Corporate Training"]
    },
    {
      title: "Business Consulting",
      description: "Strategic consulting for entrepreneurs and small businesses looking to scale and optimize.",
      features: ["Business Strategy", "Process Optimization", "Digital Transformation", "Growth Planning"]
    },
    {
      title: "Content Creation",
      description: "Daily morning show, educational content, and community building expertise.",
      features: ["Daily Morning Show", "Educational Courses", "Community Building", "Content Strategy"]
    }
  ]

  return (
    <section id="services" className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Services That Build Success
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Combining professional voice over artistry with strategic business consulting 
            to help individuals and organizations achieve their goals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
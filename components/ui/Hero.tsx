export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white section-padding pt-32">
      <div className="container-max">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Brand Anthony McDonald
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-blue-100">
            Voiceover Artist & Business Consultant
          </p>
          <p className="text-lg mb-8 text-blue-200 max-w-2xl mx-auto">
            Building the world's smallest conglomerate while training to be the world's fastest centenarian. 
            Professional voiceover services and strategic business consulting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
              Get Voiceover Quote
            </a>
            <a href="#services" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600">
              View Services
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
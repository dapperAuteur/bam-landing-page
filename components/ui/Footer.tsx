export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white section-padding">
      <div className="container-max">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Brand Anthony McDonald</h3>
            <p className="text-gray-300 mb-4">
              Building the world's smallest conglomerate while training to be the world's fastest centenarian. 
              Professional voiceover services and strategic business consulting.
            </p>
            <p className="text-gray-400 text-sm">
              © 2025 Brand Anthony McDonald. All rights reserved.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Voiceover</li>
              <li>Business Consulting</li>
              <li>Content Creation</li>
              <li>Educational Courses</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Daily Morning Show</li>
              <li>Community</li>
              <li>Contact</li>
              <li>Portfolio</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>Discipline and focus: the missing ingredients for extraordinary success.</p>
        </div>
      </div>
    </footer>
  )
}
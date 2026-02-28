export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white section-padding">
      <div className="container-max">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Brand Anthony McDonald</h3>
            <p className="text-gray-300 mb-4">
              Developer advocate, voiceover artist, and strategic consultant —
              building the world's smallest conglomerate while training to be the world's fastest centenarian.
            </p>
            <p className="text-gray-400 text-sm">
              &copy; 2026 Brand Anthony McDonald. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Developer Relations</li>
              <li>Voiceover</li>
              <li>Business Consulting</li>
              <li>Technical Education</li>
              <li>Content Creation</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Connect</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="https://l.awews.com/brand-am-linkedin" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://i.brandanthonymcdonald.com/github-profile" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://i.brandanthonymcdonald.com/bluesky" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Bluesky
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
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

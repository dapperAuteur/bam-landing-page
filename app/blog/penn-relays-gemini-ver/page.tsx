import Link from 'next/link'

export const metadata = {
  title: 'Speed Beyond 50: 2026 Penn Relays Masters Sprint Recap | Brand Anthony McDonald',
  description: 'Full results and analysis of the Masters 50+ sprints at the 2026 Penn Relays.',
}

export default function PennRelays2026Post() {
  const m50Results = [
    { event: "M50 100m Dash", winner: "Antwon Dussett", time: "11.42s", note: "Heat 1 Winner" },
    { event: "M55 100m Dash", winner: "Reggie Pendleton", time: "11.95s", note: "Strong Headwind" },
    { event: "M50 4x100m Relay", winner: "Greater Philadelphia TC", time: "45.10s", note: "Meet Record" },
    { event: "M60 100m Dash", winner: "Allan Tissenbaum", time: "12.38s", note: "Consistent Excellence" },
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Speed Beyond 50: 2026 Penn Relays Masters Sprint Recap
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <time>May 4, 2026</time>
          <span>•</span>
          <span>6 min read</span>
          <span>•</span>
          <span className="text-blue-600 font-semibold">Athletics</span>
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          The roar of the crowd at Franklin Field for the Masters events is becoming just as deafening as the Championship of America races. At the 2026 Penn Relays, the Masters 50+ division stole the show, proving that high-end velocity is a lifelong pursuit.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The 100m Showcase</h2>
        <p>
          The M50 100m dash remains the gold standard for testing raw power in the later decades. This year, the field faced a slight headwind on the backstretch, but the times remained impressively sharp.
        </p>

        <div className="overflow-x-auto my-8">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Winner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {m50Results.map((result, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.event}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{result.winner}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">{result.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Analysis: The M50 4x100m Relay</h2>
        <p>
          The 4x100m relay is where technical execution meets aging physiology. The <strong>Greater Philadelphia Track Club</strong> put on a masterclass in baton exchange, finishing in a blistering <strong>45.10 seconds</strong>. 
        </p>
        <p>
          What’s notable is the consistency of the splits. In the 50+ category, the drop-off in velocity usually occurs in the final 20 meters of each leg due to central nervous system fatigue. However, the top three teams all showcased 100m splits that stayed within 0.3 seconds of their open personal bests from their 40s.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8 rounded-r-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Key Takeaway for Masters Athletes</h3>
          <p className="text-gray-700">
            Success at this level in 2026 is increasingly tied to <strong>LPHC stability</strong> (Lumbo-Pelvic-Hip Complex). The runners who maintained upright posture through the transition phase were the ones hitting sub-12 second times, regardless of age.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Road to 100</h2>
        <p>
          As I watch these M50 and M60 athletes, I’m reminded that the "Centenarian Sprinter" goal isn't just about the final race at age 100—it's about the maintenance of these fast-twitch fibers in the decades leading up to it. Seeing a 60-year-old clock a 12.38s is proof that the decline we expect with age is often just a lack of specific stimulus.
        </p>

        <div className="bg-gray-900 text-white rounded-2xl p-8 my-12 text-center">
          <h3 className="text-2xl font-bold mb-4">Want to train like a Masters Sprinter?</h3>
          <p className="text-gray-300 mb-6">
            Check out my <strong>LPHC Protocol</strong> designed specifically for maintaining explosive power and stability as we age.
          </p>
          <Link 
            href="/blog/workouts/stable-explosiveness-lphc-protocol" 
            className="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-bold"
          >
            View the Protocol →
          </Link>
        </div>
      </div>

      {/* Author Bio */}
      <div className="border-t border-gray-200 mt-12 pt-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex-shrink-0"></div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Brand Anthony McDonald</h3>
            <p className="text-gray-600 mb-4">
              NASM CPT, CES, PES • MBA
            </p>
            <p className="text-gray-700 leading-relaxed">
              Brand is a performance coach and data analyst dedicated to the science of longevity. He tracks every metric on his journey to become the world's fastest centenarian.
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
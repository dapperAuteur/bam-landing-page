interface SiblingProduct {
  name: string
  href: string
}

const SIBLING_PRODUCTS: SiblingProduct[] = [
  { name: 'WitUS.online', href: 'https://witus.online' },
  { name: 'WitUS Inbox', href: 'https://inbox.witus.online' },
  { name: 'CentenarianOS', href: 'https://centenarianos.com' },
  { name: 'Work.WitUS', href: 'https://work.witus.online' },
  { name: 'Tour Manager OS', href: 'https://tour.witus.online' },
  { name: 'Wanderlearn', href: 'https://wanderlearn.witus.online' },
  { name: 'Fly.WitUS', href: 'https://fly.witus.online' },
  { name: 'FlashLearnAI', href: 'https://flashlearnai.witus.online' },
  { name: 'Learn.WitUS', href: 'https://centenarianos.com/academy' },
  { name: 'AwesomeWebStore', href: 'https://awesomewebstore.com' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white section-padding">
      <div className="container-max">
        <RiseWellnessCallout />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="md:col-span-2 lg:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Brand Anthony McDonald</h3>
            <p className="text-gray-300 mb-4">
              Developer advocate, voiceover artist, and strategic consultant,
              building the world&apos;s smallest conglomerate while training to be the world&apos;s fastest centenarian.
            </p>
            <p className="text-gray-400 text-sm">
              &copy; {year} Brand Anthony McDonald. All rights reserved.
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
                <a href="/feed.xml" className="hover:text-white transition-colors">
                  RSS
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="https://risewellnessofindiana.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Rise Wellness
                  <span className="sr-only"> (mental-health partner, opens in new tab)</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">WitUS Ecosystem</h4>
            <ul className="space-y-2 text-gray-300 text-sm">
              {SIBLING_PRODUCTS.map((product) => (
                <li key={product.href}>
                  <a
                    href={product.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {product.name}
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 space-y-2">
          <p>Discipline and focus: the missing ingredients for extraordinary success.</p>
          <p className="text-sm">
            Part of the WitUS ecosystem · A B4C LLC /{' '}
            <a
              href="https://awesomewebstore.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-white transition-colors"
            >
              AwesomeWebStore.com
              <span className="sr-only"> (opens in new tab)</span>
            </a>{' '}
            brand
          </p>
        </div>
      </div>
    </footer>
  )
}

// Rise Wellness callout. Canonical copy per gemini/witus/public/brand/footer-recipe.md.
// Container surface + accent tokens swapped to bam-landing-page's dark + indigo theme;
// the disclaimer text is byte-identical (vetted with the partner). The only token
// changed inside the disclaimer is [YOUR APP NAME] -> "Brand Anthony McDonald".
function RiseWellnessCallout() {
  return (
    <section
      aria-labelledby="rise-wellness-heading"
      className="mb-12 rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-5 text-sm"
    >
      <header className="mb-3">
        <p className="text-[11px] uppercase tracking-wide text-indigo-300 font-semibold">
          Mental health support
        </p>
        <h2
          id="rise-wellness-heading"
          className="text-base font-semibold text-white"
        >
          Rise Wellness of Indiana
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Independent mental health provider · Not affiliated with Brand Anthony McDonald
        </p>
      </header>

      <p className="text-gray-300 leading-relaxed">
        Rise Wellness of Indiana provides compassionate, personalized,
        holistic mental health care, including evidence-based medicine,
        trauma-informed care, and a whole-person approach to help you heal,
        grow, and thrive in mind, body, and spirit.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
            Services
          </p>
          <ul className="text-xs text-gray-300 space-y-0.5">
            <li>ADHD testing &amp; management (in-person and from home)</li>
            <li>Anxiety &amp; depression</li>
            <li>Maternal mental health</li>
            <li>Medication management</li>
            <li>GeneSight&reg; genetic testing</li>
            <li>Behavioral therapy &amp; coaching</li>
            <li>Routine lab testing</li>
          </ul>
        </div>

        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
            Visit or call
          </p>
          <address className="not-italic text-xs text-gray-300 leading-relaxed">
            320 North Meridian Street
            <br />
            Indianapolis, IN 46204
            <br />
            Mon–Sat by appointment · Sun closed
          </address>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs">
            <a
              href="tel:+13179650299"
              className="inline-flex items-center min-h-7 font-medium text-indigo-300 hover:underline focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 rounded"
            >
              317-965-0299
            </a>
            <span aria-hidden="true" className="text-gray-600">·</span>
            <a
              href="https://risewellnessofindiana.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-7 font-medium text-indigo-300 hover:underline focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 rounded"
            >
              risewellnessofindiana.com
              <span className="sr-only"> (opens in new tab)</span>
            </a>
            <span aria-hidden="true" className="text-gray-600">·</span>
            <a
              href="https://www.centenarianos.com/safety#rise-wellness"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center min-h-7 font-medium text-indigo-300 hover:underline focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 rounded"
            >
              Full safety page
              <span className="sr-only"> on centenarianos.com (opens in new tab)</span>
            </a>
          </div>
        </div>
      </div>

      <blockquote className="mt-4 border-l-2 border-indigo-500/40 pl-3 text-xs italic text-gray-400">
        &ldquo;At Rise Wellness, we believe everyone has the capacity to rise
        above challenges and live a fulfilling, healthy life. Our care is
        guided by the belief that healing is personal, holistic, and rooted
        in compassion.&rdquo;
        <span className="block not-italic mt-1 text-gray-400">
          Rise Wellness of Indiana
        </span>
      </blockquote>

      {/* === NON-NEGOTIABLE DISCLAIMER ===
          Edit ONLY the app name token. Don't paraphrase. Don't trim.
          Don't reorder. This was vetted with the partner. */}
      <p className="mt-4 text-[11px] leading-relaxed text-gray-400">
        Rise Wellness of Indiana is an independent organization. They are
        not affiliated with, employed by, or endorsed by Brand Anthony McDonald,
        CentenarianOS, B4C LLC, AwesomeWebStore.com, or Anthony McDonald.
        We are grateful for their collaboration on mental health safety
        resources for our community.
      </p>
    </section>
  )
}

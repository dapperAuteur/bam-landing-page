import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Building a Health Dashboard for the Next 70 Years | Brand Anthony McDonald',
  description: 'The complete system for transforming health data into daily decisions—designed to keep my community active and present for decades.',
  openGraph: {
    title: 'Building a Health Dashboard for the Next 70 Years',
    description: 'I built this course because I want the people I love to be there when I break the centenarian speed record.',
    images: ['/blog/3a-personal-health-dashboard-tracking-metrics.png'],
  },
}

export default function HealthDashboardPost() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-12">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Blog
        </Link>
        <div className="text-sm text-purple-600 font-semibold mb-2">PART 3 OF 3 • SERIES FINALE</div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Building a Health Dashboard for the Next 70 Years
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          The complete system for transforming health data into daily decisions—designed to keep my community active and present for decades.
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <time>January 25, 2026</time>
          <span>•</span>
          <span>8 min read</span>
        </div>
      </header>

      {/* Featured Image Placeholder */}
      <div className="mb-12 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-2xl p-8 text-center">
        <Link
          href="https://the.worldsfastestcentenarian.com/fitness-analytics-course" 
          className="inline-block px-6 py-3 rounded-lg hover:bg-purple-200 transition-colors font-semibold">
          <Image
            src={'/blog/3a-personal-health-dashboard-tracking-metrics.png'}
            alt={'Complete Health Dashboard Mockup. Infographic: Complete Health Dashboard Mockup that shows Resting Heart Rate, Daily Steps, Sleep Quality, Intensity Minutes, and Weekly Insights.'}
            width={1400}
            height={1000}
          />
        </Link>
        <p className="text-gray-600 italic">
          [Infographic: "Complete Health Dashboard Mockup that shows Resting Heart Rate, Daily Steps, Sleep Quality, Intensity Minutes, and Weekly Insights"]
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          I'm going to be 100 years old, someday. And when I break the world record for fastest centenarian, I want the people I love competing with me or standing at the finish line cheering.
        </p>

        <p>
          That's why I built this entire system. Not just for me. For my friends, my family, my community. For you.
        </p>

        <p>
          This is the final post in our three-part series. We've covered the four essential metrics and deep-dived into intensity minutes. Now I'm pulling back the curtain on the complete dashboard system I use daily.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Why a Dashboard Matters</h2>

        <p>
          Imagine driving a car with no dashboard. No speedometer. No fuel gauge. No warning lights.
        </p>

        <p>
          You'd probably still get where you're going most of the time. But you'd have no idea if you were about to run out of gas. You wouldn't know if your engine was overheating. You'd be guessing constantly.
        </p>

        <p>
          That's how most people approach their health. They feel okay, so they assume everything is fine. Until suddenly it's not.
        </p>

        <p>
          A health dashboard changes this completely. It gives you the same awareness of your body that a car dashboard gives you about your vehicle. <strong>You stop guessing and start knowing.</strong>
        </p>

        {/* CTA 1 */}
        <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 my-8 rounded-r-lg">
          <p className="text-gray-800 font-semibold mb-2">
            Want to build your own health dashboard?
          </p>
          <p className="text-gray-700 mb-4">
            My 5-week course walks you through creating a personalized system that works for your life's processes and goals. It starts with Week 1's foundation setup.
          </p>
          <Link 
            href="https://the.worldsfastestcentenarian.com/fitness-analytics-course" 
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Get Early Access →
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Four Pillars (Revisited)</h2>

        <p>
          In Part 1, I introduced the four essential metrics. Let's look at how they work together as a complete system:
        </p>

        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">1</div>
              <h3 className="text-xl font-bold text-gray-900">Resting Heart Rate</h3>
            </div>
            <p className="text-gray-700 mb-3">
              <strong>What it measures:</strong> Cardiovascular efficiency
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Why it matters:</strong> Lower Resting Heart Rate (RHR) indicates a stronger, more efficient heart
            </p>
            <p className="text-gray-700">
              <strong>Dashboard role:</strong> Long-term health indicator and recovery monitor
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">2</div>
              <h3 className="text-xl font-bold text-gray-900">Daily Steps</h3>
            </div>
            <p className="text-gray-700 mb-3">
              <strong>What it measures:</strong> General movement and activity
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Why it matters:</strong> Sedentary lifestyle is a major health risk
            </p>
            <p className="text-gray-700">
              <strong>Dashboard role:</strong> Daily activity baseline and habit tracker
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">3</div>
              <h3 className="text-xl font-bold text-gray-900">Intensity Minutes</h3>
            </div>
            <p className="text-gray-700 mb-3">
              <strong>What it measures:</strong> Cardiovascular challenge level
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Why it matters:</strong> Strongest predictor of longevity and mortality risk
            </p>
            <p className="text-gray-700">
              <strong>Dashboard role:</strong> Primary optimization target and fitness progress
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">4</div>
              <h3 className="text-xl font-bold text-gray-900">Sleep Quality</h3>
            </div>
            <p className="text-gray-700 mb-3">
              <strong>What it measures:</strong> Recovery and restoration
            </p>
            <p className="text-gray-700 mb-3">
              <strong>Why it matters:</strong> Sleep affects every other health metric
            </p>
            <p className="text-gray-700">
              <strong>Dashboard role:</strong> Recovery indicator and lifestyle adjustment signal
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">How the Metrics Connect</h2>

        <p>
          Here's where it gets powerful. These metrics don't exist in isolation. They influence each other in fascinating ways:
        </p>

        <div className="bg-gray-50 rounded-xl p-6 my-8 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">The Dashboard Feedback Loop</h3>
          
          <div className="space-y-4 text-gray-700">
            <p className="flex items-start gap-3">
              <span className="text-2xl">→</span>
              <span>Hit your intensity minutes consistently, and your resting heart rate drops over weeks</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-2xl">→</span>
              <span>Better sleep quality improves recovery, letting you handle more intense workouts</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-2xl">→</span>
              <span>Higher daily steps correlate with better sleep quality at night</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-2xl">→</span>
              <span>Improved resting heart rate signals your body can handle more training load</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-2xl">→</span>
              <span>Regular intensity training enhances sleep duration and deep sleep phases</span>
            </p>
          </div>
        </div>

        <p>
          When you track all four together, you see these connections clearly. You understand cause and effect in your own body.
        </p>

        {/* CTA 2 */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 my-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Learn to Read Your Body's Signals
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            In my course, Week 3 focuses entirely on identifying these data patterns and connections. You'll learn to spot trends before they become problems.
          </p>
          <Link 
            href="https://the.worldsfastestcentenarian.com/fitness-analytics-course" 
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-bold text-lg shadow-lg"
          >
            Reserve Your Spot →
          </Link>
          <p className="text-sm text-gray-600 mt-4">
            Be among the first 100 students • Special launch pricing
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">My Daily Dashboard Routine</h2>

        <p>
          People often ask me: "How much time does this take?" The answer surprises them: <strong>about 5 minutes per day.</strong>
        </p>

        <p>
          Here's my actual routine:
        </p>

        <div className="space-y-6 my-8">
          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Morning Check (It takes 2 minutes)</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• Open my fitness app</li>
              <li>• Check yesterday's sleep quality score</li>
              <li>• Review this morning's resting heart rate</li>
              <li>• Note any unusual patterns or changes</li>
            </ul>
          </div>

          <div className="border-l-4 border-purple-500 pl-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Evening Review (3 minutes)</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• Check today's step count and intensity minutes</li>
              <li>• Compare to weekly targets</li>
              <li>• Plan tomorrow's activity if needed to stay on track</li>
              <li>• Make any notes about how I felt during training</li>
            </ul>
          </div>

          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Weekly Deep Dive (15 minutes)</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• Review all four metrics over the past 7 days</li>
              <li>• Look for trends and correlations</li>
              <li>• Adjust next week's training plan based on data</li>
              <li>• Update my tracking spreadsheet with insights</li>
            </ul>
          </div>
        </div>

        <p>
          That's it. Five minutes daily, fifteen minutes weekly. In exchange, I have complete awareness of my body's status and clear direction for my training.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Technology Setup</h2>

        <p>
          You don't need fancy equipment. Here's what I recommend based on my six years of research and testing:
        </p>

        <div className="bg-blue-50 rounded-xl p-6 my-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Minimum Required Setup</h3>
          
          <div className="space-y-4">
            <div>
              <p className="font-bold text-gray-900">Entry Level ($50-150)</p>
              <ul className="text-gray-700 space-y-1 mt-2">
                <li>• Basic fitness tracker (Fitbit Inspire, Xiaomi Band, etc.)</li>
                <li>• Tracks: Steps, heart rate, sleep, basic intensity</li>
                <li>• Good enough to start and learn the system</li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-gray-900">Intermediate Level ($150-400)</p>
              <ul className="text-gray-700 space-y-1 mt-2">
                <li>• Mid-range smartwatch (Apple Watch SE, Garmin, Fitbit Sense)</li>
                <li>• More accurate sensors and detailed metrics</li>
                <li>• Better apps and data export options</li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-gray-900">Advanced Level ($400+)</p>
              <ul className="text-gray-700 space-y-1 mt-2">
                <li>• Premium devices (Apple Watch Ultra, Garmin Fenix, Whoop)</li>
                <li>• Professional-grade accuracy and advanced analytics</li>
                <li>• Best for serious athletes or data enthusiasts</li>
              </ul>
            </div>
          </div>

          <p className="text-sm text-gray-600 mt-6 italic">
            Note: My course works with any device that tracks the four essential metrics. You don't need expensive gear to get started.
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Why I Built the Course</h2>

        <p>
          Here's the truth: I didn't need to create this course for myself. I already have the system. I understand the science. I'm on track for my centenarian goal.
        </p>

        <p>
          But I kept thinking about my community. The people I train with. My family members asking health questions. Friends wanting to "get in shape" but not knowing where to start.
        </p>

        <p>
          I saw them making the same mistakes I made before I learned all this:
        </p>

        <ul className="space-y-2 my-6">
          <li>• Following random workout programs without understanding their bodies</li>
          <li>• Buying expensive supplements instead of fixing basic habits</li>
          <li>• Getting discouraged and quitting because results felt random</li>
          <li>• Ignoring clear warning signs their bodies were sending</li>
        </ul>

        <p>
          So I spent six months organizing everything I learned over six years into a clear, step-by-step system. Not just theory. Practical application you can use immediately.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The 5-Week Journey</h2>

        <p>
          The course follows a careful progression. Each week builds on the previous one:
        </p>

        <div className="space-y-4 my-8">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">1</div>
              <h3 className="text-xl font-bold text-gray-900">Foundations of Fitness and Health Metrics</h3>
            </div>
            <p className="text-gray-700">
              Master the 4 essential metrics. Set up your tracking system. Understand what each number means for your health.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">2</div>
              <h3 className="text-xl font-bold text-gray-900">Wearable Technology & Data Collection</h3>
            </div>
            <p className="text-gray-700">
              Choose the right devices for your needs. Learn about accuracy and limitations. Set up proper data collection habits.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">3</div>
              <h3 className="text-xl font-bold text-gray-900">Data Analytics Basics</h3>
            </div>
            <p className="text-gray-700">
              Identify patterns in your data. Understand trends and correlations. Learn to spot warning signs early.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">4</div>
              <h3 className="text-xl font-bold text-gray-900">Intensity Minutes as Longevity Metric</h3>
            </div>
            <p className="text-gray-700">
              Deep dive into the most powerful metric. Create your personalized intensity plan. Learn advanced optimization strategies.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">5</div>
              <h3 className="text-xl font-bold text-gray-900">Long-Term Health Trends & Sustained Improvement</h3>
            </div>
            <p className="text-gray-700">
              Build your personal centenarian protocol. Create sustainable habits. Join a community of health optimizers.
            </p>
          </div>
          <div className="mb-12 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-2xl p-8 text-center">
            <Link
              href="https://the.worldsfastestcentenarian.com/fitness-analytics-course" 
              className="inline-block px-6 py-3 rounded-lg hover:bg-purple-200 transition-colors font-semibold">
              <Image
                src={'/blog/3b-your-5-week-health-transformation.png'}
                alt={'5-Week Journey Flowchart: Your 5-Week Transformation. Each week has distinct color (green → blue → purple → orange → pink). Week 1 Foundation, Week 2 Technology, Week 3 Analysis, Week 4 Optimization, Week 5 Sustainability. Result: Lifelong Health System.'}
                width={1400}
                height={1000}
              />
            </Link>
            <p className="text-gray-600 italic">
              [Infographic: "5-Week Journey Flowchart. Your 5-Week Transformation"]
            </p>
          </div>
        </div>

        {/* CTA 3 - Strong Comprehensive */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-8 my-12 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Transform Your Health in Just 5 Weeks
          </h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto text-lg">
            Join the waitlist for "Foundations of Fitness and Health Metrics" and learn the exact system I use to track, analyze, and optimize for extraordinary longevity.
          </p>
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6 max-w-2xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-bold text-white mb-1">✓ 5-Week Program</p>
                <p className="text-indigo-200">Step-by-step system</p>
              </div>
              <div>
                <p className="font-bold text-white mb-1">✓ Evidence-Based</p>
                <p className="text-indigo-200">6+ years of research</p>
              </div>
              <div>
                <p className="font-bold text-white mb-1">✓ Practical Tools</p>
                <p className="text-indigo-200">Immediate application</p>
              </div>
            </div>
          </div>
          <Link 
            href="https://the.worldsfastestcentenarian.com/fitness-analytics-course" 
            className="inline-block bg-white text-indigo-600 px-10 py-5 rounded-xl hover:bg-indigo-50 transition-colors font-bold text-xl shadow-2xl"
          >
            Get Early Access Now →
          </Link>
          <p className="text-sm text-indigo-200 mt-6">
            Part of the World's Fastest Centenarian specialization • Limited spots for launch cohort
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">What Makes This Different</h2>

        <p>
          I'm a Certified Personal Trainer, Corrective Exercise Specialist, and Certified Nutirition Coach with an MBA. I've studied the science deeply. But this course isn't academic lectures and complex theories.
        </p>

        <p>
          It's practical. It's actionable. It's designed for real people with real lives.
        </p>

        <div className="bg-green-50 rounded-xl p-6 my-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">What You Won't Find in This Course</h3>
          <ul className="text-gray-700 space-y-2">
            <li>✗ Complicated spreadsheets requiring math skills</li>
            <li>✗ Unrealistic workout plans demanding hours daily</li>
            <li>✗ Expensive supplement recommendations</li>
            <li>✗ One-size-fits-all cookie-cutter programs</li>
            <li>✗ Fitness industry hype and false promises</li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 my-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">What You Will Find</h3>
          <ul className="text-gray-700 space-y-2">
            <li>✓ Simple tracking methods that take minutes per day</li>
            <li>✓ Flexible approaches that fit your schedule and preferences</li>
            <li>✓ Evidence-based principles backed by research</li>
            <li>✓ Personalized strategies based on your data</li>
            <li>✓ Sustainable habits for lifelong health</li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Beyond the Individual: Community Impact</h2>

        <p>
          Here's something I didn't expect when I started teaching this system: <strong>the ripple effect.</strong>
        </p>

        <p>
          When one person in a family starts tracking their health data, others get curious. When one friend makes visible improvements, their circle takes notice.
        </p>

        <p>
          I've seen it happen repeatedly. One person learns the system, shares their results, and suddenly three more people want to learn.
        </p>

        <p>
          That's exactly what I want. Because I'm not just training for myself. I'm building a community of people who will be healthy, active, and present for decades.
        </p>

        <p>
          When I cross that finish line at 100 years old, I want it surrounded by friends who are also thriving in their later years. That's the real goal.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Your Next Step</h2>

        <p>
          You've read all three parts of this series. You understand the four essential metrics. You know why intensity minutes matter most. You've seen the complete dashboard system.
        </p>

        <p>
          Now you have a choice.
        </p>

        <p>
          You can close this browser tab and go back to guessing about your health. Or you can take the first step toward real, measurable, lasting change.
        </p>

        <p>
          The course waitlist is open. When it launches, the first 100 students get special pricing and bonus resources. After that, prices go up.
        </p>

        <p>
          But more importantly: every day you wait is another day without this system working for you. Another day of missing the patterns your body is trying to show you.
        </p>

        <p className="text-xl font-semibold text-gray-900 mt-8">
          I'm tracking every step toward 100. Join me for the journey.
        </p>

        {/* Final Comprehensive CTA */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-3xl p-12 my-12 text-center shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Build Your Health Dashboard?
          </h3>
          <p className="text-purple-100 text-lg mb-8 max-w-3xl mx-auto">
            Join the waitlist for "Foundations of Fitness and Health Metrics": the complete 5-week program that teaches you to track, analyze, and optimize your health data for extraordinary longevity.
          </p>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold mb-2">5</p>
              <p className="text-sm text-purple-200">Week Program</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold mb-2">4</p>
              <p className="text-sm text-purple-200">Essential Metrics</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold mb-2">6+</p>
              <p className="text-sm text-purple-200">Years Research</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold mb-2">∞</p>
              <p className="text-sm text-purple-200">Lifelong Benefits</p>
            </div>
          </div>

          <Link 
            href="https://the.worldsfastestcentenarian.com/fitness-analytics-course" 
            className="inline-block bg-white text-purple-900 px-12 py-6 rounded-2xl hover:bg-purple-50 transition-all font-bold text-2xl shadow-2xl transform hover:scale-105"
          >
            Join the Waitlist Now
          </Link>
          
          <p className="text-sm text-purple-200 mt-6 mb-4">
            First 100 students get special launch pricing + bonus resources
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-purple-200 mt-8">
            <span>✓ Evidence-based curriculum</span>
            <span>•</span>
            <span>✓ Works with any device</span>
            <span>•</span>
            <span>✓ Practical daily tools</span>
            <span>•</span>
            <span>✓ Community support</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">A Personal Note</h2>

        <p>
          Thank you for reading this entire series. It means a lot that you invested your time to understand this system.
        </p>

        <p>
          I hope you start paying attention to your body's data. Track something, whether you join the course or not. Notice patterns. Make small adjustments based on what you learn.
        </p>

        <p>
          The journey to 100 starts with a single step. Then another. Then another.
        </p>

        <p>
          And if you want company on that journey, if you want the complete system I've built over six years of study, I'd be honored to have you in the course.
        </p>

        <p className="text-lg font-semibold text-gray-900 mt-6">
          See you at the finish line. <strong>Everyday is Race Day.</strong>
        </p>

        <p className="text-gray-600 mt-2">
          — Brand Anthony McDonald
        </p>

      </div>

      {/* Author Bio - Extended Version */}
      <div className="border-t border-gray-200 mt-12 pt-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex-shrink-0"></div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Brand Anthony McDonald</h3>
            <p className="text-gray-600 mb-4">
              NASM Certified Personal Trainer, Certified Nutrition Coach, Corrective Exercise Specialist, MBA
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              After 6+ years studying fitness science and data analytics, Brand is on a mission to become the world's fastest centenarian. He's helping his community stay healthy and active for the journey. He combines evidence based training principles with practical data tracking to make health optimization accessible to everyone.
            </p>
            <p className="text-gray-700 leading-relaxed">
              His unique background blends scientific rigor (NASM certifications) with business strategy (MBA), resulting in practical, results-driven approaches to health and fitness. He built the "Foundations of Fitness and Health Metrics" course because he wants the people he loves to be present and thriving when he breaks the centenarian speed record.
              <p><strong>He built it for you</strong>.</p>
            </p>
          </div>
        </div>
      </div>

      {/* Series Complete Navigation */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Series</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/blog/why-i-track-every-step-toward-100" className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-sm text-gray-500 mb-2">PART 1</div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Why I Track Every Step Toward 100</h4>
            <p className="text-sm text-gray-600 mb-3">The four essential metrics that changed my health journey</p>
            <span className="text-sm text-blue-600 font-semibold">Read Part 1 →</span>
          </Link>
          
          <Link href="/blog/the-intensity-minutes-that-changed-everything" className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-sm text-gray-500 mb-2">PART 2</div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">The Intensity Minutes That Changed Everything</h4>
            <p className="text-sm text-gray-600 mb-3">The most powerful longevity metric explained</p>
            <span className="text-sm text-blue-600 font-semibold">Read Part 2 →</span>
          </Link>

          <div className="border-2 border-purple-500 bg-purple-50 rounded-lg p-6">
            <div className="text-sm text-purple-600 font-semibold mb-2">PART 3 • CURRENT</div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Building a Health Dashboard for the Next 70 Years</h4>
            <p className="text-sm text-gray-600">The complete system for lifelong health optimization</p>
          </div>
        </div>

        {/* Share Series CTA */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 text-center">
          <p className="text-gray-700 mb-4">
            <strong>Found this series helpful?</strong> Share it with someone who could benefit from better health tracking.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
              Share on Twitter
            </button>
            <button className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors text-sm font-semibold">
              Share on Facebook
            </button>
            <button className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors text-sm font-semibold">
              Share on LinkedIn
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
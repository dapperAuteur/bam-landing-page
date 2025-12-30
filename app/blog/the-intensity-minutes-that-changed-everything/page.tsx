import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'The Intensity Minutes That Changed Everything | Brand Anthony McDonald',
  description: 'Understanding the single metric that predicts 50% mortality reduction and how to optimize it for your body.',
  openGraph: {
    title: 'The Intensity Minutes That Changed Everything',
    description: 'Most people track steps. Elite athletes track something far more powerful.',
    images: ['/blog/intensity-minutes-infographic.jpg'],
  },
}

export default function IntensityMinutesPost() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-12">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Blog
        </Link>
        <div className="text-sm text-purple-600 font-semibold mb-2">PART 2 OF 3</div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          The Intensity Minutes That Changed Everything
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Understanding the single metric that predicts 50% mortality reduction and how to optimize it for your body.
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <time>January 10, 2026</time>
          <span>•</span>
          <span>7 min read</span>
        </div>
      </header>

      {/* Featured Image Placeholder */}
      <div className="mb-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 text-center">
        <Link
          href="https://the.worldsfastestcentenarian.com/fitness-analytics-course" 
          className="inline-block px-6 py-3 rounded-lg hover:bg-purple-200 transition-colors font-semibold">
          <Image src={'/blog/exercise-intensity-minutes-breakdown-guide.png'} alt={'Intensity Minutes Breakdown. Intensity Minutes: The Longevity Metric. Two main cards side-by-side (moderate vs. vigorous). Progress bar showing weekly target accumulation.'}
            width={1200}
            height={900}
          />
          <p className="text-gray-600 italic">
            [Infographic: "Intensity Minutes Breakdown" + "Weekly Target Diagram"]
          </p>
        </Link>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          In my last post, I shared the four essential metrics I track on my journey to becoming the world's fastest centenarian. Today, I want to dive deep into the most powerful one: <b>intensity minutes</b>.
        </p>

        <p className=''>
          This single number changed everything for me. And the science behind it is remarkable.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">What Are Intensity Minutes?</h2>

        <p>
          Intensity minutes measure time spent exercising at a pace that makes your heart work harder than usual. Your fitness tracker counts these automatically by monitoring your heart rate.
        </p>

        <p>
          There are two types:
        </p>

        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 my-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Moderate Intensity</h3>
              <p className="text-gray-700 mb-4">
                You can talk but not sing. Your heart beats faster, but you're not gasping for air.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Brisk walking</li>
                <li>• Easy cycling</li>
                <li>• Light swimming</li>
                <li>• Casual dancing</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Vigorous Intensity</h3>
              <p className="text-gray-700 mb-4">
                You can only say a few words before needing to catch your breath. Your heart is working hard.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Running or jogging</li>
                <li>• Fast cycling</li>
                <li>• Swimming laps</li>
                <li>• Intense sports</li>
              </ul>
            </div>
          </div>
        </div>

        <p>
          Here's where it gets interesting: <strong>vigorous minutes count double.</strong> One minute of vigorous exercise equals two moderate minutes on your tracker.
        </p>

        {/* CTA 1 */}
        <div className="bg-purple-50 border-l-4 border-purple-600 p-6 my-8 rounded-r-lg">
          <p className="text-gray-800 font-semibold mb-2">
            Want to master intensity training for longevity?
          </p>
          <p className="text-gray-700 mb-4">
            Week 4 of my course is entirely focused on optimizing your intensity minutes for maximum health benefits.
          </p>
          <Link 
            href="https://the.worldsfastestcentenarian.com/fitness-analytics-course" 
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
          >
            Reserve Your Spot →
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Magic Numbers: 150 + 75</h2>

        <p>
          Through all my years of studying fitness science, one formula kept appearing: <strong>150 moderate minutes plus 75 vigorous minutes per week.</strong>
        </p>

        <p>
          This combination is linked to a 50% reduction in mortality risk. That means half the risk of dying from heart disease, diabetes, and many cancers.
        </p>

        <p>
          Think about that. <strong>Half the risk.</strong> From one simple habit pattern.
        </p>

        <div className="bg-blue-50 rounded-xl p-6 my-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Breaking Down Your Weekly Target</h3>
          
          <div className="space-y-4">
            <div>
              <p className="font-bold text-lg text-gray-900">Option 1: Moderate Focus</p>
              <p className="text-gray-700">150 moderate minutes = about 30 minutes, 5 days per week</p>
              <p className="text-sm text-gray-600 mt-1">Example: Brisk walk every weekday</p>
            </div>

            <div>
              <p className="font-bold text-lg text-gray-900">Option 2: Vigorous Focus</p>
              <p className="text-gray-700">75 vigorous minutes = about 25 minutes, 3 days per week</p>
              <p className="text-sm text-gray-600 mt-1">Example: Running Monday, Wednesday, Friday</p>
            </div>

            <div>
              <p className="font-bold text-lg text-gray-900">Option 3: Mixed Approach</p>
              <p className="text-gray-700">Combine both types throughout your week</p>
              <p className="text-sm text-gray-600 mt-1">Example: Run 2x per week (50 vigorous) + Walk 3x per week (75 moderate)</p>
            </div>
          </div>
          <div className="mb-12 bg-gradient-to-br rounded-2xl p-8 text-center">
            <Link
              href="https://the.worldsfastestcentenarian.com/fitness-analytics-course" 
              className="inline-block px-6 py-3 rounded-lg hover:bg-purple-200 transition-colors font-semibold">
              <Image src={'/blog/weekly-physical-activity-goal-options.png'} alt={'Calendar-style weekly view. Weekly Target Diagram. Weekly Intensity Target. Total: 150 moderate minutes Progress 100%. Total: 75 vigorous minutes Progress 100%.'}
                width={800}
                height={600}
              />
              <p className="text-gray-600 italic">
                [Infographic: "Vigorous + Moderate Intensity Minutes Breakdown"]
              </p>
            </Link>
          </div>
        </div>

        <p>
          The beauty is flexibility. You can hit your targets many different ways. The important part is consistency over time.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Why This Metric Matters More Than Steps</h2>

        <p>
          Don't get me wrong, steps matter. They measure general movement and activity. Intensity minutes measure something more important: <strong>cardiovascular stress.</strong>
        </p>

        <p>
          You challenge your heart and lungs when you exercise at a higher intensity. This challenge makes them stronger over time. Intensity training makes your cardiovascular system stronger like lifting weights makes muscles stronger.
        </p>

        <p>
          You could walk 15,000 steps at a leisurely pace and get minimal intensity minutes. Or you could walk briskly for 30 minutes and hit your entire daily target.
        </p>

        <p>
          Both have value. But intensity minutes pack more health benefits into less time.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">How I Discovered My Personal Pattern</h2>

        <p>
          I noticed something fascinating about my body after tracking intensity minutes for several months. My mood and energy levels followed a clear pattern based on how active I was.
        </p>

        <p>
          On weeks I hit 150+ moderate and 75+ vigorous minutes:
        </p>

        <ul className="space-y-2 my-6">
          <li>I felt better. Like a better, stronger me</li>
          <li>My sleep quality improved dramatically</li>
          <li>My resting heart rate dropped consistently</li>
          <li>My focus during work hours sharpened</li>
          <li>My recovery between workouts felt faster</li>
        </ul>

        <p>
          On weeks I fell short:
        </p>

        <ul className="space-y-2 my-6">
          <li>I felt more sluggish throughout the day</li>
          <li>My sleep became restless</li>
          <li>My resting heart rate crept up slightly</li>
          <li>I felt less motivated to train</li>
        </ul>

        <p>
          This wasn't coincidence. This was my body sending clear signals through measurable data.
        </p>

        {/* CTA 2 */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 my-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Discover Your Own Data Patterns
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            You'll learn to identify your body's unique responses to training just like I did in the "Foundations of Fitness and Health Metrics" course.
          </p>
          <Link 
            href="https://the.worldsfastestcentenarian.com/fitness-analytics-course" 
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg"
          >
            Start Your Transformation →
          </Link>
          <p className="text-sm text-gray-600 mt-4">
            5-week course • Evidence-based • Practical application
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Practical Tips for Hitting Your Targets</h2>

        <p>
          Based on my experience and certifications as a Personal Trainer, here are strategies that work:
        </p>

        <div className="space-y-6 my-8">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">1. Start Where You Are</h3>
            <p className="text-gray-700">
              If you're currently getting 50 moderate minutes per week, don't jump to 150 immediately. Add 10-15 minutes each week until you reach your goal.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">2. Make It Automatic</h3>
            <p className="text-gray-700">
              Schedule intensity sessions like appointments. Same time, same days each week. Your brain loves routine.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">3. Mix Activities You Enjoy</h3>
            <p className="text-gray-700">
              Hate running? Try swimming, cycling, dancing, or sports. Intensity comes from effort level, not specific activities.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">4. Use Interval Training</h3>
            <p className="text-gray-700">
              Alternate between moderate and vigorous periods. Walk fast for 2 minutes, jog for 1 minute, repeat. This builds fitness faster.
            </p>
          </div>

          <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">5. Track Weekly, Not Daily</h3>
            <p className="text-gray-700">
              Some days you'll do more, some less. Your body doesn't care if you hit daily targets. Weekly totals are what matter for health and longevity.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Common Mistakes to Avoid</h2>

        <p>
          I've seen these mistakes repeatedly after six years of studying and tracking intensity minutes:
        </p>

        <div className="bg-red-50 rounded-xl p-6 my-8">
          <h3 className="text-xl font-bold text-red-900 mb-4">⚠️ Don't Do These:</h3>
          
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="flex-shrink-0 text-red-600">✗</span>
              <span><strong>Going too hard too fast:</strong> This leads to injury and burnout. Build intensity gradually.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 text-red-600">✗</span>
              <span><strong>Ignoring recovery:</strong> Your body needs rest days. Plan them into your week.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 text-red-600">✗</span>
              <span><strong>Only tracking without adjusting:</strong> Data is useless if you don't respond to what it tells you.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 text-red-600">✗</span>
              <span><strong>Comparing yourself to others:</strong> Your body is unique. Your targets should match your current fitness level.</span>
            </li>
          </ul>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Long Game</h2>

        <p>
          Here's what I learned over six years of deep study: fitness isn't about short-term results. It's about building habits that sustain you for decades.
        </p>

        <p>
          I'm training to run fast at 100 years old. That means I need my cardiovascular system strong and healthy for decades. Intensity minutes are how I'm building that foundation.
        </p>

        <p>
          Every week I hit my targets, I'm investing in my future self. Every week you hit yours, you're doing the same.
        </p>

        <p>
          The research is clear: consistent intensity training doesn't just help you live longer. It helps you live <em>better</em>—with more energy, better mood, sharper thinking, and greater independence as you age.
        </p>

        {/* CTA 3 */}
        <div className="bg-gray-900 text-white rounded-2xl p-8 my-12 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Build Your Longevity Foundation?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join the waitlist for my complete 5-week course on fitness data analytics. Learn the exact system I use to track, analyze, and optimize for extraordinary health.
          </p>
          <Link 
            href="https://the.worldsfastestcentenarian.com/fitness-analytics-course" 
            className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg"
          >
            Get Early Access →
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            Part of the World's Fastest Centenarian specialization
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">What's Next</h2>

        <p>
          You now understand the most powerful metric for longevity: intensity minutes. You know the targets. You know why they matter.
        </p>

        <p>
          In my final post of this series, I'll show you the complete system I built to manage all four metrics together. We'll look at the big picture. We'll learn how to create a personal health dashboard that works for decades, not just weeks.
        </p>

        <p>
          Because tracking intensity minutes is powerful. But tracking intensity minutes <em>plus</em> resting heart rate, sleep quality, and daily movement? That's when you unlock your body's full optimization potential.
        </p>

        <p className="text-xl font-semibold text-gray-900 mt-8">
          Start tracking your intensity minutes this week. Watch what happens.
        </p>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8 my-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Don't Miss Part 3
              </h3>
              <p className="text-gray-700">
                Next week: The complete health dashboard system for the next 70 years. Plus, why I built this entire course for my community.
              </p>
            </div>
            <Link 
              href="https://the.worldsfastestcentenarian.com/fitness-analytics-course" 
              className="flex-shrink-0 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Join Waitlist →
            </Link>
          </div>
        </div>

      </div>

      {/* Author Bio */}
      <div className="border-t border-gray-200 mt-12 pt-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex-shrink-0"></div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Brand Anthony McDonald</h3>
            <p className="text-gray-600 mb-4">
              NASM Certified Personal Trainer, Certified Nutrition Coach, Corrective Exercise Specialist, MBA
            </p>
            <p className="text-gray-700 leading-relaxed">
              After 6+ years studying fitness science and data analytics, Brand is on a mission to become the world's fastest centenarian. He's on a mission help his community stay healthy and active for the journey. He combines evidence based training principles with practical data tracking to make health optimization accessible to everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Series Navigation */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">This Series</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/blog/why-i-track-every-step-toward-100" className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="text-sm text-gray-500 mb-2">PART 1</div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Why I Track Every Step Toward 100</h4>
            <p className="text-sm text-gray-600">The four essential metrics that changed my health journey</p>
          </Link>
          <div className="border-2 border-purple-500 bg-purple-50 rounded-lg p-6">
            <div className="text-sm text-purple-600 font-semibold mb-2">PART 2 • CURRENT</div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">The Intensity Minutes That Changed Everything</h4>
            <p className="text-sm text-gray-600">The most powerful longevity metric explained</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6 opacity-60">
            <div className="text-sm text-gray-500 mb-2">PART 3 • COMING JAN 25</div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Building a Health Dashboard for the Next 70 Years</h4>
            <p className="text-sm text-gray-600">The complete system for lifelong health optimization</p>
          </div>
        </div>
      </div>
    </article>
  )
}
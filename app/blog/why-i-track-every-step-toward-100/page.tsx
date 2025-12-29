import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Why I Track Every Step Toward 100 | Brand Anthony McDonald',
  description: 'How discovering 4 simple metrics changed my path to becoming the world\'s fastest centenarian—and how they can transform your health too.',
  openGraph: {
    title: 'Why I Track Every Step Toward 100',
    description: 'Six years of study led me to one truth: the data your body produces daily holds the key to extraordinary aging.',
    images: ['/blog/your-body-speaks-through-data.png'],
  },
}

export default function WhyITrackPost() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-12">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Why I Track Every Step Toward 100
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          How discovering 4 simple metrics changed my path to becoming the world's fastest centenarian. How they can transform your health too.
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <time>December 29, 2025</time>
          <span>•</span>
          <span>4 min read</span>
        </div>
      </header>

      {/* Featured Image Placeholder */}
      <div className="mb-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 text-center">
        <Link 
            href="https://the.worldsfastestcentenarian.com/fitness-analytics-course" 
            className="inline-block px-6 py-3 rounded-lg hover:bg-purple-200 transition-colors font-semibold"
          >
        <Image 
          src="/blog/your-body-speaks-through-data.png" alt={'Before vs. After Tracking Comparison'}
          width={1200}
          height={800}
          className="mx-auto"
          />
        <p className="text-gray-600 italic">
          [Infographic: "Before vs. After Tracking" comparison]
        </p>
        </Link>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          Six years ago, I made a decision that changed everything. I decided wanting to be the world's fastest centenarian (the fastest person over 100 years old to run 100 meters) was enough. {/** I needed to understand what it takes to get there. Making it to the race is the hardest part.*/}
        </p>

        <p>
          But here's the thing: I couldn't just wish my way there. I needed a plan. A real plan built on real data.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Problem With Guessing</h2>

        <p>
          For years, I thought I understood my body. I exercised regularly. I tried to eat well. I felt pretty healthy.
        </p>

        <p>
          But I was guessing. And guessing doesn't get you to 100 years old, let alone running fast at 100.
        </p>

        <p>
          I started studying fitness science seriously. Not just reading articles, but diving deep into research. I earned my certifications as a Personal Trainer, Nutrition Coach, and Corrective Exercise Specialist through the National Academy of Sports Medicine. I spent over six years learning how the body really works.
        </p>

        <p>
          And one truth became crystal clear: <strong>your body is constantly sending you messages through data.</strong>
        </p>

        {/* CTA 1 - Soft Introduction */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8 rounded-r-lg">
          <p className="text-gray-800 font-semibold mb-2">
            Want to learn the complete system I built for tracking health data?
          </p>
          <p className="text-gray-700 mb-4">
            I created a 5-week course that teaches everything I learned about turning your body's data into daily health decisions.
          </p>
          <Link 
            href="https://the.worldsfastestcentenarian.com/fitness-analytics-course" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Get Early Access →
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The 4 Numbers That Changed My Life</h2>

        <p>
          After all that studying, I discovered something surprising. You don't need to track dozens of metrics. You just need one. Here are four essential ones to choose from:
        </p>

        <div className="bg-gray-50 rounded-xl p-6 my-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Body's Dashboard</h3>
          
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-bold text-lg text-gray-900">1. Resting Heart Rate</h4>
              <p className="text-gray-700">
                Your heart's baseline speed. Lower is usually better. It shows how efficiently your heart works.
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-bold text-lg text-gray-900">2. Daily Steps</h4>
              <p className="text-gray-700">
                Simple but powerful. Movement keeps your body working well. Aim for at least 7,000 steps daily.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-bold text-lg text-gray-900">3. Intensity Minutes</h4>
              <p className="text-gray-700">
                Time spent exercising at moderate to vigorous intensity. This is the most important metric for living longer.</p>
                <p><b>*My Favorite*</b>.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-bold text-lg text-gray-900">4. Sleep Quality</h4>
              <p className="text-gray-700">
                How well you sleep affects everything else. Good sleep helps your body recover and stay healthy.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Why This Matters For You</h2>

        <p>
          I didn't build this system just for myself. I built it because I want the people I love to be there when I break that centenarian record.
        </p>

        <p>
          My friends. My family. My community. I want them healthy, active, and present for decades to come. I'm challenging them to break the record after me!
        </p>

        <p>
          That's why I'm sharing everything I learned. Because tracking these four simple numbers can completely change how you think about your health.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">What Tracking Actually Looks Like</h2>

        <p>
          Here's the good news: you probably already own the tools you need. A basic fitness tracker or smartwatch can measure all four of these metrics.
        </p>

        <p>
          You don't need expensive equipment. You don't need a medical degree. You just need to pay attention to what your body is already telling you.
        </p>

        <p>
          Once you start tracking, patterns emerge. You notice things like:
        </p>

        <ul className="space-y-2 my-6">
          <li>Your resting heart rate drops when you exercise regularly</li>
          <li>You sleep better on days you hit your step goals</li>
          <li>Your mood improves when you get enough intensity minutes</li>
          <li>Your energy levels connect directly to your sleep quality</li>
        </ul>

        <p>
          These aren't random feelings. They're real connections you can measure and improve.
        </p>

        {/* CTA 2 - Stronger Call to Action */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 my-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Your Own Health Transformation?
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Join the waitlist for "Foundations of Fitness and Health Metrics" a 5-week course where you'll learn exactly how to track, analyze, and improve these four essential numbers.
          </p>
          <Link 
            href="https://the.worldsfastestcentenarian.com/fitness-analytics-course" 
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-bold text-lg shadow-lg"
          >
            Start Your Transformation →
          </Link>
          <p className="text-sm text-gray-600 mt-4">
            Part of the World's Fastest Centenarian specialization
          </p>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">The Simple Truth</h2>

        <p>
          Getting healthier doesn't have to be complicated. You don't need to count every calorie or run marathons. You don't need to become obsessed with fitness.
        </p>

        <p>
          You just need to understand your body's language. Your body speaks through data.
        </p>

        <p>
          These four metrics: resting heart rate, daily steps, intensity minutes, and sleep quality are the foundation. They tell you what's working and what needs to change.
        </p>

        <p>
          In my next post, I'll dive deeper into the single most powerful metric I discovered: intensity minutes. This one number predicts longevity better than almost anything else scientists have found.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Start Today</h2>

        <p>
          If you have a fitness tracker, check those four numbers tonight. Choose ONE to track. Write it down. That's your baseline.
        </p>

        <p>
          If you don't have a tracker yet, that's okay. Start by noticing how you feel. Notice your energy. Notice your sleep. Notice when you move more versus less.
        </p>

        <p>
          Awareness is the first step. Tracking is the second. Improvement is inevitable once you're paying attention.
        </p>

        <p className="text-xl font-semibold text-gray-900 mt-8 text-center">
          I'm tracking every step toward 100.</p>
          <p className="text-xl font-semibold text-gray-900 mt-8 text-center">I want you there with me.
        </p>

        {/* Final CTA */}
        <div className="bg-gray-900 text-white rounded-2xl p-8 my-12 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Don't Miss Part 2 of This Series
          </h3>
          <p className="text-gray-300 mb-6">
            In two weeks, I'll reveal the intensity minutes breakthrough that changed how I train and how it can add decades to your life.
          </p>
          <Link 
            href="https://the.worldsfastestcentenarian.com/fitness-analytics-course" 
            className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg"
          >
            Join the Waitlist Now →
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            Be the first to know when the course launches
          </p>
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
              After 6+ years studying fitness science and data analytics, Brand is on a mission to become the world's fastest centenarian. He's helping his community stay healthy and active for the journey. He combines evidence based training principles with practical data tracking to make health optimization accessible to everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Coming Next in This Series</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h4 className="text-xl font-bold text-gray-900 mb-2">Part 2: The Intensity Minutes That Changed Everything</h4>
            <p className="text-gray-600 mb-4">
              Discover the single metric that predicts 50% mortality reduction and how to optimize it for your body.
            </p>
            <p className="text-sm text-gray-500">Coming January 10, 2026</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h4 className="text-xl font-bold text-gray-900 mb-2">Part 3: Building a Health Dashboard for the Next 70 Years</h4>
            <p className="text-gray-600 mb-4">
              The complete system for transforming health data into daily decisions designed for decades of vitality.
            </p>
            <p className="text-sm text-gray-500">Coming January 25, 2026</p>
          </div>
        </div>
      </div>
    </article>
  )
}
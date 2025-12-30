// app/blog/body-dashboard-fitness-metrics-series-part-1/page.tsx

import Link from "next/link"

const COURSE_URL = "https://fitness-data-analytics-course-lp.thecalisthenics.com"

export default function BodyDashboardPart1Page() {
  return (
    <main className="prose mx-auto max-w-3xl py-8">
      <header>
        <p className="text-sm text-gray-500">Health &amp; Data · Series</p>
        <h1>Your Body’s Dashboard: Part 1 of 3</h1>
        <p className="text-gray-600">
          Learn a simple way to read your body’s numbers so you can make clearer day‑to‑day choices.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={COURSE_URL}
            className="inline-block rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Turn Your Health Data Into Your Longevity Advantage
          </a>
          <a
            href={COURSE_URL}
            className="inline-block rounded border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600"
          >
            Join the Waitlist for Foundations
          </a>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          This is Part 1 in a 3‑part series on using fitness and health metrics.
        </p>
      </header>

      <article className="mt-8 space-y-6">
        <section>
          <h2>Your body already has a dashboard</h2>
          <p>
            You already look at numbers every day. Steps. Heart rate. Sleep. But has anyone ever
            taught you how to read those numbers?
          </p>
          <p>
            Most people never learn how to read their body’s “dashboard.” They see the lights blink,
            but they do not know what the signals mean.
          </p>
          <p>
            This 3‑part series will show you a simple way to use your own data. This is Part 1:
            Your Body’s Dashboard.
          </p>
        </section>

        <section>
          <h2>A simple 3‑step playbook</h2>
          <p>You do not need to be good at math to use your data. You only need a small playbook.</p>
          <ol>
            <li>
              <strong>Notice your numbers.</strong> Pick one or two numbers you already track, like
              steps and sleep.
            </li>
            <li>
              <strong>Give each number a job.</strong> Ask, “What is this number trying to tell
              me?”
            </li>
            <li>
              <strong>Check one signal at a time.</strong> Focus on one number this week instead of
              trying to fix everything.
            </li>
          </ol>
        </section>

        <section>
          <h2>Try this this week</h2>
          <div className="rounded border border-gray-200 bg-gray-50 p-4">
            <p className="font-semibold">A tiny 7‑day experiment:</p>
            <ol className="mt-2 list-decimal pl-5">
              <li>Pick 1 number you already see on your watch or phone.</li>
              <li>Write down what question it answers for you.</li>
              <li>Watch that number for 7 days.</li>
              <li>Write one sentence about what you noticed.</li>
            </ol>
          </div>
        </section>

        <section>
          <h2>Inside the Foundations course</h2>
          <p>
            The Foundations of Fitness and Health Metrics course gives you a clear, five‑week path
            for reading your body’s dashboard.
          </p>
          <ul>
            <li>
              <strong>Week 1:</strong> Foundations of Fitness and Health Metrics.
            </li>
            <li>
              <strong>Week 2:</strong> Wearable Technology &amp; Data Collection.
            </li>
            <li>
              <strong>Week 3:</strong> Data Analytics Basics.
            </li>
            <li>
              <strong>Week 4:</strong> Intensity Minutes as a Longevity Metric.
            </li>
            <li>
              <strong>Week 5:</strong> Long‑Term Health Trends &amp; Sustained Improvement.
            </li>
          </ul>

          <div className="mt-4">
            <a
              href={COURSE_URL}
              className="inline-block rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Start Your Centenarian Journey Today
            </a>
          </div>
        </section>

        <section>
          <h2>Part of a three‑course path</h2>
          <p>This class is one part of a complete three‑course learning path:</p>
          <ul>
            <li>
              <strong>Course 1: Foundations of Fitness and Health Metrics.</strong> Learn to read
              your body’s dashboard and basic numbers.
            </li>
            <li>
              <strong>Course 2: Intervention Design.</strong> Turn data into action with science‑
              based plans and personal experiments.
            </li>
            <li>
              <strong>Course 3: Open Science.</strong> Work with a community on shared questions and
              group data.
            </li>
          </ul>
        </section>

        <section>
          <h2>About the creator</h2>
          <p>
            This course series was created by Brand Anthony McDonald, a National Academy of Sports
            Medicine Certified Personal Trainer, Certified Nutrition Coach, and Corrective Exercise
            Specialist. He has studied fitness and health for over six years and also holds an MBA,
            which helps him blend clear thinking, data, and real‑world coaching.
          </p>
        </section>

        <section>
          <h2>Share this post</h2>
          <p>Know someone who tracks their health but feels lost? Share this with them.</p>
        </section>
      </article>
    </main>
  )
}

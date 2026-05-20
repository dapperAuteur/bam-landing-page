'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default function NaturalShortSleepPost() {
  const sleepHoursChartRef = useRef<HTMLCanvasElement | null>(null)
  const sleepHoursChartInstance = useRef<Chart | null>(null)
  const timelineChartRef = useRef<HTMLCanvasElement | null>(null)
  const timelineChartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!sleepHoursChartRef.current) return
    const ctx = sleepHoursChartRef.current.getContext('2d')
    if (!ctx) return

    sleepHoursChartInstance.current?.destroy()
    sleepHoursChartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Typical adult (CDC guidance)',
          'Natural short sleeper (measured)',
          'Some short sleepers (self-report)',
        ],
        datasets: [
          {
            label: 'Hours of sleep per night',
            data: [8, 6.3, 4],
            backgroundColor: [
              'rgba(99, 102, 241, 0.65)',
              'rgba(168, 85, 247, 0.65)',
              'rgba(236, 72, 153, 0.65)',
            ],
            borderColor: ['#6366f1', '#a855f7', '#ec4899'],
            borderWidth: 2,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            beginAtZero: true,
            max: 10,
            title: { display: true, text: 'Hours of sleep per night' },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.x} hours`,
            },
          },
        },
      },
    })

    return () => {
      sleepHoursChartInstance.current?.destroy()
      sleepHoursChartInstance.current = null
    }
  }, [])

  useEffect(() => {
    if (!timelineChartRef.current) return
    const ctx = timelineChartRef.current.getContext('2d')
    if (!ctx) return

    const genes = [
      { gene: 'DEC2', year: 2009, color: '#6366f1' },
      { gene: 'ADRB1', year: 2019, color: '#8b5cf6' },
      { gene: 'NPSR1', year: 2019.4, color: '#a855f7' },
      { gene: 'GRM1', year: 2020, color: '#d946ef' },
      { gene: 'SIK3-N783Y', year: 2025, color: '#ec4899' },
    ]

    timelineChartInstance.current?.destroy()
    timelineChartInstance.current = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: genes.map((g) => ({
          label: g.gene,
          data: [{ x: g.year, y: 1 }],
          backgroundColor: g.color,
          borderColor: g.color,
          pointRadius: 12,
          pointHoverRadius: 14,
          pointStyle: 'circle',
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'linear',
            min: 2008,
            max: 2026,
            ticks: {
              stepSize: 1,
              callback: (value) => String(Math.round(Number(value))),
            },
            title: { display: true, text: 'Year the gene was identified' },
          },
          y: {
            display: false,
            min: 0,
            max: 2,
          },
        },
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const gene = genes[context.datasetIndex]
                return `${gene.gene} (${Math.round(gene.year)})`
              },
            },
          },
        },
      },
    })

    return () => {
      timelineChartInstance.current?.destroy()
      timelineChartInstance.current = null
    }
  }, [])

  const cite = (id: string, text: string) => (
    <a
      href={`#bib-${id}`}
      className="text-blue-600 hover:text-blue-800 hover:underline underline-offset-2"
    >
      {text}
    </a>
  )

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <Link
          href="/blog"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Blog
        </Link>
        <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">
          Health &amp; Longevity · Sleep Science
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Why Some People Sleep Less and Still Feel Great
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          A tiny group of people only need about 4 to 6 hours of sleep. They
          wake up rested. They live long, healthy lives. Scientists have found
          genes that may explain why, and the research could one day teach the
          rest of us how to sleep better.
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <time dateTime="2026-05-20">May 20, 2026</time>
          <span>•</span>
          <span>8 min read</span>
          <span>•</span>
          <span>By Brand Anthony McDonald</span>
        </div>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          What is a natural short sleeper?
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Most grown-ups need about 8 hours of sleep each night. But not
          everyone does. A small number of people feel just fine on much
          less. They might sleep only 4 to 6 hours and still have great
          days. Scientists call these people <strong>natural short
          sleepers</strong>{' '}
          {cite('chen2025', '(Chen et al., 2025)')}.
        </p>
        <p className="text-gray-700 leading-relaxed">
          This is not the same as being tired. Natural short sleepers wake
          up rested. They don&apos;t yawn through their day. They don&apos;t
          need naps. Their bodies just need less sleep than the rest of
          us {cite('he2009', '(He et al., 2009)')}.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Two very different kinds of &ldquo;less sleep&rdquo;
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Sleeping less is not always healthy. There are two very
          different kinds:
        </p>
        <ul className="list-disc pl-6 space-y-3 text-gray-700 leading-relaxed mb-4">
          <li>
            <strong className="text-gray-900">Insomnia.</strong> Insomnia
            is a sleep problem. People with insomnia <em>want</em> to
            sleep, but their body won&apos;t let them. They feel tired
            during the day. Over time, it hurts their health.
          </li>
          <li>
            <strong className="text-gray-900">Natural short sleep.</strong>{' '}
            This is rare. It is built into a person&apos;s genes. The
            body fully rests in fewer hours. The person feels great
            {' '}
            {cite('he2009', '(He et al., 2009)')}
            {' '}
            {cite('shi2019', '(Shi et al., 2019)')}.
          </li>
        </ul>
        <p className="text-gray-700 leading-relaxed">
          One is a problem. The other is just how someone&apos;s body
          works.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          How rare is it?
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Scientists think only about 1 to 3 people out of every 100
          are <em>true</em> natural short sleepers
          {' '}
          {cite('aasm', '(Watson et al., 2015)')}. That is not many.
          Most people who say they &ldquo;only need 4 hours&rdquo; are
          actually short on rest. Their bodies are just used to feeling
          tired.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Real natural short sleepers can be tested. Doctors put a small
          tracker on their wrist for a week. The tracker measures how
          much they really sleep. Doctors also check how the person
          feels and thinks during the day. In one new study, a woman
          said she slept only 3 hours, but the tracker showed she
          actually slept about 6.3 hours
          {' '}
          {cite('chen2025', '(Chen et al., 2025)')}.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Graph 1: How sleep hours compare
        </h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          The chart below shows three numbers: how much sleep most
          adults need, how much a measured natural short sleeper
          actually got, and how little some people <em>claim</em> they
          sleep.
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="h-80 md:h-96">
            <canvas ref={sleepHoursChartRef} aria-label="Bar chart comparing recommended adult sleep, measured short-sleeper hours, and self-reported short sleep" role="img" />
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Sources: CDC sleep guidance
            {' '}
            {cite('cdc', '(CDC, 2024)')};
            {' '}
            actigraphy measurement from
            {' '}
            {cite('chen2025', 'Chen et al. (2025)')}.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          The five genes scientists have found
        </h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Genes are tiny instructions in your cells. They tell your
          body how to grow, look, and act. Some people have small
          changes in their genes that make them need less sleep. So
          far, scientists have found <strong>five</strong> of these
          gene changes.
        </p>

        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              DEC2 (found in 2009)
            </h3>
            <p className="text-gray-700 leading-relaxed">
              The first short-sleep gene. Scientists studied a mom
              and her daughter. Both slept about 6 hours and felt
              fine. The team looked at their DNA and found one
              tiny change in a gene called DEC2. The change was
              passed from mom to daughter. DEC2 helps tell the body
              when to sleep
              {' '}
              {cite('he2009', '(He et al., 2009)')}.
            </p>
          </div>

          <div className="bg-violet-50 border border-violet-200 rounded-lg p-5">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              ADRB1 (found in 2019)
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Ten years later, the same team found a second gene
              in a different family. They called it ADRB1. The
              change in ADRB1 makes a part of the brainstem more
              &ldquo;awake-ready,&rdquo; so the body needs less
              sleep to feel rested
              {' '}
              {cite('shi2019', '(Shi et al., 2019)')}.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              NPSR1 (found in 2019)
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Later in 2019, scientists found a third gene called
              NPSR1. This one is special. It seems to help with
              sleep <em>and</em> memory. In mice with the same
              change, the mice slept less but still remembered
              things just as well
              {' '}
              {cite('xing2019', '(Xing et al., 2019)')}.
            </p>
          </div>

          <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-lg p-5">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              GRM1 (found in 2020)
            </h3>
            <p className="text-gray-700 leading-relaxed">
              The fourth gene change is in GRM1. It was found in
              two different families of short sleepers. People in
              one family slept only about 5 to 6 hours, while their
              relatives who did not have the gene change slept the
              normal 7 to 8 hours
              {' '}
              {cite('shi2020', '(Shi et al., 2020)')}.
            </p>
          </div>

          <div className="bg-pink-50 border border-pink-200 rounded-lg p-5">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              SIK3-N783Y (found in 2025)
            </h3>
            <p className="text-gray-700 leading-relaxed">
              The newest discovery. SIK3 is a gene that helps the
              brain build up the &ldquo;need&rdquo; for sleep. A
              tiny change in SIK3, called SIK3-N783Y, was found
              in a healthy 70-year-old woman who slept very
              little
              {' '}
              {cite('chen2025', '(Chen et al., 2025)')}.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Graph 2: A timeline of gene discoveries
        </h2>
        <p className="text-gray-700 leading-relaxed mb-6">
          Each dot on the timeline below is one short-sleep gene
          and the year scientists figured it out. Notice how more
          discoveries are happening as DNA tools get better.
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="h-72 md:h-80">
            <canvas
              ref={timelineChartRef}
              aria-label="Timeline scatter chart showing when each natural short-sleep gene was first identified, from DEC2 in 2009 to SIK3-N783Y in 2025"
              role="img"
            />
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Sources:
            {' '}
            {cite('he2009', 'He et al. (2009)')},
            {' '}
            {cite('shi2019', 'Shi et al. (2019)')},
            {' '}
            {cite('xing2019', 'Xing et al. (2019)')},
            {' '}
            {cite('shi2020', 'Shi et al. (2020)')},
            {' '}
            {cite('chen2025', 'Chen et al. (2025)')}.
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          A closer look at the newest study
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The 2025 study began with a healthy 70-year-old woman.
          She said she had slept only 3 hours a night for most of
          her life. She had no memory problems. She had no health
          problems. Doctors tested her sleep with a wrist tracker
          for a week. The tracker showed she really got about
          6.3 hours of sleep each night. That was more than she thought,
          but still less than most adults
          {' '}
          {cite('chen2025', '(Chen et al., 2025)')}.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          Scientists looked at her DNA and found a small change
          in a gene called SIK3. To make sure the gene change was
          really the cause, they made mice with the very same
          change. Those mice slept less than normal mice. And
          here is the surprising part: the mice&apos;s deep-sleep
          brain waves were <em>stronger</em> than normal
          mice&apos;s.
        </p>
        <p className="text-gray-700 leading-relaxed">
          That means: <strong>less sleep, but
          higher-quality sleep</strong>. The body packs more
          rest into fewer hours
          {' '}
          {cite('chen2025', '(Chen et al., 2025)')}.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          What this could mean for the rest of us
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Right now, scientists cannot change your DNA. So you
          cannot &ldquo;give yourself&rdquo; the gene change.
          But the discovery may still help people sleep
          <em> better</em>.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          If a future medicine could copy what these gene
          changes do, people might rest more deeply in fewer
          hours. They might wake up feeling more rested. They
          might have more energy for the rest of their day
          {' '}
          {cite('chen2025', '(Chen et al., 2025)')}
          {' '}
          {cite('funato2016', '(Funato et al., 2016)')}.
        </p>
        <p className="text-gray-700 leading-relaxed">
          This may also help with healthy aging. Deep sleep is
          when the brain cleans itself. Better sleep over a
          lifetime could mean a healthier brain.
        </p>
      </section>

      <section className="mb-12">
        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            ⚠️ A safety note
          </h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            <strong>Most adults need 7 to 9 hours of
            sleep</strong>
            {' '}
            {cite('cdc', '(CDC, 2024)')}
            {' '}
            {cite('aasm', '(Watson et al., 2015)')}. Natural
            short sleep runs in families. You cannot train
            yourself into it.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you cut your sleep without the right genes,
            you&apos;ll feel awful. You&apos;ll think slower.
            You&apos;ll feel sad more often. You&apos;ll get
            sick more easily. If you feel tired during the day,
            your body probably needs <em>more</em> sleep, not
            less.
          </p>
        </div>
      </section>

      <section id="bibliography" className="mt-16 pt-10 border-t border-gray-200">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Bibliography
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          All sources are peer-reviewed primary research or
          authoritative public health bodies. Links open in a
          new tab.
        </p>
        <ol className="space-y-4 text-gray-700 text-sm leading-relaxed">
          <li id="bib-chen2025">
            Chen, A., Wu, H., Zhang, S., Shi, G., Xu, Y., Zhang,
            L., Fu, Y.-H., &amp; Ptáček, L. J. (2025). The
            SIK3-N783Y mutation is associated with the human
            natural short sleep trait.{' '}
            <em>Proceedings of the National Academy of Sciences,
            122</em>(19), e2500356122.{' '}
            <a
              href="https://www.pnas.org/doi/10.1073/pnas.2500356122"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              https://www.pnas.org/doi/10.1073/pnas.2500356122
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </li>

          <li id="bib-he2009">
            He, Y., Jones, C. R., Fujiki, N., Xu, Y., Guo, B.,
            Holder, J. L., Rossner, M. J., Nishino, S., &amp;
            Fu, Y.-H. (2009). The transcriptional repressor
            DEC2 regulates sleep length in mammals.{' '}
            <em>Science, 325</em>(5942), 866–870.{' '}
            <a
              href="https://www.science.org/doi/10.1126/science.1174443"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              https://www.science.org/doi/10.1126/science.1174443
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </li>

          <li id="bib-shi2019">
            Shi, G., Xing, L., Liu, Z., Qu, Z., Wu, X., Dong,
            Z., Wang, X., Gao, X., Huang, M., Yan, J., Yang,
            L., Liu, Y., Ptáček, L. J., &amp; Fu, Y.-H. (2019).
            A rare mutation of β1-adrenergic receptor affects
            sleep/wake behaviors.{' '}
            <em>Neuron, 103</em>(6), 1044–1055.e7.{' '}
            <a
              href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6763376/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              https://pmc.ncbi.nlm.nih.gov/articles/PMC6763376/
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </li>

          <li id="bib-xing2019">
            Xing, L., Shi, G., Mostovoy, Y., Gentry, N. W.,
            Fan, Z., McMahon, T. B., Kwok, P.-Y., Jones, C. R.,
            Ptáček, L. J., &amp; Fu, Y.-H. (2019). Mutant
            neuropeptide S receptor reduces sleep duration with
            preserved memory consolidation.{' '}
            <em>Science Translational Medicine, 11</em>(514),
            eaax2014.{' '}
            <a
              href="https://www.science.org/doi/10.1126/scitranslmed.aax2014"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              https://www.science.org/doi/10.1126/scitranslmed.aax2014
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </li>

          <li id="bib-shi2020">
            Shi, G., Yin, C., Fan, Z., Xing, L., Mostovoy, Y.,
            Kwok, P.-Y., Ashbrook, L. H., Krystal, A. D., Ptáček,
            L. J., &amp; Fu, Y.-H. (2020). Mutations in
            metabotropic glutamate receptor 1 contribute to
            natural short sleep trait.{' '}
            <em>Current Biology, 31</em>(1), 13–24.e4.{' '}
            <a
              href="https://www.cell.com/current-biology/fulltext/S0960-9822(20)31441-X"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              https://www.cell.com/current-biology/fulltext/S0960-9822(20)31441-X
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </li>

          <li id="bib-funato2016">
            Funato, H., Miyoshi, C., Fujiyama, T., Kanda, T.,
            Sato, M., Wang, Z., Ma, J., Nakane, S., Tomita, J.,
            Ikkyu, A., Kakizaki, M., Hotta-Hirashima, N.,
            Kanno, S., Komiya, H., Asano, F., Honda, T.,
            Kim, S. J., Harano, K., Muramoto, H., …
            Yanagisawa, M. (2016). Forward-genetics analysis
            of sleep in randomly mutagenized mice.{' '}
            <em>Nature, 539</em>, 378–383.{' '}
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/27074515/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              https://pubmed.ncbi.nlm.nih.gov/27074515/
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </li>

          <li id="bib-cdc">
            Centers for Disease Control and Prevention. (2024).{' '}
            <em>About sleep</em>.{' '}
            <a
              href="https://www.cdc.gov/sleep/about/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              https://www.cdc.gov/sleep/about/index.html
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </li>

          <li id="bib-aasm">
            Watson, N. F., Badr, M. S., Belenky, G., Bliwise,
            D. L., Buxton, O. M., Buysse, D., Dinges, D. F.,
            Gangwisch, J., Grandner, M. A., Kushida, C.,
            Malhotra, R. K., Martin, J. L., Patel, S. R.,
            Quan, S. F., &amp; Tasali, E. (2015). Recommended
            amount of sleep for a healthy adult: A joint
            consensus statement of the American Academy of
            Sleep Medicine and Sleep Research Society.{' '}
            <em>Sleep, 38</em>(6), 843–844.{' '}
            <a
              href="https://aasm.org/recommended-amount-sleep-healthy-adult-aasm-srs/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              https://aasm.org/recommended-amount-sleep-healthy-adult-aasm-srs/
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </li>
        </ol>
      </section>

      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to All Stories
        </Link>
      </div>
    </article>
  )
}

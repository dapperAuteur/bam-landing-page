import Link from 'next/link'
import { YouTubeEmbed } from '@/components/blog/YouTubeEmbed'

export const metadata = {
  title: 'Penn Relays 2026: What the Masters 50+ Sprints (and Relays) Just Showed Me | Brand Anthony McDonald',
  description:
    'A breakdown of the 100m and sprint-relay finals across the Masters 50+ age groups at Penn Relays 2026 — every place, every time, every club, plus what those splits sketch about the road to a sub-26 M100.',
  openGraph: {
    title: 'Penn Relays 2026: Masters 50+ Sprint Recap',
    description:
      "I'm chasing the world's-fastest-centenarian goal. The Masters 50+ field at this year's Penn Relays just showed me 50 years of preview footage.",
    images: ['/blog/your-body-speaks-through-data.png'],
  },
}

type Result = {
  place: string
  athlete: string
  club: string
  time: string
  note?: string
}

type RelayResult = {
  place: string
  team: string
  time: string
  runners: string
}

const M50_100m: Result[] = [
  { place: '1', athlete: 'Adeniran Epebinuade', club: 'Unite4', time: '11.89' },
  { place: '2', athlete: 'Shawn Talley', club: 'Unite4', time: '12.21' },
  { place: '3', athlete: 'Dan Esposito', club: 'Greater Philadelphia TC', time: '12.79' },
  { place: '4', athlete: 'David Marx', club: 'Central Park Track Club', time: '12.90' },
  { place: '5', athlete: 'Kevin Bowen', club: 'Pony Express', time: '13.29' },
  { place: '6', athlete: 'Martin Franke', club: 'Martin Franke', time: '14.27' },
  { place: '7', athlete: 'Michael Jones', club: 'Unattached', time: '18.24' },
  { place: '8', athlete: 'Roderick Day', club: 'Roderick', time: '19.11' },
]

const M60_100m: Result[] = [
  { place: '1', athlete: 'David Gibbon', club: 'Southwest Sprinters', time: '11.94' },
  { place: '2', athlete: 'Tony Clemons', club: 'Trojan Masters Track Club', time: '12.55' },
  { place: '3', athlete: 'Zac Tolin', club: 'Zac Tolin', time: '13.42' },
  { place: '4', athlete: 'Benjamin Cureton', club: 'Benjamin Cureton', time: '13.69' },
  { place: '5', athlete: 'Gerald Mitchell', club: 'Pony Express', time: '13.70' },
  { place: '6', athlete: 'Harris Gibson', club: 'Greater Philadelphia TC', time: '14.03' },
  { place: '7', athlete: 'Michael Donnelly', club: 'Greater Philadelphia TC', time: '14.27' },
  { place: '8', athlete: 'Curtis Muhammad', club: 'Unattached', time: '14.81' },
  { place: '9', athlete: 'Bruce Williams', club: 'Bruce Williams', time: '15.39' },
]

const M65_100m: Result[] = [
  { place: '1', athlete: 'Tony Fulton Sr', club: 'Unattached', time: '12.99' },
  { place: '2', athlete: 'Ronald Humphrey', club: 'Ronald Humphrey', time: '13.02' },
  { place: '3', athlete: 'David Neumann', club: 'Mass Velocity TC', time: '13.25', note: '13.243' },
  { place: '4', athlete: 'Brian Hankerson', club: 'Brian Hankerson', time: '13.25', note: '13.246' },
  { place: '5', athlete: 'Don Mcgee', club: 'Potomac Valley Track Club', time: '13.59' },
  { place: '6', athlete: 'Willie Spruill', club: 'Pony Express', time: '13.66' },
  { place: '7', athlete: 'Brian Thomas', club: 'Brian Thomas', time: '14.97' },
  { place: 'T8', athlete: 'Lewis Wigod', club: 'Unattached', time: '16.14', note: '16.134' },
  { place: 'T8', athlete: 'Charles Roth', club: 'Unattached', time: '16.14', note: '16.134' },
]

const M70_100m: Result[] = [
  { place: '1', athlete: 'Michael Kiefer', club: 'Mass Velocity', time: '14.03' },
  { place: '2', athlete: 'Steven Phillips', club: 'Houston Elite', time: '14.34' },
  { place: '3', athlete: 'Griffin Lotson', club: 'N/A', time: '14.48' },
  { place: '4', athlete: 'Paul Brock', club: 'Greater Philadelphia TC', time: '14.78' },
  { place: '5', athlete: 'Richard Kalriess', club: 'N/A', time: '15.22' },
  { place: '6', athlete: 'Michael Jennetta', club: 'Greater Philadelphia TC', time: '15.50' },
  { place: '7', athlete: 'Spider Rossiter', club: 'Shore AC', time: '16.25' },
  { place: '8', athlete: 'Guy Delillio', club: 'Greater Philadelphia TC', time: '16.63' },
]

const M75_100m: Result[] = [
  { place: '1', athlete: 'Michael Kish', club: 'Houston Elite', time: '13.27' },
  { place: '2', athlete: 'Don Warren', club: 'Don Warren', time: '14.50' },
  { place: '3', athlete: 'Rick Lapp', club: 'Rick Lapp', time: '15.39' },
  { place: '4', athlete: 'Joachim Acolatse', club: 'Unattached', time: '15.58' },
  { place: '5', athlete: 'Peter Ryan', club: 'Peter Ryan', time: '23.91' },
]

const W60_100m: Result[] = [
  { place: '1', athlete: 'Roxanne Brockner', club: 'Elitefeats', time: '13.83' },
  { place: '2', athlete: 'Donna Y Gunter', club: 'Pioneer Track Club WDC', time: '15.62' },
  { place: '3', athlete: 'Marguerite Matthews', club: 'Glenarden', time: '16.23' },
  { place: '4', athlete: 'Tomomi Seki', club: 'CPTC Track Smith', time: '16.29' },
  { place: '5', athlete: 'Ginny Richburg', club: 'Mass Velocity', time: '16.54' },
  { place: '6', athlete: 'Diane Pierce', club: 'Mass Velocity TC', time: '16.70' },
  { place: '7', athlete: 'Claudia Simpson', club: 'Greater Philadelphia TC', time: '17.13' },
  { place: '8', athlete: 'Yvette Henderson', club: 'Pioneer Track Club WDC', time: '26.39' },
]

const M60_4x100: RelayResult[] = [
  {
    place: '1',
    team: 'Southwest Sprinters TC',
    time: '47.94',
    runners: 'Allan Tissenbaum, David Jones, Mike Bradecamp, David Gibbon',
  },
  {
    place: '2',
    team: 'FLASHPOINT',
    time: '51.37',
    runners: 'Tony Fulton Sr, Ronald Humphrey, Brian Hankerson, Don Mcgee',
  },
  {
    place: '3',
    team: 'Greater Philadelphia TC',
    time: '54.77',
    runners: 'Lionel Jackson, Jacques Lucien, Bruce Rash, Harris Gibson',
  },
  { place: '4', team: 'Pony Express', time: '55.04', runners: 'John Brooks, Willie Spruill, Donnell Goss, Gerald Mitchell' },
  { place: '5', team: 'Mass Velocity Track Club', time: '55.75', runners: 'David Neumann, Stephen Gould, Graham Broyd, Chris McConnell' },
  { place: '6', team: 'DC International', time: '56.38', runners: 'Ben Cureton, Mohamed, David Barmer, Maurice George' },
  { place: '7', team: 'Team Fly Yellow Men65', time: '1:07.63', runners: 'Marcus Guynn, Ross Donolow, Stuart Field, Ken Kapner' },
  { place: '8', team: 'Over the Hill Gang #2', time: '1:11.58', runners: 'Deke Rush, David Flack, Marlon Pugh, Preppy Pepe Al-Shabazz' },
]

const M70_4x100: RelayResult[] = [
  {
    place: '1',
    team: 'Houston Elite',
    time: '59.18',
    runners: 'Vance Jacobson, Charles Allie, Don Warren, Michael Kish',
  },
  {
    place: '2',
    team: 'Greater Philadelphia TC',
    time: '59.99',
    runners: 'Rich Kalriess, Paul Brock, Griffin Lotson, Michael Jennetta',
  },
  {
    place: '3',
    team: 'Mass Velocity Track Club',
    time: '1:01.89',
    runners: 'Steve Snow, Tucker Taft, Roger Pierce, Michael Kiefer',
  },
  { place: '4', team: 'Houston Elite-2', time: '1:05.52', runners: 'Anthony Baker, Horace Hudson, Steven Phillips, James Morton' },
  { place: '5', team: 'Shore Athletic Club', time: '1:06.69', runners: 'Rick Lapp, Kerry Gillespie, Spider Rossiter, Ivan Black' },
  { place: '6', team: 'Philadelphia Masters', time: '1:37.51', runners: 'Dominic Stellato, Edward Hawkey, Brian Hernon, Wayne Lewis' },
]

const M60_4x400: RelayResult[] = [
  {
    place: '1',
    team: 'Greater Philadelphia TC A',
    time: '4:00.11',
    runners: 'John Curtis, Jacques Lucien, Bruce Rash, Jeff Conway',
  },
  {
    place: '2',
    team: 'Southwest Sprinters TC',
    time: '4:00.78',
    runners: 'Mike Bradecamp, David Jones, Karl Ross, David Gibbon',
  },
  {
    place: '3',
    team: 'Greater Philadelphia TC B',
    time: '4:21.78',
    runners: 'Brian Howard, Scott Landis, Wally Hernandez, Dave Ott',
  },
  { place: '4', team: 'Alabama Striders Track Club', time: '4:34.00', runners: "David Jones, Robert O'Neill, Gerard Bennett, Michael Briddell" },
  { place: '5', team: 'Shore Athletic Club 60s Team', time: '4:37.69', runners: 'Matt Wallack, Bill Hughes, Brian Hanlon, Michael Connolly' },
  { place: '6', team: 'Elitefeats', time: '4:39.74', runners: 'Dale Drueckhammer, Tommy Piciocchi, Robert Clasen, Robert Todd' },
]

function ResultsTable({ rows, windNote }: { rows: Result[]; windNote?: string }) {
  return (
    <div className="overflow-x-auto my-6 rounded-xl border border-gray-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wide">
          <tr>
            <th className="px-4 py-3 w-16">Place</th>
            <th className="px-4 py-3">Athlete</th>
            <th className="px-4 py-3">Club</th>
            <th className="px-4 py-3 w-24 text-right">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r) => (
            <tr key={`${r.place}-${r.athlete}`} className="hover:bg-blue-50/40">
              <td className="px-4 py-3 font-semibold text-gray-700">{r.place}</td>
              <td className="px-4 py-3 text-gray-900">{r.athlete}</td>
              <td className="px-4 py-3 text-gray-600">{r.club}</td>
              <td className="px-4 py-3 text-right font-mono text-gray-900">
                {r.time}
                {r.note && <span className="block text-xs text-gray-500">{r.note}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {windNote && (
        <p className="px-4 py-2 text-xs text-amber-800 bg-amber-50 border-t border-amber-200">
          {windNote}
        </p>
      )}
    </div>
  )
}

function RelayTable({ rows }: { rows: RelayResult[] }) {
  return (
    <div className="overflow-x-auto my-6 rounded-xl border border-gray-200">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wide">
          <tr>
            <th className="px-4 py-3 w-16">Place</th>
            <th className="px-4 py-3">Team</th>
            <th className="px-4 py-3 w-24 text-right">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((r) => (
            <tr key={`${r.place}-${r.team}`} className="hover:bg-blue-50/40 align-top">
              <td className="px-4 py-3 font-semibold text-gray-700">{r.place}</td>
              <td className="px-4 py-3">
                <span className="block text-gray-900 font-medium">{r.team}</span>
                <span className="block text-xs text-gray-500 mt-1">{r.runners}</span>
              </td>
              <td className="px-4 py-3 text-right font-mono text-gray-900">{r.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function PennRelays2026MastersPost() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-12">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Penn Relays 2026: What the Masters 50+ Sprints (and Relays) Just Showed Me
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          The 50+ field at Franklin Field gave me 50 years of preview footage. Here are the
          times — and the road map they sketch toward an M100 record.
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <time>May 5, 2026</time>
          <span>•</span>
          <span>8 min read</span>
        </div>
      </header>

      {/* Lead */}
      <p className="text-lg text-gray-800 mb-8">
        I came into Penn Relays week with a single question. Every Masters 50+ sprinter on
        Franklin Field is, in some sense, a preview of where I&apos;m trying to be. So what does
        the actual data say? Below: every place, every time, every club from the Masters
        100m and sprint-relay finals at the 2026 meet (Penn Relays, 2026), plus the
        storylines that stuck with me.
      </p>

      {/* Program scope note */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 my-8 rounded-r-lg">
        <p className="text-gray-800 font-semibold mb-2">A note on the Masters program</p>
        <p className="text-gray-700">
          Penn Relays&apos; Masters program is leaner than USATF Masters Outdoors. The
          full sprint-side schedule is the <strong>100m dash</strong>, the{' '}
          <strong>4×100m relay</strong>, and the <strong>4×400m relay</strong> (plus a
          5K Racewalk). No individual 200m or 400m. So when you read &quot;sprints&quot;
          at this meet, it really means the 100m and the relays — that&apos;s where the
          50+ field competes (Penn Relays, 2026).
        </p>
      </div>

      {/* YouTube */}
      <section className="my-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Watch the 100m field</h2>
        <p className="text-gray-700 mb-4">
          FloTrack&apos;s Day 1 cut of the Masters 100m races — every age group from W40+
          through M40+ in one ~14-minute video. Jump to the race you want using the
          chapter list below (FloTrack, 2026).
        </p>
        <YouTubeEmbed
          videoId="rD1z6FrJ20Q"
          title="Penn Relays 2026 Masters 100m highlights"
        />

        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-700 mb-3">
            Chapter jump links
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
            <li>
              <Link
                href="https://www.youtube.com/watch?v=rD1z6FrJ20Q&t=61s"
                className="text-blue-700 underline hover:text-blue-900"
                target="_blank"
                rel="noreferrer"
              >
                1:01 — Women&apos;s 100m, 60 and older
              </Link>
            </li>
            <li>
              <Link
                href="https://www.youtube.com/watch?v=rD1z6FrJ20Q&t=176s"
                className="text-blue-700 underline hover:text-blue-900"
                target="_blank"
                rel="noreferrer"
              >
                2:56 — Women&apos;s 100m, 40 and older
              </Link>
            </li>
            <li>
              <Link
                href="https://www.youtube.com/watch?v=rD1z6FrJ20Q&t=281s"
                className="text-blue-700 underline hover:text-blue-900"
                target="_blank"
                rel="noreferrer"
              >
                4:41 — Men&apos;s 100m, 75 and older
              </Link>
            </li>
            <li>
              <Link
                href="https://www.youtube.com/watch?v=rD1z6FrJ20Q&t=397s"
                className="text-blue-700 underline hover:text-blue-900"
                target="_blank"
                rel="noreferrer"
              >
                6:37 — Men&apos;s 100m, 70 and older
              </Link>
            </li>
            <li>
              <Link
                href="https://www.youtube.com/watch?v=rD1z6FrJ20Q&t=472s"
                className="text-blue-700 underline hover:text-blue-900"
                target="_blank"
                rel="noreferrer"
              >
                7:52 — Men&apos;s 100m, 65 and older
              </Link>
            </li>
            <li>
              <Link
                href="https://www.youtube.com/watch?v=rD1z6FrJ20Q&t=548s"
                className="text-blue-700 underline hover:text-blue-900"
                target="_blank"
                rel="noreferrer"
              >
                9:08 — Men&apos;s 100m, 60 and older
              </Link>
            </li>
            <li>
              <Link
                href="https://www.youtube.com/watch?v=rD1z6FrJ20Q&t=613s"
                className="text-blue-700 underline hover:text-blue-900"
                target="_blank"
                rel="noreferrer"
              >
                10:13 — Men&apos;s 100m, 55 and older
              </Link>
            </li>
            <li>
              <Link
                href="https://www.youtube.com/watch?v=rD1z6FrJ20Q&t=724s"
                className="text-blue-700 underline hover:text-blue-900"
                target="_blank"
                rel="noreferrer"
              >
                12:04 — Men&apos;s 100m, 50 and older
              </Link>
            </li>
            <li>
              <Link
                href="https://www.youtube.com/watch?v=rD1z6FrJ20Q&t=802s"
                className="text-blue-700 underline hover:text-blue-900"
                target="_blank"
                rel="noreferrer"
              >
                13:22 — Men&apos;s 100m, 40 and older
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Men's 100m */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Men&apos;s 100m by age group</h2>
        <p className="text-gray-700 mb-6">
          Five separate finals — M50, M60, M65, M70, M75 — each a distinct race with its
          own field. Wind readings matter for the older brackets; I&apos;ve flagged the
          ones over the 2.0 m/s legal tailwind limit.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-2">M50+ 100m — Event 125 (Penn Relays, 2026)</h3>
        <p className="text-sm text-gray-500 mb-2">
          Thursday, April 23 · 12:36 PM · Wind +1.5 m/s (legal) ·{' '}
          <Link href="https://www.youtube.com/watch?v=rD1z6FrJ20Q&t=724s" className="text-blue-700 underline" target="_blank" rel="noreferrer">▶ Watch (12:04)</Link>
        </p>
        <p className="text-gray-700 mb-2">
          Adeniran Epebinuade and Shawn Talley went 1–2 for Unite4 with{' '}
          <strong>11.89</strong> and 12.21 respectively. A sub-12 100m past 50 is no
          accident — that&apos;s the kind of speed that takes a real training program, not
          maintenance jogging.
        </p>
        <ResultsTable rows={M50_100m} />

        <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-2">M60+ 100m — Event 123 (Penn Relays, 2026)</h3>
        <p className="text-sm text-gray-500 mb-2">
          Thursday, April 23 · 12:32 PM · Wind +0.1 m/s (legal) ·{' '}
          <Link href="https://www.youtube.com/watch?v=rD1z6FrJ20Q&t=548s" className="text-blue-700 underline" target="_blank" rel="noreferrer">▶ Watch (9:08)</Link>
        </p>
        <p className="text-gray-700 mb-2">
          David Gibbon ran <strong>11.94</strong> in still air at 60+. That number deserves
          to be quoted in full sentences. He then went out and anchored Southwest
          Sprinters TC&apos;s 4×100 to 47.94 (more on that below). Tony Clemons (Trojan
          Masters TC) was a clean second at 12.55.
        </p>
        <ResultsTable rows={M60_100m} />

        <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-2">M65+ 100m — Event 122 (Penn Relays, 2026)</h3>
        <p className="text-sm text-gray-500 mb-2">
          Thursday, April 23 · 12:30 PM · Wind +1.6 m/s (legal) ·{' '}
          <Link href="https://www.youtube.com/watch?v=rD1z6FrJ20Q&t=472s" className="text-blue-700 underline" target="_blank" rel="noreferrer">▶ Watch (7:52)</Link>
        </p>
        <p className="text-gray-700 mb-2">
          Tony Fulton Sr broke 13 — <strong>12.99</strong> — at 65 and older, with Ronald
          Humphrey 0.03s back at 13.02. The race for third came down to thousandths:
          David Neumann (Mass Velocity TC) 13.243, Brian Hankerson 13.246. Three-thousandths
          of a second. After 65 years.
        </p>
        <ResultsTable rows={M65_100m} />

        <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-2">M70+ 100m — Event 121 (Penn Relays, 2026)</h3>
        <p className="text-sm text-gray-500 mb-2">
          Thursday, April 23 · 12:28 PM · Wind +3.1 m/s (wind-aided) ·{' '}
          <Link href="https://www.youtube.com/watch?v=rD1z6FrJ20Q&t=397s" className="text-blue-700 underline" target="_blank" rel="noreferrer">▶ Watch (6:37)</Link>
        </p>
        <p className="text-gray-700 mb-2">
          Michael Kiefer (Mass Velocity) won in <strong>14.03</strong>, but the +3.1 m/s
          tailwind means none of these times are eligible for record purposes. Steven
          Phillips (Houston Elite) and Griffin Lotson rounded out the top three at 14.34
          and 14.48.
        </p>
        <ResultsTable rows={M70_100m} windNote="⚠ Wind +3.1 m/s — over the 2.0 m/s legal-tailwind limit; results are not record-eligible." />

        <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-2">M75+ 100m — Event 120 (Penn Relays, 2026)</h3>
        <p className="text-sm text-gray-500 mb-2">
          Thursday, April 23 · 12:25 PM · Wind +3.2 m/s (wind-aided) ·{' '}
          <Link href="https://www.youtube.com/watch?v=rD1z6FrJ20Q&t=281s" className="text-blue-700 underline" target="_blank" rel="noreferrer">▶ Watch (4:41)</Link>
        </p>
        <p className="text-gray-700 mb-2">
          Michael Kish (Houston Elite) ran <strong>13.27</strong> at 75 and older. Same
          wind caveat as M70 — but the eye test was unmistakable, and Kish came back two
          races later to anchor Houston Elite&apos;s 4×100 70+ to a meet-winning 59.18
          alongside Charles Allie.
        </p>
        <ResultsTable rows={M75_100m} windNote="⚠ Wind +3.2 m/s — over the 2.0 m/s legal-tailwind limit; results are not record-eligible." />
      </section>

      {/* Women's 100m */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Women&apos;s 100m — W60+</h2>
        <p className="text-sm text-gray-500 mb-2">
          Event 118 · Thursday, April 23 · 12:20 PM · Wind +1.4 m/s (legal) ·{' '}
          <Link href="https://www.youtube.com/watch?v=rD1z6FrJ20Q&t=61s" className="text-blue-700 underline" target="_blank" rel="noreferrer">▶ Watch (1:01)</Link>
        </p>
        <p className="text-gray-700 mb-6">
          Roxanne Brockner (Elitefeats) ran a clean <strong>13.83</strong> to take the
          W60+ 100m by nearly two seconds. The Penn Relays Masters program runs only two
          women&apos;s 100m brackets (W40+ and W60+), so this is the headline women&apos;s
          50+ result of the meet (Penn Relays, 2026).
        </p>
        <ResultsTable rows={W60_100m} />
      </section>

      {/* Relays */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">The relays</h2>
        <p className="text-gray-700 mb-6">
          Three sprint-relay finals on the 50+ side: 4×100 60+, 4×100 70+, and 4×400 60+.
          The 4×400 finish was the closest team race of the day.
        </p>

        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-2">Masters Men&apos;s 4×100 60+ — Event 114 (Penn Relays, 2026)</h3>
        <p className="text-sm text-gray-500 mb-2">Thursday, April 23 · 12:02 PM</p>
        <p className="text-gray-700 mb-2">
          Southwest Sprinters TC won by 3.43 seconds in <strong>47.94</strong> — an
          average split under 12 seconds per leg. The same David Gibbon who ran 11.94
          individually anchored.
        </p>
        <RelayTable rows={M60_4x100} />

        <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-2">Masters Men&apos;s 4×100 70+ — Event 113 (Penn Relays, 2026)</h3>
        <p className="text-sm text-gray-500 mb-2">Thursday, April 23 · 11:58 AM</p>
        <p className="text-gray-700 mb-2">
          Houston Elite&apos;s 70+ team went under a minute at <strong>59.18</strong>,
          with masters legend Charles Allie on the squad alongside Vance Jacobson, Don
          Warren, and Michael Kish. Greater Philadelphia TC was 0.81 back at 59.99.
        </p>
        <RelayTable rows={M70_4x100} />

        <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-2">Masters Men&apos;s 4×400 60+ — Event 130 (Penn Relays, 2026)</h3>
        <p className="text-sm text-gray-500 mb-2">Thursday, April 23 · 12:57 PM</p>
        <p className="text-gray-700 mb-2">
          Greater Philadelphia TC&apos;s A team beat Southwest Sprinters TC by{' '}
          <strong>0.67 seconds</strong> — 4:00.11 to 4:00.78 — in a race decided on the
          anchor leg. GR Project led at 400m and 800m before fading; Greater Philly A
          patiently moved up and held the lead from the second leg onward.
        </p>
        <RelayTable rows={M60_4x400} />
      </section>

      {/* Reflection */}
      <section className="mt-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">What this sketches for me</h2>
        <p className="text-gray-800 mb-4">
          I keep coming back to David Gibbon&apos;s 11.94 at 60+ and Tony Fulton Sr&apos;s
          12.99 at 65+. Those aren&apos;t outliers — they&apos;re what targeted, specific
          training looks like sustained across decades. They&apos;re also, more bluntly,
          the line my own training has to cross if I want a shot at the M100 record. Lester
          Wright Sr. ran <strong>26.34</strong> at 100 in 2022 (already documented in the{' '}
          <Link href="/blog/lester-wright-sr-the-man-who-outran-time" className="text-blue-700 underline">
            piece I wrote about him
          </Link>
          ). Working backward from 26.34 through these 60+ and 65+ benchmarks is how I
          plan now.
        </p>
        <p className="text-gray-800">
          Watching M75 and the older fields, the message gets simpler: most of the people
          out there aren&apos;t maintaining what they had at 30. They&apos;re training
          deliberately for the version of themselves that&apos;s still on the track at
          70, 75, 80. That&apos;s the part I came to Franklin Field to see.
        </p>
      </section>

      {/* Coverage notes */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What&apos;s not in this post</h2>
        <p className="text-gray-700 mb-2">
          For honesty: I&apos;m covering nine of the eighteen Masters sprint-side finals.
          The races I didn&apos;t include here are W40+ 100m, M40+ 100m, M55+ 100m, M80+
          100m, the W40+ and M40/50+ 4×100s, and the W40+, M50+, and M40+ 4×400s. The
          official portal has all of them under the &quot;Masters&quot; tab at{' '}
          <Link
            href="https://pennrelaysonline.com/results/schedule.aspx?l=MAS"
            className="text-blue-700 underline"
            target="_blank"
            rel="noreferrer"
          >
            pennrelaysonline.com
          </Link>
          .
        </p>
      </section>

      {/* References */}
      <section className="mt-16 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">References</h2>
        <p className="text-sm text-gray-500 mb-4">APA 7th edition.</p>
        <ul className="space-y-3 text-sm text-gray-700">
          <li>
            FloTrack. (2026, April 23).{' '}
            <em>UNBELIEVABLE Masters 100m races take center stage on Day 1 of the 2026 Penn Relays</em>{' '}
            [Video]. YouTube.{' '}
            <Link
              href="https://www.youtube.com/watch?v=rD1z6FrJ20Q"
              className="text-blue-700 underline break-all"
              target="_blank"
              rel="noreferrer"
            >
              https://www.youtube.com/watch?v=rD1z6FrJ20Q
            </Link>
          </li>
          <li>
            Penn Relays. (2026). <em>2026 Penn Relays Masters results</em>. Retrieved
            May 5, 2026, from{' '}
            <Link
              href="https://pennrelaysonline.com/results/schedule.aspx?l=MAS"
              className="text-blue-700 underline break-all"
              target="_blank"
              rel="noreferrer"
            >
              https://pennrelaysonline.com/results/schedule.aspx?l=MAS
            </Link>
          </li>
        </ul>
      </section>
    </article>
  )
}

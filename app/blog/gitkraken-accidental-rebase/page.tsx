import Link from 'next/link';

export const metadata = {
  alternates: {
    canonical: '/blog/gitkraken-accidental-rebase',
  },
  title: 'GitKraken and Accidental Rebases — Not as Scary as You Think | Brand Anthony McDonald',
  description: 'One click in the GitKraken UI, a wave of panic, then thirty seconds with git reflog. A practical walkthrough of why accidental rebases are usually recoverable in under a minute.',
  openGraph: {
    title: 'GitKraken and Accidental Rebases — Not as Scary as You Think',
    description: 'A developer-relations walkthrough of why an accidental rebase in GitKraken is almost always recoverable, with real reflog output and a practice routine.',
  },
};

export default function GitKrakenAccidentalRebasePost() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <header className="mb-12">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Blog
        </Link>
        <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-2">Dev Tools · Git</p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          GitKraken and Accidental Rebases — Not as Scary as You Think
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          One click in the GitKraken UI. A wave of panic. Then thirty seconds with <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">git reflog</code> and a calm exhale.
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <time>April 27, 2026</time>
          <span>•</span>
          <span>5 min read</span>
        </div>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">The panic moment</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Picture this. You shipped a feature branch on top of <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">main</code>. Two clean commits, all green, push to origin. You hop into GitKraken to merge it back to <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">main</code> the way you always do — except your eye lands on a different button. Click. Confirm dialog blurs past. The branch labels swap places.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          You weren&apos;t supposed to <em>rebase</em>. You were supposed to <em>merge</em>. Where&apos;s your merge commit? Is your work still there? Did you just rewrite shared history? Is the entire team going to see a force-push notification in the next thirty seconds?
        </p>
        <p className="text-gray-700 leading-relaxed">
          I had this exact moment last week. Here&apos;s what actually happened — and why it took less time to recover than it took to spike my heart rate.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">What git actually did</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The setup: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">main</code> hadn&apos;t moved since I branched. My feature branch was just <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">main + 2 commits</code>. So when I rebased <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">main</code> onto the feature branch, git did something almost boring: a <strong className="text-blue-700">fast-forward</strong>.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          A fast-forward rebase doesn&apos;t rewrite anything. It just slides the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">main</code> pointer up the line until it&apos;s at the same commit as the feature tip. Both branches now point at the same commit. No commits got recreated with new SHAs. No history got rewritten. Nobody got force-push notifications.
        </p>
        <p className="text-gray-700 leading-relaxed">
          The only thing &ldquo;wrong&rdquo; was cosmetic: instead of the merge bubble I usually create, the history was now linear. That&apos;s a style preference, not a bug.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">How I knew, in 30 seconds</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Three commands. Drop into the terminal. Run them in order:
        </p>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-x-auto text-sm">
          <code>{`# Where am I, where's main, where's the feature branch?
git log --oneline -3 main
git log --oneline -3 feat/my-feature

# What just happened to HEAD and to main?
git reflog show main --date=relative -n 5
git reflog --date=relative -n 10`}</code>
        </pre>
        <p className="text-gray-700 leading-relaxed mb-4">
          The reflog is git&apos;s built-in &ldquo;you-just-did-what?&rdquo; log. Every move of <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">HEAD</code> and every branch tip update is recorded with a timestamp and a one-line description. Mine looked like this:
        </p>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-x-auto text-sm">
          <code>{`cdf6b82 main@{2 minutes ago}: rebase (finish): refs/heads/main onto cdf6b82...
dc95934 main@{7 hours ago}: merge fix/lesson-editor-content-url-clobber

cdf6b82 HEAD@{2 minutes ago}: rebase (finish): returning to refs/heads/main
cdf6b82 HEAD@{2 minutes ago}: rebase (start): checkout feat/my-feature
dc95934 HEAD@{2 minutes ago}: checkout: moving from feat/my-feature to main`}</code>
        </pre>
        <p className="text-gray-700 leading-relaxed">
          Read top to bottom: switched to main, started a rebase against the feature branch, finished. <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">main</code> moved from <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">dc95934</code> (the last merge commit) up to <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">cdf6b82</code> (the feature tip). No commits were rewritten — that&apos;s why both <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">main</code> and the feature branch share the same SHA in those entries. Fast-forward, no harm done.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">The reflog is your safety net</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Even if the rebase had been the bad kind — the kind that rewrites commit SHAs and orphans your old commits — the reflog would have shown me exactly where the old <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">main</code> tip used to be. Git keeps reflog entries for <strong>90 days by default</strong>. Plenty of time to notice and recover.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          And if you do need to actually undo a destructive operation, the recipe is simple. Find the entry in the reflog that points at the commit you want to be at, then jump back to it:
        </p>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-x-auto text-sm">
          <code>{`# Look at the reflog for whichever ref you nuked
git reflog show main

# Reset main to whatever it was before the bad operation
git reset --hard main@{1}    # one move ago
# or
git reset --hard <sha>        # any commit you can see in the reflog`}</code>
        </pre>
        <p className="text-gray-700 leading-relaxed">
          That <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">main@{'{1}'}</code> syntax means &ldquo;the position main was in one move ago.&rdquo; Bump the number to walk further back. Combine it with <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">git reset --hard</code> only when you&apos;re sure — that command is the one operation that actually <em>throws away</em> uncommitted work in your tree.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">When the rebase is already pushed</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The trickier flavor of accidental rebase: you rebased and the result was <em>already pushed</em> to origin. Now your local fix has to deal with everyone else who pulled the rewritten history.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          For your own feature branches, force-push is fine — coordinate with anyone who pulled it. For shared branches like <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">main</code>, the right move is almost never &ldquo;force-push the old version back.&rdquo; It&apos;s &ldquo;leave the rewritten history, communicate, and move on.&rdquo; The reflog still proves nothing was lost; the history shape is just slightly different than your team&apos;s usual convention.
        </p>
        <p className="text-gray-700 leading-relaxed">
          In my case the rewritten <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">main</code> was already on origin within seconds. Force-pushing back would have caused more chaos than the linear-vs-merge-bubble cosmetic difference. I left it. Future merges will look normal again.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Practice this on a throwaway repo</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The reason my heart rate spiked even though everything was fine is that I&apos;d never read a reflog under stress before. The fix takes ten minutes and pays you back forever. Spin up a scratch repo and hurt it on purpose:
        </p>
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-x-auto text-sm">
          <code>{`mkdir reflog-practice && cd reflog-practice
git init
echo "v1" > file && git add . && git commit -m "v1"
echo "v2" > file && git commit -am "v2"
echo "v3" > file && git commit -am "v3"

# Now intentionally do scary things
git reset --hard HEAD~2    # "lose" two commits
git reflog                  # they're still there
git reset --hard <sha>     # bring them back

git rebase -i HEAD~3       # mess with history
git reflog                  # still recoverable`}</code>
        </pre>
        <p className="text-gray-700 leading-relaxed">
          Once you&apos;ve done this on a throwaway, the muscle is in your hands when it matters. The next accidental click in GitKraken — or anywhere — becomes thirty seconds of typing instead of minutes of dread.
        </p>
      </section>

      <section className="mb-10 border-t border-gray-200 pt-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">The takeaway</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          GitKraken&apos;s UI made the action one click. Git&apos;s reflog made the consequence reversible. The fear was bigger than the reality.
        </p>
        <p className="text-gray-700 leading-relaxed">
          If you&apos;re panicking right now: stop. Run <code className="bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">git reflog</code>. Read the entries. The story is right there.
        </p>
      </section>

      <footer className="mt-12 pt-6 border-t border-gray-200">
        <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Blog
        </Link>
      </footer>
    </article>
  );
}

import { Metadata } from 'next'
import BlogHeader from '../../../components/blog/BlogHeader'
import FeaturedPost from '../../../components/blog/FeaturedPost'
import BlogCategoryFilter from '../../../components/blog/BlogCategoryFilter'
import { getBlogPostsWithOverrides } from '../../../lib/blogData'
import { sortFeatured } from '../../../lib/blog/featuredSort'

export const metadata: Metadata = {
  title: 'Legacy Blog | Brand Anthony McDonald',
  description: 'The archived blog — stories spanning Indigenous history, technical innovations, business insights, and the journey to becoming the world\'s fastest centenarian.',
  alternates: { canonical: '/blog/legacy' },
}

export default async function LegacyBlogPage() {
  const allPosts = await getBlogPostsWithOverrides()
  const featuredPosts = sortFeatured(allPosts.filter(post => post.featured))
  const recentPosts = allPosts.slice(0, 26)
  const categories = Array.from(new Set(allPosts.map(post => post.category)))

  return (
    <main className="min-h-screen bg-gray-50 pt-28">
      {/* Big, clear legacy notice so visitors aren't confused. */}
      <div className="bg-amber-100 border-y-2 border-amber-300">
        <div className="container-max py-4 flex items-start gap-3">
          <span className="text-2xl leading-none" aria-hidden="true">📦</span>
          <div>
            <p className="font-bold text-amber-900 text-lg">
              You’re viewing the legacy blog archive
            </p>
            <p className="text-amber-800 text-sm mt-0.5">
              This page collects earlier posts and is kept for reference. Content is gradually moving to the
              new content system — some posts here may look or behave differently than newer articles.
            </p>
          </div>
        </div>
      </div>

      <BlogHeader />
      {featuredPosts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-max">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Stories</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <FeaturedPost key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
      <BlogCategoryFilter posts={recentPosts} categories={categories} />
    </main>
  )
}

import { Metadata } from 'next'
import Link from 'next/link'
import BlogHeader from '@/components/blog/BlogHeader'
import FeaturedPost from '@/components/blog/FeaturedPost'
import BlogCategoryFilter from '@/components/blog/BlogCategoryFilter'
import { getAllBlogPosts } from '@/lib/blogData'

// ISR so newly published CMS posts appear without a redeploy.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Blog | Brand Anthony McDonald',
  description: 'Stories spanning Indigenous history, technical deep dives, business insights, and the journey to becoming the world\'s fastest centenarian.',
  alternates: { canonical: '/blog' },
}

export default async function BlogPage() {
  const allPosts = await getAllBlogPosts()
  const featuredPosts = allPosts.filter(post => post.featured)
  const recentPosts = [...allPosts].sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  )
  const categories = Array.from(new Set(allPosts.map(post => post.category)))

  return (
    <main className="min-h-screen bg-gray-50 pt-28">
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
      <section className="py-10 bg-gray-50">
        <div className="container-max text-center text-sm text-gray-600">
          Looking for something older?{' '}
          <Link href="/blog/legacy" className="text-blue-600 hover:text-blue-800 underline">
            Browse the legacy blog archive
          </Link>
          .
        </div>
      </section>
    </main>
  )
}

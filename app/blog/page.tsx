import { Metadata } from 'next'
import BlogHeader from './../../components/blog/BlogHeader'
import FeaturedPost from './../../components/blog/FeaturedPost'
import BlogCategoryFilter from './../../components/blog/BlogCategoryFilter'
import { getBlogPostsWithOverrides } from '../../lib/blogData'

export const metadata: Metadata = {
  title: 'Blog | Brand Anthony McDonald - Stories, Insights & Technical Explorations',
  description: 'Explore stories spanning Indigenous history, technical innovations, business insights, and the journey to becoming the world\'s fastest centenarian.',
}

export default async function BlogPage() {
  const allPosts = await getBlogPostsWithOverrides()
  const featuredPosts = allPosts.filter(post => post.featured)
  const recentPosts = allPosts.slice(0, 26)
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
    </main>
  )
}

// src/app/blog/page.tsx - UPDATED to use new data functions
import { getAllBlogPosts, getFeaturedPosts } from '../../lib/blogData'
import BlogHeader from '../../components/blog/BlogHeader'
import BlogGrid from '../../components/blog/BlogGrid'
import FeaturedPost from '../../components/blog/FeaturedPost'

export default async function BlogPage() {
  const [allPosts, featuredPosts] = await Promise.all([
    getAllBlogPosts(), // Only published posts for public view
    getFeaturedPosts()
  ])

  const regularPosts = allPosts.filter(post => !post.featured)

  return (
    <div className="pt-16">
      <BlogHeader />
      
      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="section-padding">
          <div className="container-max">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Stories</h2>
            <div className="grid gap-8">
              {featuredPosts.map((post) => (
                <FeaturedPost key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <BlogGrid posts={regularPosts} />
    </div>
  )
}
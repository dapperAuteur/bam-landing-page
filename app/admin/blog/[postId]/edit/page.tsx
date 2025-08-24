// src/app/admin/blog/[postId]/edit/page.tsx
import BlogEditor from './../../../../../components/admin/BlogEditor'

export default function EditBlogPostPage({ 
  params 
}: { 
  params: { postId: string } 
}) {
  return <BlogEditor postId={params.postId} />
}

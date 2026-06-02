import MdxBlogEditor from '@/components/admin/MdxBlogEditor'

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  return <MdxBlogEditor postId={params.id} />
}

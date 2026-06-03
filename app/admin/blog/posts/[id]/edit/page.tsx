import MdxBlogEditor from '@/components/admin/MdxBlogEditor'

export default async function EditBlogPostPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <MdxBlogEditor postId={params.id} />
}

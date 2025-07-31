export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <main className="pt-8 px-4 md:pt-16">{children}</main>
}

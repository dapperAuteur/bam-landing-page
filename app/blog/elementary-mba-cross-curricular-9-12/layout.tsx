import { getBlogMetadata, getBlogJsonLd } from "@/lib/seo";

export const metadata = getBlogMetadata("elementary-mba-cross-curricular-9-12");

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getBlogJsonLd("elementary-mba-cross-curricular-9-12");
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}

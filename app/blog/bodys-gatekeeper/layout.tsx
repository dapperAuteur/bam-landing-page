import { getBlogMetadata, getBlogJsonLd } from "@/lib/seo";

export const metadata = getBlogMetadata("bodys-gatekeeper");

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getBlogJsonLd("bodys-gatekeeper");
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

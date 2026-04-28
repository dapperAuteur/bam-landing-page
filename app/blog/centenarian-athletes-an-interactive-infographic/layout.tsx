import { getBlogMetadata, getBlogJsonLd } from "@/lib/seo";

export const metadata = getBlogMetadata("centenarian-athletes-an-interactive-infographic");

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getBlogJsonLd("centenarian-athletes-an-interactive-infographic");
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

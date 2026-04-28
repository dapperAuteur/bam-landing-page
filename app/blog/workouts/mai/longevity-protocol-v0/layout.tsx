import { getBlogMetadata, getBlogJsonLd } from "@/lib/seo";

export const metadata = getBlogMetadata("workouts/mai/longevity-protocol-v0");

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getBlogJsonLd("workouts/mai/longevity-protocol-v0");
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

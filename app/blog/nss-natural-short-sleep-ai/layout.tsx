import { getBlogMetadata, getBlogJsonLd } from "@/lib/seo";

export const metadata = getBlogMetadata("-nss-natural-short-sleep-ai");

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = getBlogJsonLd("-nss-natural-short-sleep-ai");
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

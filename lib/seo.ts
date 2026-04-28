import type { Metadata } from "next";
import { blogPosts } from "./blogData";

const SITE_URL = "https://brandanthonymcdonald.com";
const SITE_NAME = "Brand Anthony McDonald";
const AUTHOR_NAME = "Brand Anthony McDonald";

export interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noindex?: boolean;
  type?: "website" | "article";
}

export function getPageMetadata({
  title,
  description,
  path,
  ogImage,
  noindex,
  type = "website",
}: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type,
      locale: "en_US",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: fullTitle,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

function slugToTitle(slug: string): string {
  const lastSegment = slug.split("/").pop() || slug;
  return lastSegment
    .replace(/^-+/, "") // strip leading dashes (e.g. "-routines-…" → "routines-…")
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getBlogMetadata(slug: string): Metadata {
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) {
    return getPageMetadata({
      title: slugToTitle(slug),
      description: `${slugToTitle(slug)} — a post by Brand Anthony McDonald.`,
      path: `/blog/${slug}`,
      type: "article",
    });
  }

  const url = `${SITE_URL}/blog/${post.slug}`;
  const fullTitle = `${post.title} | ${SITE_NAME}`;
  const publishedTime = post.publishDate
    ? new Date(post.publishDate).toISOString()
    : undefined;

  return {
    title: fullTitle,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: post.description,
      url,
      siteName: SITE_NAME,
      type: "article",
      locale: "en_US",
      ...(publishedTime ? { publishedTime } : {}),
      authors: [AUTHOR_NAME],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: post.description,
      creator: "@dapperauteur",
    },
  };
}

export function getBlogJsonLd(slug: string): Record<string, unknown> | null {
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return null;

  const url = `${SITE_URL}/blog/${post.slug}`;
  const publishedTime = post.publishDate
    ? new Date(post.publishDate).toISOString()
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    keywords: post.tags?.join(", "),
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    ...(publishedTime ? { datePublished: publishedTime } : {}),
    articleSection: post.category,
  };
}

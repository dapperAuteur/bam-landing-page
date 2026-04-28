import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Gallery | Brand Anthony McDonald",
  description: "Private client gallery — access requires the per-gallery link.",
  robots: { index: false, follow: false },
};

export default function ClientGalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

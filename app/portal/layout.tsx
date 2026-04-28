import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Portal | Brand Anthony McDonald",
  description: "Private project portal — access requires the per-project link.",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

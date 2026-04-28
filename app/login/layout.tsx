import { getPageMetadata } from "@/lib/seo";

export const metadata = getPageMetadata({
  title: "Sign In",
  description: "Admin sign-in for Brand Anthony McDonald.",
  path: "/login",
  noindex: true,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

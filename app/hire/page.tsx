import IntakeForm from "@/components/forms/IntakeForm";
import { getPageMetadata } from "@/lib/seo";

export const metadata = getPageMetadata({
  title: "Hire Me",
  description:
    "Looking for a Developer Relations, Tech Support, full-stack, or AI-product builder? Send a quick brief — I respond within 24 hours.",
  path: "/hire",
});

export default function HirePage() {
  return (
    <IntakeForm
      config={{
        formType: "hire",
        recaptchaAction: "hire_submit",
        apiEndpoint: "/api/forms/hire",
        headline: "Hire me",
        subheadline:
          "Developer Relations, Tech Support, and AI-product engineering. Tell me what you're working on — I respond personally within 24 hours.",
        contextLabel: "Role or title you're hiring for",
        contextPlaceholder: "e.g. Senior Developer Advocate, Tech Support Engineer, Contract DevRel",
        messagePlaceholder:
          "What does the role look like? Team, stack, timeline, comp range if you have it. The more specific, the faster I can tell you whether I'm a good fit.",
        submitLabel: "Send the brief",
      }}
    />
  );
}

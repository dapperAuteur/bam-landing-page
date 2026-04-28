import IntakeForm from "@/components/forms/IntakeForm";
import { getPageMetadata } from "@/lib/seo";

export const metadata = getPageMetadata({
  title: "Partner With Me",
  description:
    "Collaborations, integrations, co-marketing, and grant partnerships across the WitUS ecosystem (CentenarianOS, Work.WitUS, FlashLearnAI, and more).",
  path: "/partner",
});

export default function PartnerPage() {
  return (
    <IntakeForm
      config={{
        formType: "partner",
        recaptchaAction: "partner_submit",
        apiEndpoint: "/api/forms/partner",
        headline: "Partner with me",
        subheadline:
          "Integrations, co-marketing, grants, and joint ventures across the WitUS ecosystem. Tell me what you're imagining — I'll tell you whether it's a fit.",
        contextLabel: "Type of partnership",
        contextPlaceholder: "e.g. Integration partner, co-marketing, grant collaborator, advisor",
        messagePlaceholder:
          "What's the partnership? Which product(s) of mine does it touch? Timeline, audience, mutual upside — share whatever helps me see the shape of it.",
        submitLabel: "Start the conversation",
      }}
    />
  );
}

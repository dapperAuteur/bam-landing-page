import SurveyForm from "@/components/forms/SurveyForm";
import { getPageMetadata } from "@/lib/seo";

export const metadata = getPageMetadata({
  title: "Start a project",
  description:
    "Have an app you want built? Send a structured intake (about 5 minutes) and I'll come back with a thoughtful first response within 24 hours during the work week.",
  path: "/intake",
});

export default function IntakePage() {
  return <SurveyForm />;
}

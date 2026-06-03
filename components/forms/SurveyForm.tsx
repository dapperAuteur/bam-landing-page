"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import { AlertTriangle, CheckCircle } from "lucide-react";

type PlatformKey =
  | "web"
  | "ios"
  | "android"
  | "desktop"
  | "voice"
  | "embedded"
  | "other";

type BudgetKey =
  | "under_5k"
  | "5k_15k"
  | "15k_50k"
  | "50k_150k"
  | "150k_plus"
  | "discuss";

type UrgencyKey = "exploring" | "soon" | "actively_recruiting";

type NextStepKey = "call" | "async" | "either";

interface FormState {
  name: string;
  email: string;
  role: string;
  company: string;
  projectName: string;
  oneLinePitch: string;
  coreProblem: string;
  users: string;
  platforms: PlatformKey[];
  mustHaves: string;
  niceToHaves: string;
  integrations: string;
  targetDate: string;
  budgetRange: BudgetKey | "";
  urgency: UrgencyKey | "";
  decisionMakers: string;
  nextStep: NextStepKey | "";
  referrer: string;
  notes: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  role: "",
  company: "",
  projectName: "",
  oneLinePitch: "",
  coreProblem: "",
  users: "",
  platforms: [],
  mustHaves: "",
  niceToHaves: "",
  integrations: "",
  targetDate: "",
  budgetRange: "",
  urgency: "",
  decisionMakers: "",
  nextStep: "",
  referrer: "",
  notes: "",
};

const PLATFORM_LABELS: Array<{ key: PlatformKey; label: string }> = [
  { key: "web", label: "Web" },
  { key: "ios", label: "iOS" },
  { key: "android", label: "Android" },
  { key: "desktop", label: "Native desktop" },
  { key: "voice", label: "Voice / smart speaker" },
  { key: "embedded", label: "Embedded / IoT" },
  { key: "other", label: "Other" },
];

const BUDGET_LABELS: Array<{ key: BudgetKey; label: string }> = [
  { key: "under_5k", label: "Under $5k" },
  { key: "5k_15k", label: "$5k – $15k" },
  { key: "15k_50k", label: "$15k – $50k" },
  { key: "50k_150k", label: "$50k – $150k" },
  { key: "150k_plus", label: "$150k+" },
  { key: "discuss", label: "Let's discuss" },
];

const URGENCY_LABELS: Array<{ key: UrgencyKey; label: string }> = [
  { key: "exploring", label: "Just exploring" },
  { key: "soon", label: "Planning to start in 1–3 months" },
  { key: "actively_recruiting", label: "Actively recruiting now" },
];

const NEXT_STEP_LABELS: Array<{ key: NextStepKey; label: string }> = [
  { key: "call", label: "30-min discovery call" },
  { key: "async", label: "Async written response first" },
  { key: "either", label: "Either works" },
];

const SectionHeading = ({
  step,
  title,
  hint,
}: {
  step: number;
  title: string;
  hint?: string;
}) => (
  <div className="mb-4">
    <h2 className="text-lg font-semibold text-gray-900 flex items-baseline gap-2">
      <span className="text-sm font-mono text-blue-600">{`0${step}`}</span>
      <span>{title}</span>
    </h2>
    {hint && <p className="text-sm text-gray-500 mt-1">{hint}</p>}
  </div>
);

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
    hasError ? "border-red-300 bg-red-50" : "border-gray-300"
  }`;

const textareaClass = (hasError: boolean) =>
  `w-full px-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-vertical ${
    hasError ? "border-red-300 bg-red-50" : "border-gray-300"
  }`;

function SurveyFormInner() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const searchParams = useSearchParams();
  const utmSource = searchParams.get("utm_source") || "";
  const utmCampaign = searchParams.get("utm_campaign") || "";

  const [formData, setFormData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const togglePlatform = (key: PlatformKey) => {
    setFormData((prev) => {
      const has = prev.platforms.includes(key);
      return {
        ...prev,
        platforms: has
          ? prev.platforms.filter((p) => p !== key)
          : [...prev.platforms, key],
      };
    });
    if (errors.platforms) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.platforms;
        return next;
      });
    }
  };

  const setRadio = <K extends keyof FormState>(name: K, value: FormState[K]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as string];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");

    if (!executeRecaptcha) {
      setStatus("error");
      setStatusMessage("reCAPTCHA isn't ready yet — give it a second and try again.");
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");

    try {
      const recaptchaToken = await executeRecaptcha("intake_submit");

      const res = await fetch("/api/forms/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          utm_source: utmSource,
          utm_campaign: utmCampaign,
          recaptchaToken,
        }),
      });

      const result = (await res.json()) as {
        success: boolean;
        message: string;
        errors?: Record<string, string>;
      };

      if (result.success) {
        setStatus("success");
        setStatusMessage(result.message);
        setFormData(initialState);
        setErrors({});
      } else {
        setStatus("error");
        setStatusMessage(result.message || "Something went wrong. Please try again.");
        if (result.errors) setErrors(result.errors);
      }
    } catch (err) {
      setStatus("error");
      setStatusMessage(
        err instanceof Error
          ? err.message
          : "Network error. Please try again or email contact@brandanthonymcdonald.com."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-gray-50 section-padding pt-32">
      <div className="container-max">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Start a project
            </h1>
            <p className="text-lg text-gray-600">
              Tell me about the app you want built. About 5 minutes — the more you share,
              the more thoughtful my first response.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            {status === "success" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Got it.</h2>
                <p className="text-gray-700 mb-6">{statusMessage}</p>
                <Link
                  href="/projects"
                  className="inline-block btn-primary bg-blue-600 text-white hover:bg-blue-700"
                >
                  See what I&apos;m building
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                {status === "error" && statusMessage && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{statusMessage}</span>
                  </div>
                )}

                {/* Section 1 — About you */}
                <fieldset className="space-y-4">
                  <SectionHeading step={1} title="About you" />
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      aria-invalid={!!errors.name}
                      className={inputClass(!!errors.name)}
                      placeholder="Your full name"
                      required
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      aria-invalid={!!errors.email}
                      className={inputClass(!!errors.email)}
                      placeholder="you@example.com"
                      required
                    />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                      Your role
                    </label>
                    <input
                      id="role"
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      aria-invalid={!!errors.role}
                      className={inputClass(!!errors.role)}
                      placeholder="Founder, Producer, Head of Product, etc."
                    />
                    {errors.role && <p className="text-red-600 text-sm mt-1">{errors.role}</p>}
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company / organization
                    </label>
                    <input
                      id="company"
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      aria-invalid={!!errors.company}
                      className={inputClass(!!errors.company)}
                      placeholder="Where are you building from?"
                    />
                    {errors.company && (
                      <p className="text-red-600 text-sm mt-1">{errors.company}</p>
                    )}
                  </div>
                </fieldset>

                {/* Section 2 — The project */}
                <fieldset className="space-y-4">
                  <SectionHeading step={2} title="The project" />
                  <div>
                    <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                      Working title
                    </label>
                    <input
                      id="projectName"
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      aria-invalid={!!errors.projectName}
                      className={inputClass(!!errors.projectName)}
                      placeholder="What are you calling it for now?"
                    />
                    {errors.projectName && (
                      <p className="text-red-600 text-sm mt-1">{errors.projectName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="oneLinePitch" className="block text-sm font-medium text-gray-700 mb-2">
                      In one sentence, what are you building? *
                    </label>
                    <input
                      id="oneLinePitch"
                      type="text"
                      name="oneLinePitch"
                      value={formData.oneLinePitch}
                      onChange={handleChange}
                      aria-invalid={!!errors.oneLinePitch}
                      className={inputClass(!!errors.oneLinePitch)}
                      placeholder="e.g. A live stat-tracking app for high-school lacrosse broadcasts."
                      required
                    />
                    {errors.oneLinePitch && (
                      <p className="text-red-600 text-sm mt-1">{errors.oneLinePitch}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="coreProblem" className="block text-sm font-medium text-gray-700 mb-2">
                      What problem does this solve, and for whom? *
                    </label>
                    <textarea
                      id="coreProblem"
                      name="coreProblem"
                      value={formData.coreProblem}
                      onChange={handleChange}
                      rows={4}
                      aria-invalid={!!errors.coreProblem}
                      className={textareaClass(!!errors.coreProblem)}
                      placeholder="What's broken or missing today, and who feels that pain?"
                      required
                    />
                    {errors.coreProblem && (
                      <p className="text-red-600 text-sm mt-1">{errors.coreProblem}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="users" className="block text-sm font-medium text-gray-700 mb-2">
                      Who are the primary users?
                    </label>
                    <textarea
                      id="users"
                      name="users"
                      value={formData.users}
                      onChange={handleChange}
                      rows={2}
                      aria-invalid={!!errors.users}
                      className={textareaClass(!!errors.users)}
                      placeholder="e.g. play-by-play broadcasters, coaches, stat crew, fans following the live stream"
                    />
                    {errors.users && (
                      <p className="text-red-600 text-sm mt-1">{errors.users}</p>
                    )}
                  </div>
                </fieldset>

                {/* Section 3 — Scope */}
                <fieldset className="space-y-4">
                  <SectionHeading step={3} title="Scope" />
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      Platforms (select all that apply)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {PLATFORM_LABELS.map(({ key, label }) => {
                        const checked = formData.platforms.includes(key);
                        return (
                          <label
                            key={key}
                            className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                              checked
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => togglePlatform(key)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-800">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.platforms && (
                      <p className="text-red-600 text-sm mt-1">{errors.platforms}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="mustHaves" className="block text-sm font-medium text-gray-700 mb-2">
                      Top must-have features *
                    </label>
                    <textarea
                      id="mustHaves"
                      name="mustHaves"
                      value={formData.mustHaves}
                      onChange={handleChange}
                      rows={4}
                      aria-invalid={!!errors.mustHaves}
                      className={textareaClass(!!errors.mustHaves)}
                      placeholder="3–5 features the app can't ship without."
                      required
                    />
                    {errors.mustHaves && (
                      <p className="text-red-600 text-sm mt-1">{errors.mustHaves}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="niceToHaves" className="block text-sm font-medium text-gray-700 mb-2">
                      Nice-to-haves
                    </label>
                    <textarea
                      id="niceToHaves"
                      name="niceToHaves"
                      value={formData.niceToHaves}
                      onChange={handleChange}
                      rows={3}
                      aria-invalid={!!errors.niceToHaves}
                      className={textareaClass(!!errors.niceToHaves)}
                      placeholder="Features that would be great but aren't blocking."
                    />
                    {errors.niceToHaves && (
                      <p className="text-red-600 text-sm mt-1">{errors.niceToHaves}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="integrations" className="block text-sm font-medium text-gray-700 mb-2">
                      Existing systems or integrations
                    </label>
                    <textarea
                      id="integrations"
                      name="integrations"
                      value={formData.integrations}
                      onChange={handleChange}
                      rows={3}
                      aria-invalid={!!errors.integrations}
                      className={textareaClass(!!errors.integrations)}
                      placeholder="APIs, data sources, broadcast/streaming tools, scoring systems, etc."
                    />
                    {errors.integrations && (
                      <p className="text-red-600 text-sm mt-1">{errors.integrations}</p>
                    )}
                  </div>
                </fieldset>

                {/* Section 4 — Timeline & budget */}
                <fieldset className="space-y-4">
                  <SectionHeading step={4} title="Timeline & budget" />
                  <div>
                    <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Target launch / MVP date
                    </label>
                    <input
                      id="targetDate"
                      type="text"
                      name="targetDate"
                      value={formData.targetDate}
                      onChange={handleChange}
                      aria-invalid={!!errors.targetDate}
                      className={inputClass(!!errors.targetDate)}
                      placeholder='e.g. "Q3 2026", "before March", "no fixed date"'
                    />
                    {errors.targetDate && (
                      <p className="text-red-600 text-sm mt-1">{errors.targetDate}</p>
                    )}
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      Budget range
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {BUDGET_LABELS.map(({ key, label }) => {
                        const checked = formData.budgetRange === key;
                        return (
                          <label
                            key={key}
                            className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                              checked
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            <input
                              type="radio"
                              name="budgetRange"
                              value={key}
                              checked={checked}
                              onChange={() => setRadio("budgetRange", key)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-800">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.budgetRange && (
                      <p className="text-red-600 text-sm mt-1">{errors.budgetRange}</p>
                    )}
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      How urgent is this?
                    </span>
                    <div className="space-y-2">
                      {URGENCY_LABELS.map(({ key, label }) => {
                        const checked = formData.urgency === key;
                        return (
                          <label
                            key={key}
                            className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                              checked
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            <input
                              type="radio"
                              name="urgency"
                              value={key}
                              checked={checked}
                              onChange={() => setRadio("urgency", key)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-800">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.urgency && (
                      <p className="text-red-600 text-sm mt-1">{errors.urgency}</p>
                    )}
                  </div>
                </fieldset>

                {/* Section 5 — Logistics */}
                <fieldset className="space-y-4">
                  <SectionHeading step={5} title="Logistics" />
                  <div>
                    <label htmlFor="decisionMakers" className="block text-sm font-medium text-gray-700 mb-2">
                      Who else on your side will be involved?
                    </label>
                    <textarea
                      id="decisionMakers"
                      name="decisionMakers"
                      value={formData.decisionMakers}
                      onChange={handleChange}
                      rows={2}
                      aria-invalid={!!errors.decisionMakers}
                      className={textareaClass(!!errors.decisionMakers)}
                      placeholder="Other decision-makers, technical leads, end-user reps, etc."
                    />
                    {errors.decisionMakers && (
                      <p className="text-red-600 text-sm mt-1">{errors.decisionMakers}</p>
                    )}
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred next step
                    </span>
                    <div className="space-y-2">
                      {NEXT_STEP_LABELS.map(({ key, label }) => {
                        const checked = formData.nextStep === key;
                        return (
                          <label
                            key={key}
                            className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                              checked
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            <input
                              type="radio"
                              name="nextStep"
                              value={key}
                              checked={checked}
                              onChange={() => setRadio("nextStep", key)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-800">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                    {errors.nextStep && (
                      <p className="text-red-600 text-sm mt-1">{errors.nextStep}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="referrer" className="block text-sm font-medium text-gray-700 mb-2">
                      How did you hear about me?
                    </label>
                    <input
                      id="referrer"
                      type="text"
                      name="referrer"
                      value={formData.referrer}
                      onChange={handleChange}
                      aria-invalid={!!errors.referrer}
                      className={inputClass(!!errors.referrer)}
                      placeholder="Referral, search, conference, social, etc."
                    />
                    {errors.referrer && (
                      <p className="text-red-600 text-sm mt-1">{errors.referrer}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Anything else I should know?
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      aria-invalid={!!errors.notes}
                      className={textareaClass(!!errors.notes)}
                      placeholder="Constraints, prior attempts, hard requirements, things you don't want."
                    />
                    {errors.notes && (
                      <p className="text-red-600 text-sm mt-1">{errors.notes}</p>
                    )}
                  </div>
                </fieldset>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send intake"}
                </button>

                <p className="text-xs text-gray-500 text-center pt-2">
                  Protected by reCAPTCHA — Google&apos;s{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    className="underline hover:text-blue-600"
                  >
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://policies.google.com/terms"
                    className="underline hover:text-blue-600"
                  >
                    Terms
                  </a>{" "}
                  apply.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SurveyForm() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!recaptchaSiteKey) {
    return (
      <main className="bg-gray-50 section-padding pt-32">
        <div className="container-max max-w-2xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-red-700 mb-2">
              Form temporarily unavailable
            </h2>
            <p className="text-red-700">
              Please email{" "}
              <a className="underline" href="mailto:contact@brandanthonymcdonald.com">
                contact@brandanthonymcdonald.com
              </a>{" "}
              and I&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      <Suspense fallback={null}>
        <SurveyFormInner />
      </Suspense>
    </GoogleReCaptchaProvider>
  );
}

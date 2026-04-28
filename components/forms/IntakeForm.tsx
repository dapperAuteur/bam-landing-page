"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import { AlertTriangle, CheckCircle } from "lucide-react";

export type IntakeFormType = "hire" | "partner";

interface IntakeFormConfig {
  formType: IntakeFormType;
  recaptchaAction: string;
  apiEndpoint: string;
  headline: string;
  subheadline: string;
  contextLabel: string;
  contextPlaceholder: string;
  messagePlaceholder: string;
  submitLabel: string;
}

interface FormState {
  name: string;
  email: string;
  roleOrTitle: string;
  company: string;
  link: string;
  message: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  roleOrTitle: "",
  company: "",
  link: "",
  message: "",
};

function IntakeFormInner({ config }: { config: IntakeFormConfig }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const searchParams = useSearchParams();
  const utmSource = searchParams.get("utm_source") || "";
  const utmCampaign = searchParams.get("utm_campaign") || "";

  const [formData, setFormData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    setStatus("idle");
  }, [config.formType]);

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
      const recaptchaToken = await executeRecaptcha(config.recaptchaAction);

      const res = await fetch(config.apiEndpoint, {
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
    <section className="bg-gray-50 section-padding pt-32">
      <div className="container-max">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {config.headline}
            </h1>
            <p className="text-lg text-gray-600">{config.subheadline}</p>
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
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {status === "error" && statusMessage && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                    <span>{statusMessage}</span>
                  </div>
                )}

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
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                      errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
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
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                      errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="you@example.com"
                    required
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="roleOrTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    {config.contextLabel}
                  </label>
                  <input
                    id="roleOrTitle"
                    type="text"
                    name="roleOrTitle"
                    value={formData.roleOrTitle}
                    onChange={handleChange}
                    aria-invalid={!!errors.roleOrTitle}
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                      errors.roleOrTitle ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder={config.contextPlaceholder}
                  />
                  {errors.roleOrTitle && (
                    <p className="text-red-600 text-sm mt-1">{errors.roleOrTitle}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company / Organization
                  </label>
                  <input
                    id="company"
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    aria-invalid={!!errors.company}
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                      errors.company ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Where are you reaching out from?"
                  />
                  {errors.company && (
                    <p className="text-red-600 text-sm mt-1">{errors.company}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                    Link (optional)
                  </label>
                  <input
                    id="link"
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    aria-invalid={!!errors.link}
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                      errors.link ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder="Job posting, company site, LinkedIn, etc."
                  />
                  {errors.link && <p className="text-red-600 text-sm mt-1">{errors.link}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    aria-invalid={!!errors.message}
                    className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-vertical ${
                      errors.message ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                    placeholder={config.messagePlaceholder}
                    required
                  />
                  {errors.message && (
                    <p className="text-red-600 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : config.submitLabel}
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
    </section>
  );
}

export default function IntakeForm({ config }: { config: IntakeFormConfig }) {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!recaptchaSiteKey) {
    return (
      <section className="bg-gray-50 section-padding pt-32">
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
      </section>
    );
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      <Suspense fallback={null}>
        <IntakeFormInner config={config} />
      </Suspense>
    </GoogleReCaptchaProvider>
  );
}

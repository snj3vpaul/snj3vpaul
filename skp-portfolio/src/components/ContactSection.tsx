// src/components/ContactSection.tsx
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import { z } from "zod";

/**
 * Secrets-free contact section.
 *
 * SECURITY NOTE: a Vite SPA has no backend, so never put SMTP credentials
 * (e.g. via nodemailer) in this file — they would ship in the public bundle.
 * Instead, set VITE_CONTACT_ENDPOINT to a no-secrets form service
 * (Web3Forms / Formspree) or your own Vercel serverless function (/api/contact).
 * If unset, the form gracefully falls back to a mailto: link.
 */

const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;
const EMAIL = "sanjeevkumarpaul25@gmail.com"; // <- replace with your preferred contact address

const ContactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "A little more detail, please (10+ characters)."),
});

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const statusRef = useRef<HTMLParagraphElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
      // honeypot — bots fill this; humans never see it
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
    };

    if (data.company) return; // silently drop spam

    const parsed = ContactSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    // No endpoint configured → graceful mailto fallback.
    if (!ENDPOINT) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${parsed.data.name}`);
      const body = encodeURIComponent(`${parsed.data.message}\n\n— ${parsed.data.name} (${parsed.data.email})`);
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
      return;
    }

    try {
      setStatus("submitting");
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus("success");
      setMessage("Thanks — your message was sent. I’ll get back to you shortly.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please email me directly using the link below.");
    } finally {
      // move screen-reader focus to the status message
      statusRef.current?.focus();
    }
  }

  return (
    <section id="contact" className="mx-auto w-full max-w-3xl px-6 py-24 text-neutral-100">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">Contact</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Let’s talk about your security or compliance initiative
        </h2>
        <p className="mt-3 max-w-xl text-neutral-400">
          Whether it’s cryptographic validation, a FIPS 140-3 / NDcPP / EUCC effort, or
          coordinating a documentation-heavy security program — I’m happy to discuss scope.
        </p>
      </motion.header>

      <form onSubmit={handleSubmit} noValidate className="grid gap-5">
        {/* honeypot (visually hidden, off-screen, not announced) */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />

        <Field id="name" label="Name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950/60 px-4 py-3 outline-none transition focus:border-neutral-500"
          />
        </Field>

        <Field id="email" label="Email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-950/60 px-4 py-3 outline-none transition focus:border-neutral-500"
          />
        </Field>

        <Field id="message" label="Message" error={errors.message}>
          <textarea
            id="message"
            name="message"
            rows={5}
            aria-invalid={!!errors.message}
            className="w-full resize-y rounded-lg border border-neutral-800 bg-neutral-950/60 px-4 py-3 outline-none transition focus:border-neutral-500"
          />
        </Field>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="rounded-lg bg-neutral-100 px-5 py-3 font-medium text-neutral-900 transition hover:bg-white disabled:opacity-60"
          >
            {status === "submitting" ? "Sending…" : "Send message"}
          </button>

          <a
            href={`mailto:${EMAIL}`}
            className="text-sm text-neutral-400 underline-offset-4 hover:text-neutral-200 hover:underline"
          >
            …or email me directly
          </a>
        </div>

        <p
          ref={statusRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className={`text-sm outline-none ${
            status === "error" ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {message}
        </p>
      </form>

      <div className="mt-10 flex items-center gap-6 text-neutral-400">
        <a aria-label="Email" href={`mailto:${EMAIL}`} className="transition hover:text-neutral-100">
          <FaEnvelope size={20} />
        </a>
        <a
          aria-label="LinkedIn"
          href="https://www.linkedin.com/in/sanjeev-kumar-paul/"
          target="_blank"
          rel="noreferrer noopener"
          className="transition hover:text-neutral-100"
        >
          <FaLinkedin size={20} />
        </a>
        <a
          aria-label="GitHub"
          href="https://github.com/snj3vpaul/"
          target="_blank"
          rel="noreferrer noopener"
          className="transition hover:text-neutral-100"
        >
          <FaGithub size={20} />
        </a>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm text-neutral-300">
        {label}
      </label>
      {children}
      {error ? (
        <span id={`${id}-error`} className="text-sm text-red-400">
          {error}
        </span>
      ) : null}
    </div>
  );
}

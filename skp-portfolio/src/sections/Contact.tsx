// src/sections/Contact.tsx
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { profile } from "../data/portfolio";

/**
 * Secrets-free contact. Set VITE_CONTACT_ENDPOINT (Formspree / Web3Forms / your
 * own /api/contact serverless function) to enable inline sending. If unset, the
 * form falls back to a mailto: link. NEVER put SMTP credentials in this file.
 */
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;

type Errors = { name?: boolean; email?: boolean; message?: boolean };

export default function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<{ msg: string; ok: boolean }>({ msg: "", ok: true });
  const [sending, setSending] = useState(false);
  const statusRef = useRef<HTMLParagraphElement>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const company = (form.elements.namedItem("company") as HTMLInputElement).value;
    if (company) return; // honeypot

    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim();

    const errs: Errors = {
      name: name.length < 2,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
      message: message.length < 10,
    };
    setErrors(errs);
    if (errs.name || errs.email || errs.message) {
      setStatus({ msg: "Please fix the highlighted fields.", ok: false });
      return;
    }

    if (!ENDPOINT) {
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus({ msg: "Opening your email client…", ok: true });
      return;
    }

    try {
      setSending(true);
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus({ msg: "Thanks — your message was sent.", ok: true });
      form.reset();
    } catch {
      setStatus({ msg: "Something went wrong. Please email me directly below.", ok: false });
    } finally {
      setSending(false);
      statusRef.current?.focus();
    }
  }

  return (
    <section id="contact">
      <div className="wrap">
        <div className="reveal">
          <div className="eyebrow">
            <span className="num">07</span> Contact
          </div>
          <h2 className="title">Let's talk about your security or compliance initiative.</h2>
          <p className="lead">
            Cryptographic validation, a FIPS 140-3 / NDcPP / EUCC effort, or coordinating a
            documentation-heavy security program — happy to discuss scope.
          </p>
        </div>

        <div className="contact-grid">
          <form onSubmit={onSubmit} noValidate className="reveal">
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: -9999, width: 0, height: 0, opacity: 0 }}
            />
            <div className={`field${errors.name ? " invalid" : ""}`}>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" type="text" autoComplete="name" aria-invalid={!!errors.name} />
              <span className="err">Please enter your name.</span>
            </div>
            <div className={`field${errors.email ? " invalid" : ""}`}>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} />
              <span className="err">Please enter a valid email.</span>
            </div>
            <div className={`field${errors.message ? " invalid" : ""}`}>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={5} aria-invalid={!!errors.message} />
              <span className="err">A little more detail, please.</span>
            </div>
            <div className="form-foot">
              <button className="btn primary" type="submit" disabled={sending}>
                {sending ? "Sending…" : "Send message"}
              </button>
              <p
                ref={statusRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                className="form-status"
                style={{ color: status.ok ? "var(--ok)" : "#ff8a8a" }}
              >
                {status.msg}
              </p>
            </div>
          </form>

          <div className="direct reveal">
            <a className="row" href={`mailto:${profile.email}`}>
              <span className="ic">@</span>
              <span>
                <span className="rlabel">Email</span>
                <br />
                <span className="meta">{profile.email}</span>
              </span>
            </a>
            <a className="row" href={profile.links.linkedin} target="_blank" rel="noreferrer noopener">
              <span className="ic">in</span>
              <span>
                <span className="rlabel">LinkedIn</span>
                <br />
                <span className="meta">/in/sanjeev-kumar-paul</span>
              </span>
            </a>
            <a className="row" href={profile.links.github} target="_blank" rel="noreferrer noopener">
              <span className="ic">{"{ }"}</span>
              <span>
                <span className="rlabel">GitHub</span>
                <br />
                <span className="meta">/snj3vpaul</span>
              </span>
            </a>
            <a className="row" href={profile.links.medium} target="_blank" rel="noreferrer noopener">
              <span className="ic">M</span>
              <span>
                <span className="rlabel">Writing</span>
                <br />
                <span className="meta">medium.com/@sanjeevkumarpaul25</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

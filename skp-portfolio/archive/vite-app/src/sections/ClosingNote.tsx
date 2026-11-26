
import { profile } from "../data/portfolio";
import { hybridContent } from "../data/hybridContent";
import Contact from "./Contact";

export default function ClosingNote() {
  return (
    <section
      id="contact"
      className="hyb-closing-note"
      aria-labelledby="closing-note-title"
    >
      <div className="hyb-container">
        <div className="hyb-note-header">
          <span className="hyb-kicker">
            08 / A CLOSING NOTE
          </span>

          <span className="hyb-note-author">
            SANJEEV K. PAUL
          </span>
        </div>

        <div className="hyb-note-content">
          <h2 id="closing-note-title">
            {hybridContent.contactTitle}
          </h2>

          <p>{hybridContent.contactText}</p>

          <p>{hybridContent.contactInvitation}</p>

          <p className="hyb-note-thought">
            {hybridContent.contactSignoff}
          </p>
        </div>

        <div className="hyb-note-footer">
          <a
            className="hyb-note-email"
            href={`mailto:${profile.email}`}
          >
            Send me a note
            <span aria-hidden="true">↗</span>
          </a>

          <div className="hyb-note-social">
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>

            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        <details className="hyb-note-form">
          <summary>
            Prefer a contact form?
            <span aria-hidden="true">+</span>
          </summary>

          <Contact id="contact-form" />
        </details>
      </div>
    </section>
  );
}

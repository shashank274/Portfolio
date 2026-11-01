import { site } from "@/lib/content";

export function Contact() {
  return (
    <section id="contact" className="contact">
      <p className="label" style={{ margin: 0 }}>
        final_answer:
      </p>
      <a href={`mailto:${site.email}`} className="contact-mail">
        {site.email}
      </a>
      <p>Amsterdam, Netherlands · AI engineering and tech consulting</p>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} {site.name}</span>
      <span className="footer-links">
        <a href={site.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={site.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={`mailto:${site.email}`}>Email</a>
      </span>
    </footer>
  );
}

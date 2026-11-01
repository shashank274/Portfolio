import { site } from "@/lib/content";

export default function Buttons() {
  return (
    <div className="btns">
      {site.resumeUrl ? (
        <a href={site.resumeUrl} className="btn primary" download>
          Resume ↓
        </a>
      ) : (
        <a href="#work" className="btn primary">
          See my work
        </a>
      )}
      <a href={`mailto:${site.email}`} className="btn">
        Email
      </a>
      <a href={site.linkedin} className="btn" target="_blank" rel="noreferrer">
        LinkedIn
      </a>
      <a href={site.github} className="btn" target="_blank" rel="noreferrer">
        GitHub
      </a>
    </div>
  );
}

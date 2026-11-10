import { LINKS } from "@/lib/projects";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-x flex flex-col gap-3 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Shashank Kanangi</p>
        <ul className="flex gap-6">
          <li><a className="link-draw text-foreground" href={`mailto:${LINKS.email}`}>Email</a></li>
          <li><a className="link-draw text-foreground" href={LINKS.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></li>
          <li><a className="link-draw text-foreground" href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a></li>
        </ul>
      </div>
    </footer>
  );
}

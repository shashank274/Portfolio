# Shashank Kanangi · portfolio

Personal site built with Next.js (App Router) and Tailwind CSS. Light editorial "two lenses" design: every project can be read through a Business lens (problem, who it was for, what changed) or a Technical lens (architecture, how it works, stack).

## Interactive demos

`/demos/hoistra`, `/demos/erp-ai`, `/demos/pearity` and `/demos/trace-lab` are front-end only demos of each project. They run in the browser on made-up sample data (`components/demos/*`), with no backend and no API keys. Each project page links to its demo.

## Edit the content

Project text lives in `lib/projects.ts`. The homepage sections (hero, numbers, what I bring, about, experience, education, skills) are in `app/(site)/page.tsx`.

- **Resume:** put your PDF in `public/resume.pdf` and add a link to it in the hero buttons in `app/(site)/page.tsx`.
- **Project links:** add them later in `lib/projects.ts` when the repos are public.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Deploy on Vercel

1. Go to vercel.com → Add New → Project → import this GitHub repo.
2. Keep the defaults (Vercel detects Next.js) and click Deploy.
3. Optional: in Project → Settings → Environment Variables add `NEXT_PUBLIC_SITE_URL` with your final address (for example `https://shashankkanangi.com`), so link previews on LinkedIn use the right URL.
4. Optional: Project → Settings → Domains to add your own domain.

Every push to `main` redeploys the site automatically.

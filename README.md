# Shashank Kanangi · portfolio

Personal site built with Next.js (App Router). Dark "trace run" design: projects are shown as steps in an AI trace, and the hero has an animated diagram of how Hoistra answers a question.

## Edit the content

All text lives in `lib/content.ts`: intro, projects, project pages, about, experience, education and skills.

- **Resume button:** put your PDF in `public/resume.pdf`, then set `resumeUrl: "/resume.pdf"` in `lib/content.ts`.
- **Project links:** add them later in `lib/content.ts` when the repos or demos are public.

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

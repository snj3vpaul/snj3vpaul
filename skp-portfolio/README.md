# Sanjeev K Paul — portfolio (v2)

Next.js 16 + React 19, exported as static files. Motion for React for transitions; one hand-written WebGL2 shader in the hero. The architecture and its trade-offs are in [ARCHITECTURE.md](ARCHITECTURE.md).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export → out/ → dist/ (what Vercel serves)
npm run typecheck
```

## Where things are

| Path | What it holds |
| --- | --- |
| `lib/content.ts` | Every public fact on the home page. Edit words here. |
| `app/page.tsx` | The page, section by section (server-rendered). |
| `app/globals.css` | Tokens (palette, type, motion) and all styles. |
| `components/CipherField.tsx` | Hero WebGL2 cipher field. |
| `components/Pipeline.tsx` | The Assurance Pipeline (scroll story on wide screens, list elsewhere). |
| `components/WorkRail.tsx` | Professional work rail and case-study sheet. |
| `components/ProjectTabs.tsx`, `CipherWheel.tsx`, `PersonalBand.tsx` | Personal projects. |
| `components/SiteChrome.tsx`, `Enhancements.tsx` | Header, menu, progress, jump list; reveals, clock, deep links, analytics. |
| `public/` | Fonts, videos, CV, OG image, favicon, and the project pages (unchanged static HTML). |
| `archive/` | The previous static site and the older Vite app. Not built. |

Owner notes and content still to confirm are in `CONTENT-NOTES.md` (not published).

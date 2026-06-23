# Pranati Arni — Portfolio

An interactive portfolio built around a **trajectory rail**: a glowing spine pinned to the
left edge that fills as you scroll, with clickable nodes that jump to each section
(About · Projects · Skills · Contact). Black / white / silver-metallic theme with a single
restrained **blue** accent, and continuous subtle motion throughout.

Two pages:
- **`index.html`** — the home page with the rail.
- **`projects.html`** — a dedicated full projects page.

No build step, no frameworks. Styles and behavior are shared across both pages via
`styles.css` and `script.js`. Fonts load from the Google Fonts CDN.

---

## ✏️ How to edit

### Add a real project (shows on BOTH pages)
Open **`script.js`** and edit the `projects` array near the top:

```js
const projects = [
  { title: "My First App", desc: "What it does.", tag: "Web App",
    link: "https://github.com/pranatiarni/my-app", status: "live" },
  // ...
];
```

- Copy one `{ ... }` object, fill it in, and end with a comma.
- Set **`status: "live"`** for a real project, or **`"soon"`** for a placeholder card.
- `link` is optional — leave `""` if there's nothing to link yet.

Because both pages read the same list, adding one project updates the home page and the
projects page at once.

### Fill in your links
In `index.html`, the **Contact** chips marked `is-todo` are placeholders:
- **LinkedIn** — replace `href="#"` with your profile URL.
- **Kaggle / Résumé** — replace the `href`, or delete the chip if you don't want it.

### Change the colors
At the top of **`styles.css`**, in `:root`:

```css
--blue:   #4ea3ff;   /* the accent — swap for a different signature color */
--silver: #aeb4c0;   /* the metallic glow/highlight tone */
```

### Other quick edits
- **Skills** — add `<span class="tag">Tool</span>` chips in the Skills section of `index.html`.
- **Tagline** — there's a `TAGLINE SLOT` comment in the hero if you ever want one.
- **Kicker** — the small `Portfolio · Frisco, TX · Est. 2026` line is easy to change or remove.

---

## 🚀 Deploy to Cloudflare Pages

### Connect to GitHub (recommended — auto-deploys on every push)
1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pick your **porfolio** repo. Build settings:
   - **Framework preset:** `None`
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
3. **Save and Deploy.** Every `git push` now redeploys automatically.

### Everyday workflow
After editing, publish with three commands (run them in a terminal in this folder, or type
them here in Claude Code with a `!` in front):

```bash
git add .
git commit -m "what you changed"
git push
```

### Direct upload (alternative, no Git)
Cloudflare → **Pages** → **Upload assets**, then drag the **whole folder** in (all four files
must go up together — `index.html`, `projects.html`, `styles.css`, `script.js`).

### After deploying
Update the social-preview URL in `index.html`:

```html
<meta property="og:url" content="https://your-site.pages.dev" />
```

---

## 📁 Files
| File | Purpose |
|------|---------|
| `index.html`    | Home page — hero, rail, About / Projects / Skills / Contact. |
| `projects.html` | Dedicated full projects page. |
| `styles.css`    | All styles, shared by both pages. |
| `script.js`     | All behavior + the `projects` data, shared by both pages. |
| `README.md`     | This guide. |

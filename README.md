# Atzin CV — Interactive Terminal Résumé

An interactive, terminal/boot-screen styled résumé built with **React + Vite**.
Type commands in the shell, navigate sections reactively, and download the CV as a
PDF generated on the fly with **jsPDF** — no external files needed.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build      # output goes to /dist
npm run preview    # preview the production build locally
```

## Commands available in the terminal

`help`, `about` / `whoami`, `experience`, `skills`, `projects`, `education`,
`languages`, `contact`, `all`, `pdf`, `linkedin`, `email`, `whatsapp`, `clear`.

Keyboard shortcuts: **F1** PDF · **F2** Experience · **F3** Email · **F4** WhatsApp · **F5** LinkedIn.

## Deploy

### Vercel (easiest)
1. Push this folder to a GitHub repo.
2. Go to vercel.com → "New Project" → import the repo.
3. Framework preset: **Vite**. Click Deploy. Done — you get a public URL.

### Netlify
1. Push to GitHub (or drag the project folder to app.netlify.com).
2. Build command: `npm run build` · Publish directory: `dist`.

### GitHub Pages
1. In `vite.config.js`, set `base: "/<your-repo-name>/"`.
2. `npm run build`, then publish the `dist` folder (e.g. with the `gh-pages` package).

## Editing your CV

All content lives in the `CV` object at the top of `src/App.jsx`.
Change text there and both the on-screen résumé and the generated PDF update.

---

Built by Atzin Emiliano Guerrero Leyva.

<div align="center">

# StudyFlow

**Academic Command Center & Interactive Study Hub**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://vercel.com)

</div>

---

## Overview

StudyFlow is a modern, client-side web application designed for university and college students. It consolidates course tracking, flashcard study, math note-taking, and focus timing into a single, cohesive workspace — no account or backend required.

---

## Features

| Module | Description |
|--------|-------------|
| **Dashboard** | Course and assignment tracker with priority badges, deadline countdowns, and status filters |
| **Flashcards** | 3D flip-card quiz engine with deck management and score tracking |
| **Notes** | Markdown editor with live preview and KaTeX LaTeX math rendering |
| **Pomodoro Timer** | Circular SVG progress ring with configurable focus and break intervals |
| **Theme** | System-aware dark and light mode with smooth transitions |

---

## Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout with ThemeProvider
│   ├── page.tsx            # Tab navigation and view switching
│   └── globals.css         # Tailwind base, glassmorphism, 3D flip utilities
├── components/
│   ├── Navbar.tsx
│   ├── ThemeToggle.tsx
│   ├── TaskManager.tsx
│   ├── FlashcardDeck.tsx
│   ├── NotesVault.tsx
│   └── PomodoroTimer.tsx
├── hooks/
│   └── useLocalStorage.ts  # Persistent client-side state
└── types/
    └── index.ts
```

All data is persisted via `localStorage` — the app works fully offline with no external dependencies at runtime.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS, Framer Motion |
| Math Rendering | KaTeX via `react-markdown` + `rehype-katex` |
| Icons | Lucide React |
| Theme | `next-themes` |
| Storage | Browser `localStorage` |
| Hosting | Vercel (free tier) |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher

### Installation

```bash
git clone https://github.com/<YOUR_USERNAME>/studyflow.git
cd studyflow
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Project Management

This project was tracked using **Jira Software** (free tier) with the `SF` project key. Commits follow the Jira ticket convention:

```
SF-1: project shell and theme setup
SF-2: course and assignment tracker
SF-3: 3D flashcard engine with quiz mode
SF-4: markdown notes with KaTeX math rendering
SF-5: animated pomodoro focus timer
SF-6: github repository and vercel deployment
```

The [GitHub for Jira](https://marketplace.atlassian.com/apps/1219592/github-for-jira) integration links each commit directly to its corresponding issue on the board.

---

## Deployment

The application is continuously deployed via Vercel. Any push to `main` triggers an automatic build and deployment.

To deploy your own instance:

1. Push the repository to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Select the repository — Next.js is auto-detected.
4. Click **Deploy**.

---

## License

MIT — see [LICENSE](LICENSE) for details.

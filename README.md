<div align="center">

# 🎓 StudyFlow

### Academic Command Center & Interactive Study Hub

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-purple?logo=framer)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://vercel.com)

**A modern, visually stunning study workspace** for university students — featuring course tracking, 3D flip flashcards, LaTeX math notes, and a Pomodoro focus timer.

[Live Demo →](https://studyflow-your-username.vercel.app) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 📊 **Dashboard** | Course & assignment tracker with priority badges, deadline countdowns, and smart filters |
| 🎴 **3D Flashcards** | Interactive flip-card quiz engine with smooth 3D CSS animations and score tracking |
| 📝 **Notes Vault** | Markdown editor with live preview and full **KaTeX LaTeX math** equation rendering |
| ⏱️ **Pomodoro Timer** | Beautiful circular SVG progress ring with Focus / Short Break / Long Break modes |
| 🌙 **Dark/Light Mode** | Seamless theme switching with glassmorphism cards and smooth transitions |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
│  ┌──────────┬──────────┬──────────┬──────────┐              │
│  │Dashboard │Flashcards│  Notes   │ Pomodoro │  ← Tabs      │
│  │TaskMgr   │3D Quiz   │ Markdown │SVG Timer │              │
│  └────┬─────┴────┬─────┴────┬─────┴────┬─────┘              │
│       └──────────┴──────────┴──────────┘                     │
│                        │                                     │
│              useLocalStorage Hook                            │
│           (Offline-First Persistence)                        │
│                                                              │
│  Tech: TypeScript · Tailwind CSS · Framer Motion · KaTeX     │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ installed

### Installation
```bash
# Clone the repository
git clone https://github.com/<YOUR_USERNAME>/studyflow.git
cd studyflow

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with ThemeProvider
│   ├── page.tsx            # Main dashboard with tab navigation
│   └── globals.css         # Tailwind + glassmorphism + 3D flip styles
├── components/
│   ├── Navbar.tsx           # Top navigation with animated tabs
│   ├── ThemeToggle.tsx      # Dark/Light mode animated toggle
│   ├── TaskManager.tsx      # Course & assignment CRUD tracker
│   ├── FlashcardDeck.tsx    # 3D flip card quiz engine
│   ├── NotesVault.tsx       # Markdown + LaTeX math editor
│   └── PomodoroTimer.tsx    # Circular SVG focus timer
├── hooks/
│   └── useLocalStorage.ts   # Persistent state management
└── types/
    └── index.ts             # TypeScript interfaces
```

## 📋 Jira Agile Workflow

This project was managed using **Jira Software** with the following user stories:

| Ticket | Summary | Status |
|--------|---------|--------|
| SF-1 | Project Shell & Dark/Light Theme | ✅ Done |
| SF-2 | Course & Assignment Tracker | ✅ Done |
| SF-3 | 3D Flip Flashcard & Quiz Engine | ✅ Done |
| SF-4 | Markdown Notes with LaTeX Math | ✅ Done |
| SF-5 | Animated Pomodoro Focus Timer | ✅ Done |
| SF-6 | GitHub & Vercel Deployment | ✅ Done |

Each git commit references its Jira ticket key (e.g., `SF-1: project shell & theme setup`).

## 🆓 Zero-Cost Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | Next.js + Tailwind CSS + Framer Motion | Free (OSS) |
| Hosting | Vercel | Free tier |
| Database | Client localStorage | Free |
| Project Mgmt | Jira Software Cloud | Free (≤10 users) |
| CI/CD | GitHub + Vercel Auto-Deploy | Free |

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  
  Built with 💜 by **[Your Name](https://github.com/YOUR_USERNAME)**
  
</div>

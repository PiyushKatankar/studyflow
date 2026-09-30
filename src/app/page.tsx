"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { TabKey } from "@/types";
import Navbar from "@/components/Navbar";
import TaskManager from "@/components/TaskManager";
import FlashcardDeck from "@/components/FlashcardDeck";
import NotesVault from "@/components/NotesVault";
import PomodoroTimer from "@/components/PomodoroTimer";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -16 },
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.25,
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/5" />
        <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/5" />
        <div className="absolute -bottom-40 right-1/3 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-500/5" />
      </div>

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            {activeTab === "dashboard" && <TaskManager />}
            {activeTab === "flashcards" && <FlashcardDeck />}
            {activeTab === "notes" && <NotesVault />}
            {activeTab === "pomodoro" && <PomodoroTimer />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-[var(--border-color)] py-6 text-center text-sm text-[var(--text-secondary)] transition-colors">
        <p>
          Built with 💜 using Next.js, Tailwind CSS & Framer Motion —{" "}
          <span className="font-semibold text-indigo-500">StudyFlow</span> ©{" "}
          {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

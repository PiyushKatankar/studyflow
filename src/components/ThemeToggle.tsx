"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/60 text-slate-500 shadow-sm backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-400"
      >
        <div className="h-5 w-5" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-indigo-400/50 hover:bg-white hover:text-indigo-600 hover:shadow-[0_0_18px_rgba(99,102,241,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-800/80 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-indigo-500/50 dark:hover:bg-slate-850 dark:hover:text-amber-400 dark:hover:shadow-[0_0_18px_rgba(251,191,36,0.2)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun-icon"
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <Sun className="h-5 w-5 text-amber-400 transition-colors group-hover:text-amber-300" />
          </motion.div>
        ) : (
          <motion.div
            key="moon-icon"
            initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <Moon className="h-5 w-5 text-indigo-600 transition-colors group-hover:text-indigo-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

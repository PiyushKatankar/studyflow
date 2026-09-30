"use client";

import React from "react";
import {
  GraduationCap,
  LayoutDashboard,
  Layers,
  FileText,
  Timer,
  LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { TabKey } from "@/types";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

interface NavItem {
  id: TabKey;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "flashcards",
    label: "Flashcards",
    icon: Layers,
  },
  {
    id: "notes",
    label: "Notes",
    icon: FileText,
  },
  {
    id: "pomodoro",
    label: "Pomodoro",
    icon: Timer,
  },
];

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/75 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800/80 dark:bg-slate-900/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand Section */}
        <button
          type="button"
          onClick={() => onTabChange("dashboard")}
          className="group flex items-center gap-2.5 rounded-xl text-left outline-none transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 transition-shadow duration-300 group-hover:shadow-indigo-500/40">
            <GraduationCap className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-6" />
          </div>
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
            StudyFlow
          </span>
        </button>

        {/* Tab Navigation */}
        <nav
          aria-label="Main Navigation"
          className="flex items-center gap-1 rounded-2xl border border-slate-200/70 bg-slate-100/70 p-1 backdrop-blur-md dark:border-slate-800/70 dark:bg-slate-800/50"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-highlight"
                    className="absolute inset-0 rounded-xl bg-white shadow-sm ring-1 ring-slate-950/5 dark:bg-slate-900 dark:ring-white/10"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-underline"
                    className="absolute -bottom-1 left-2 right-2 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Section / Theme Toggle */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export { Navbar };

"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, FileText, Edit3, Eye, Save, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Note } from "@/types";

const mockNotes: Note[] = [
  {
    id: "1",
    title: "Physics Formulas Cheat Sheet",
    content: `# Physics Formulas\n\n## Mechanics\n- Newton's Second Law: $F = ma$\n- Kinetic Energy: $KE = \\frac{1}{2}mv^2$\n- Gravitational PE: $PE = mgh$\n\n## Electromagnetism\n- Coulomb's Law: $F = k\\frac{q_1 q_2}{r^2}$\n- Ohm's Law: $V = IR$\n\n## Waves\n- Wave equation: $v = f\\lambda$\n- Energy: $E = hf$`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Calculus Quick Reference",
    content: `# Calculus Reference\n\n## Derivatives\n- Power Rule: $$\\frac{d}{dx} x^n = n x^{n-1}$$\n- Product Rule: $$\\frac{d}{dx} (uv) = u'v + uv'$$\n- Quotient Rule: $$\\frac{d}{dx} \\left(\\frac{u}{v}\\right) = \\frac{u'v - uv'}{v^2}$$\n\n## Integrals\n- Power Rule: $$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$$\n- Parts: $$\\int u dv = uv - \\int v du$$\n\n## Limits\n- L'Hopital's Rule: $$\\lim_{x \\to c} \\frac{f(x)}{g(x)} = \\lim_{x \\to c} \\frac{f'(x)}{g'(x)}$$`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "CS Algorithm Complexity",
    content: `# Algorithm Complexity\n\n| Algorithm | Time Complexity | Space Complexity |\n|-----------|-----------------|------------------|\n| Bubble Sort | $O(n^2)$ | $O(1)$ |\n| Merge Sort | $O(n \\log n)$ | $O(n)$ |\n| Quick Sort | $O(n \\log n)$ | $O(\\log n)$ |\n| Binary Search | $O(\\log n)$ | $O(1)$ |\n\n## Binary Search Pseudocode\n\n\`\`\`python\ndef binary_search(arr, target):\n    low = 0\n    high = len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\`\`\``,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export default function NotesVault() {
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useLocalStorage<Note[]>("studyflow-notes", mockNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(mockNotes[0]?.id ?? null);
  const [isEditing, setIsEditing] = useState(true);
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-update timestamps, handled on changes
  const activeNote = notes.find((n) => n.id === activeNoteId) || null;

  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "Untitled Note",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setIsEditing(true);
    setIsMobileListVisible(false);
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this note?")) {
      const newNotes = notes.filter((n) => n.id !== id);
      setNotes(newNotes);
      if (activeNoteId === id) {
        setActiveNoteId(newNotes.length > 0 ? newNotes[0].id : null);
      }
    }
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
      )
    );
  };

  const selectNote = (id: string) => {
    setActiveNoteId(id);
    setIsMobileListVisible(false);
  };

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full overflow-hidden rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl shadow-xl border border-gray-200/50 dark:border-gray-800/50">
      {/* Sidebar */}
      <div
        className={`${
          isMobileListVisible ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-80 border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 h-full`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" /> Notes
          </h2>
          <button
            onClick={createNote}
            className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
            title="New Note"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => selectNote(note.id)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                activeNoteId === note.id
                  ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <div className="overflow-hidden">
                <p className="font-medium truncate">{note.title || "Untitled"}</p>
                <p className="text-xs opacity-60 mt-1">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => deleteNote(note.id, e)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                title="Delete note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {notes.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 p-4 text-sm">
              No notes yet. Create one!
            </p>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`${
          !isMobileListVisible ? "flex" : "hidden"
        } md:flex flex-col flex-1 h-full bg-white dark:bg-gray-900`}
      >
        {activeNote ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-4">
              <button
                onClick={() => setIsMobileListVisible(true)}
                className="md:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                className="flex-1 bg-transparent text-xl font-bold text-gray-900 dark:text-white border-none focus:outline-none focus:ring-0 px-0"
                placeholder="Note Title"
              />
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <button
                  onClick={() => setIsEditing(true)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isEditing
                      ? "bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    !isEditing
                      ? "bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Eye className="w-4 h-4" /> Preview
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden grid lg:grid-cols-2">
              {/* Editor */}
              <div
                className={`h-full p-4 ${
                  isEditing ? "block" : "hidden lg:block"
                } border-r border-gray-200 dark:border-gray-800`}
              >
                <textarea
                  value={activeNote.content}
                  onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                  placeholder="Start typing in Markdown (LaTeX math supported with $, $$)..."
                  className="w-full h-full resize-none bg-transparent text-gray-800 dark:text-gray-200 font-mono text-sm border-none focus:outline-none focus:ring-0 p-0"
                />
              </div>

              {/* Preview */}
              <div
                className={`h-full overflow-y-auto p-6 ${
                  !isEditing ? "block" : "hidden lg:block"
                } prose dark:prose-invert max-w-none markdown-preview`}
              >
                {activeNote.content ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {activeNote.content}
                  </ReactMarkdown>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <p>Preview will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 h-full p-6 text-center">
            <FileText className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-xl font-medium mb-2">No Note Selected</h3>
            <p>Select a note from the sidebar or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}

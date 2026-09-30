"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Brain,
  BookOpen,
  Layers,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FlashcardDeck as FlashcardDeckType, Flashcard, QuizResult } from "@/types";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const defaultDecks: FlashcardDeckType[] = [
  {
    id: "deck-1",
    name: "Calculus Formulas",
    emoji: "🧮",
    cards: [
      { id: "c1", front: "What is the derivative of sin(x)?", back: "cos(x)" },
      { id: "c2", front: "What is the derivative of e^x?", back: "e^x" },
      { id: "c3", front: "Power Rule for derivatives", back: "d/dx(x^n) = n*x^(n-1)" },
      { id: "c4", front: "Integral of 1/x dx", back: "ln|x| + C" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "deck-2",
    name: "Data Structures",
    emoji: "💻",
    cards: [
      { id: "c5", front: "Time complexity to search in an unsorted array?", back: "O(n)" },
      { id: "c6", front: "What is a Hash Table?", back: "A data structure that implements an associative array abstract data type, a structure that can map keys to values." },
      { id: "c7", front: "What is a Binary Search Tree (BST)?", back: "A tree data structure where each node has at most two children, with left child values < parent node < right child values." },
      { id: "c8", front: "Time complexity to push/pop from a stack?", back: "O(1)" }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function FlashcardDeck() {
  const [mounted, setMounted] = useState(false);
  const [decks, setDecks] = useLocalStorage<FlashcardDeckType[]>("studyflow-decks", defaultDecks);
  const [view, setView] = useState<"list" | "edit" | "study" | "summary">("list");
  const [activeDeck, setActiveDeck] = useState<FlashcardDeckType | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // New Deck State
  const [showNewDeckModal, setShowNewDeckModal] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [newDeckEmoji, setNewDeckEmoji] = useState("📚");

  // New Card State
  const [newCardFront, setNewCardFront] = useState("");
  const [newCardBack, setNewCardBack] = useState("");

  // Study State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [studyHistory, setStudyHistory] = useState<Record<string, "correct" | "incorrect">>({});

  if (!mounted) return null;

  const handleCreateDeck = () => {
    if (!newDeckName.trim()) return;
    const newDeck: FlashcardDeckType = {
      id: `deck-${Date.now()}`,
      name: newDeckName,
      emoji: newDeckEmoji,
      cards: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setDecks([...decks, newDeck]);
    setNewDeckName("");
    setNewDeckEmoji("📚");
    setShowNewDeckModal(false);
  };

  const handleDeleteDeck = (id: string) => {
    setDecks(decks.filter((d) => d.id !== id));
  };

  const handleAddCard = () => {
    if (!newCardFront.trim() || !newCardBack.trim() || !activeDeck) return;
    const newCard: Flashcard = {
      id: `card-${Date.now()}`,
      front: newCardFront,
      back: newCardBack
    };
    
    const updatedDeck = {
      ...activeDeck,
      cards: [...activeDeck.cards, newCard],
      updatedAt: new Date().toISOString()
    };
    
    setDecks(decks.map((d) => (d.id === activeDeck.id ? updatedDeck : d)));
    setActiveDeck(updatedDeck);
    setNewCardFront("");
    setNewCardBack("");
  };

  const handleDeleteCard = (cardId: string) => {
    if (!activeDeck) return;
    const updatedDeck = {
      ...activeDeck,
      cards: activeDeck.cards.filter((c) => c.id !== cardId),
      updatedAt: new Date().toISOString()
    };
    setDecks(decks.map((d) => (d.id === activeDeck.id ? updatedDeck : d)));
    setActiveDeck(updatedDeck);
  };

  const startStudy = (deck: FlashcardDeckType) => {
    setActiveDeck(deck);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setScore(0);
    setStudyHistory({});
    setView("study");
  };

  const editDeck = (deck: FlashcardDeckType) => {
    setActiveDeck(deck);
    setView("edit");
  };

  const handleAssessment = (correct: boolean) => {
    if (!activeDeck) return;
    
    const cardId = activeDeck.cards[currentCardIndex].id;
    if (correct && studyHistory[cardId] !== "correct") {
      setScore(score + 1);
    }
    
    setStudyHistory({
      ...studyHistory,
      [cardId]: correct ? "correct" : "incorrect"
    });

    if (currentCardIndex < activeDeck.cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentCardIndex(currentCardIndex + 1), 150);
    } else {
      setTimeout(() => setView("summary"), 150);
    }
  };

  const restartStudy = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setScore(0);
    setStudyHistory({});
    setView("study");
  };

  const renderDeckList = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400 flex items-center gap-2">
          <Brain className="w-8 h-8 text-indigo-500" />
          Flashcard Decks
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <motion.div
            key={deck.id}
            whileHover={{ y: -5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{deck.emoji}</div>
                <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {deck.cards.length} Cards
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{deck.name}</h3>
            </div>
            
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => startStudy(deck)}
                disabled={deck.cards.length === 0}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-xl shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Study
              </button>
              <button
                onClick={() => editDeck(deck)}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-xl font-medium transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteDeck(deck.id)}
                className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 py-2 px-3 rounded-xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}

        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => setShowNewDeckModal(true)}
          className="bg-transparent border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:text-indigo-500 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all cursor-pointer min-h-[220px]"
        >
          <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm mb-4">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold">Create New Deck</h3>
        </motion.div>
      </div>

      <AnimatePresence>
        {showNewDeckModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">New Deck</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deck Name</label>
                  <input
                    type="text"
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                    placeholder="e.g. Spanish Vocabulary"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Emoji (Icon)</label>
                  <input
                    type="text"
                    value={newDeckEmoji}
                    onChange={(e) => setNewDeckEmoji(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-2xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowNewDeckModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDeck}
                  disabled={!newDeckName.trim()}
                  className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  Create Deck
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderEditView = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setView("list")}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-gray-600 dark:text-gray-300"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-4xl">{activeDeck?.emoji}</div>
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Edit {activeDeck?.name}
        </h2>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/50 mb-8">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-indigo-500" />
          Add New Card
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Front (Question)</label>
            <textarea
              value={newCardFront}
              onChange={(e) => setNewCardFront(e.target.value)}
              className="w-full h-32 p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              placeholder="Enter question..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Back (Answer)</label>
            <textarea
              value={newCardBack}
              onChange={(e) => setNewCardBack(e.target.value)}
              className="w-full h-32 p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              placeholder="Enter answer..."
            />
          </div>
        </div>
        <button
          onClick={handleAddCard}
          disabled={!newCardFront.trim() || !newCardBack.trim()}
          className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
        >
          Add Card
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Existing Cards ({activeDeck?.cards.length})
        </h3>
        {activeDeck?.cards.map((card) => (
          <div key={card.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4 relative group">
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => handleDeleteCard(card.id)}
                className="p-2 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Front</div>
              <div className="text-gray-800 dark:text-gray-200">{card.front}</div>
            </div>
            <div className="flex-1 bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-lg">
              <div className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 mb-2 uppercase tracking-wider">Back</div>
              <div className="text-gray-800 dark:text-gray-200">{card.back}</div>
            </div>
          </div>
        ))}
        {activeDeck?.cards.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No cards in this deck yet. Add some above!
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderStudyView = () => {
    if (!activeDeck || activeDeck.cards.length === 0) return null;
    
    const currentCard = activeDeck.cards[currentCardIndex];
    const progress = ((currentCardIndex) / activeDeck.cards.length) * 100;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-3xl mx-auto flex flex-col min-h-[70vh]"
      >
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setView("list")}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-gray-600 dark:text-gray-300"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex-1 mx-8">
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              <span>{activeDeck.name}</span>
              <span>{currentCardIndex + 1} / {activeDeck.cards.length}</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div 
            className="relative w-full max-w-2xl h-[400px] perspective-[1000px] cursor-pointer group"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <motion.div
              className="w-full h-full [transform-style:preserve-3d] transition-transform duration-700"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
            >
              {/* Front */}
              <div className="absolute inset-0 [backface-visibility:hidden] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center text-center border-t-4 border-indigo-500">
                <span className="absolute top-6 left-6 text-indigo-500 font-bold uppercase tracking-widest text-sm">Question</span>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">{currentCard.front}</h3>
                <div className="absolute bottom-6 text-gray-400 text-sm group-hover:text-indigo-400 transition-colors">
                  Click to flip
                </div>
              </div>

              {/* Back */}
              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center text-center border-t-4 border-emerald-500">
                <span className="absolute top-6 left-6 text-emerald-500 font-bold uppercase tracking-widest text-sm">Answer</span>
                <p className="text-2xl md:text-3xl font-medium text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{currentCard.back}</p>
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {isFlipped && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 flex items-center justify-center gap-6 w-full max-w-md"
              >
                <button
                  onClick={(e) => { e.stopPropagation(); handleAssessment(false); }}
                  className="flex-1 py-4 px-6 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-bold rounded-2xl shadow-sm transition-all flex flex-col items-center gap-2"
                >
                  <XCircle className="w-8 h-8" />
                  Need Practice
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleAssessment(true); }}
                  className="flex-1 py-4 px-6 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 font-bold rounded-2xl shadow-sm transition-all flex flex-col items-center gap-2"
                >
                  <CheckCircle className="w-8 h-8" />
                  Got it Right
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  const renderSummaryView = () => {
    if (!activeDeck) return null;
    
    const percentage = Math.round((score / activeDeck.cards.length) * 100);
    let grade = "F";
    let colorClass = "text-red-500";
    
    if (percentage >= 95) { grade = "A+"; colorClass = "text-emerald-500"; }
    else if (percentage >= 90) { grade = "A"; colorClass = "text-emerald-500"; }
    else if (percentage >= 80) { grade = "B"; colorClass = "text-emerald-400"; }
    else if (percentage >= 70) { grade = "C"; colorClass = "text-amber-500"; }
    else if (percentage >= 60) { grade = "D"; colorClass = "text-orange-500"; }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-12"
      >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-gray-700/50">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 mb-8">
            <Sparkles className="w-12 h-12" />
          </div>
          
          <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">Quiz Complete!</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">You finished studying {activeDeck.name}</p>
          
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6">
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Score</div>
              <div className="text-4xl font-bold text-gray-800 dark:text-gray-100">{score} / {activeDeck.cards.length}</div>
            </div>
            <div className={"bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6"}>
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Accuracy</div>
              <div className={"text-4xl font-bold " + colorClass}>{percentage}%</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={restartStudy}
              className="py-3 px-8 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Restart Deck
            </button>
            <button
              onClick={() => setView("list")}
              className="py-3 px-8 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Layers className="w-5 h-5" />
              Back to Decks
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {view === "list" && renderDeckList()}
        {view === "edit" && renderEditView()}
        {view === "study" && renderStudyView()}
        {view === "summary" && renderSummaryView()}
      </AnimatePresence>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Coffee, 
  Brain, 
  TreePine,
  Volume2, 
  VolumeX,
  CheckCircle2,
  Plus,
  Minus,
  Sliders,
  Sparkles,
  Flame
} from 'lucide-react';
import { TimerMode } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const THEMES = {
  FOCUS: {
    name: 'FOCUS',
    accent: 'from-indigo-500 via-purple-500 to-pink-500',
    gradientText: 'from-indigo-400 via-purple-300 to-pink-400',
    strokeStart: '#6366f1',
    strokeEnd: '#ec4899',
    glow: 'rgba(99, 102, 241, 0.35)',
    border: 'border-indigo-500/30',
    icon: Brain,
    label: 'Deep Focus',
    message: 'Stay in the zone, great work happening!',
    defaultTime: 25 * 60,
  },
  SHORT_BREAK: {
    name: 'SHORT_BREAK',
    accent: 'from-emerald-500 via-teal-500 to-cyan-500',
    gradientText: 'from-emerald-400 via-teal-300 to-cyan-400',
    strokeStart: '#10b981',
    strokeEnd: '#06b6d4',
    glow: 'rgba(16, 185, 129, 0.35)',
    border: 'border-emerald-500/30',
    icon: Coffee,
    label: 'Short Break',
    message: 'Step back, hydrate, and stretch!',
    defaultTime: 5 * 60,
  },
  LONG_BREAK: {
    name: 'LONG_BREAK',
    accent: 'from-cyan-500 via-blue-500 to-indigo-500',
    gradientText: 'from-cyan-400 via-blue-300 to-indigo-400',
    strokeStart: '#06b6d4',
    strokeEnd: '#6366f1',
    glow: 'rgba(6, 182, 212, 0.35)',
    border: 'border-cyan-500/30',
    icon: TreePine,
    label: 'Long Rest',
    message: 'You earned this extended rest!',
    defaultTime: 15 * 60,
  }
};

const RADIUS = 125;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function PomodoroTimer() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<keyof typeof THEMES>('FOCUS');
  const [totalDuration, setTotalDuration] = useState(THEMES.FOCUS.defaultTime);
  const [timeLeft, setTimeLeft] = useState(THEMES.FOCUS.defaultTime);
  const [isRunning, setIsRunning] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const [focusSessions, setFocusSessions] = useLocalStorage('pomodoro-focus-sessions', 0);
  const [breakSessions, setBreakSessions] = useLocalStorage('pomodoro-break-sessions', 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Web Audio API Beep synthesizer (no external audio file required)
  const playChime = useCallback(() => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      const ctx = new AudioContext();
      
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      playTone(523.25, 0, 0.2);     // C5
      playTone(659.25, 0.15, 0.2);  // E5
      playTone(783.99, 0.3, 0.4);   // G5
    } catch {
      // Audio not permitted without interaction
    }
  }, [soundEnabled]);

  const switchMode = useCallback((newMode: keyof typeof THEMES, customTime?: number) => {
    setMode(newMode);
    const duration = customTime ?? THEMES[newMode].defaultTime;
    setTotalDuration(duration);
    setTimeLeft(duration);
    setCustomMinutes(Math.floor(duration / 60));
    setIsRunning(false);
    setShowCompletion(false);
  }, []);

  const handleComplete = useCallback(() => {
    setIsRunning(false);
    setShowCompletion(true);
    playChime();

    if (mode === 'FOCUS') {
      const newFocusCount = focusSessions + 1;
      setFocusSessions(newFocusCount);
      setTimeout(() => {
        if (newFocusCount % 4 === 0) {
          switchMode('LONG_BREAK');
        } else {
          switchMode('SHORT_BREAK');
        }
      }, 3500);
    } else {
      setBreakSessions(prev => prev + 1);
      setTimeout(() => {
        switchMode('FOCUS');
      }, 3500);
    }
  }, [mode, focusSessions, setFocusSessions, setBreakSessions, switchMode, playChime]);

  // Timer countdown loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, handleComplete]);

  // Adjust time by minutes
  const adjustMinutes = (deltaMinutes: number) => {
    const newSeconds = Math.max(60, Math.min(180 * 60, timeLeft + deltaMinutes * 60));
    setTimeLeft(newSeconds);
    setTotalDuration(newSeconds);
    setCustomMinutes(Math.floor(newSeconds / 60));
  };

  const applyCustomMinutes = (minutes: number) => {
    const clamped = Math.max(1, Math.min(180, minutes));
    const seconds = clamped * 60;
    setTotalDuration(seconds);
    setTimeLeft(seconds);
    setCustomMinutes(clamped);
    setIsRunning(false);
    setShowCustomModal(false);
  };

  const currentTheme = THEMES[mode];
  const Icon = currentTheme.icon;
  const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/20 dark:border-slate-800 bg-gradient-to-b from-white/80 to-white/40 dark:from-slate-900/80 dark:to-slate-900/40 p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-indigo-500/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Productivity Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Pomodoro Focus Flow
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {currentTheme.message}
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Flame className="w-5 h-5 text-indigo-500" />
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Focus Rounds</div>
                <div className="text-lg font-bold">{focusSessions}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Coffee className="w-5 h-5 text-emerald-500" />
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Breaks Taken</div>
                <div className="text-lg font-bold">{breakSessions}</div>
              </div>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Mute sound" : "Enable sound"}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-rose-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Timer Display Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/20 dark:border-slate-800 bg-gradient-to-b from-white/90 via-white/60 to-white/90 dark:from-slate-900/90 dark:via-slate-900/60 dark:to-slate-900/90 p-8 md:p-12 backdrop-blur-2xl shadow-2xl transition-all duration-500">
        
        {/* Dynamic Background Glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-700"
          style={{ background: currentTheme.glow }}
        />

        {/* Mode Selector Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 backdrop-blur-md">
            {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map((modeKey) => {
              const tab = THEMES[modeKey];
              const TabIcon = tab.icon;
              const isActive = mode === modeKey;
              return (
                <button
                  key={modeKey}
                  onClick={() => switchMode(modeKey)}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive 
                      ? 'text-white shadow-lg' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTimerMode"
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tab.accent}`}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <TabIcon className="w-4 h-4" />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Circular Timer Ring */}
        <div className="relative flex flex-col items-center justify-center my-4">
          <svg className="w-72 h-72 md:w-80 md:h-80 -rotate-90 transform" viewBox="0 0 280 280">
            <defs>
              <linearGradient id={`timerGradient-${mode}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={currentTheme.strokeStart} />
                <stop offset="100%" stopColor={currentTheme.strokeEnd} />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Track */}
            <circle
              cx="140"
              cy="140"
              r={RADIUS}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-slate-200 dark:text-slate-800/80"
            />

            {/* Animated Progress Circle */}
            <circle
              cx="140"
              cy="140"
              r={RADIUS}
              stroke={`url(#timerGradient-${mode})`}
              strokeWidth="12"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              filter="url(#glow)"
              className="transition-all duration-500 ease-out"
            />
          </svg>

          {/* Time & Mode Display (Centered Inside Ring) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
            <motion.div 
              key={mode}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 mb-1"
            >
              <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {currentTheme.label}
              </span>
            </motion.div>

            <motion.div 
              className={`text-5xl md:text-6xl font-black tracking-tight font-mono bg-gradient-to-r ${currentTheme.gradientText} bg-clip-text text-transparent drop-shadow-sm`}
              animate={{ scale: isRunning ? [1, 1.015, 1] : 1 }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              {formatTime(timeLeft)}
            </motion.div>

            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">
              {isRunning ? 'Timer Running' : 'Paused'}
            </div>
          </div>
        </div>

        {/* Quick Time Adjustment Controls (+/- 1m, +/- 5m) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 mb-8">
          <button
            onClick={() => adjustMinutes(-5)}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-colors"
          >
            -5 min
          </button>
          <button
            onClick={() => adjustMinutes(-1)}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-colors"
          >
            -1 min
          </button>

          {/* Preset Buttons */}
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />
          
          {[15, 25, 45, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => applyCustomMinutes(mins)}
              disabled={isRunning}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                Math.floor(totalDuration / 60) === mins 
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' 
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40'
              }`}
            >
              {mins}m
            </button>
          ))}

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

          <button
            onClick={() => adjustMinutes(1)}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-colors"
          >
            +1 min
          </button>
          <button
            onClick={() => adjustMinutes(5)}
            disabled={isRunning}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-colors"
          >
            +5 min
          </button>

          {/* Custom Duration Slider Opener */}
          <button
            onClick={() => setShowCustomModal(!showCustomModal)}
            disabled={isRunning}
            title="Set exact minutes"
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-colors"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Duration Slider Panel */}
        <AnimatePresence>
          {showCustomModal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-md mx-auto mb-8 p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 backdrop-blur-md overflow-hidden"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span>Custom Duration:</span>
                <span className="text-indigo-500 text-sm font-extrabold">{customMinutes} Minutes</span>
              </div>
              <input
                type="range"
                min="1"
                max="120"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-[10px] text-slate-400">1 min</span>
                <button
                  onClick={() => applyCustomMinutes(customMinutes)}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
                >
                  Set Timer
                </button>
                <span className="text-[10px] text-slate-400">120 min</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => {
              setTimeLeft(totalDuration);
              setIsRunning(false);
            }}
            title="Reset Timer"
            className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 bg-gradient-to-r ${currentTheme.accent}`}
            style={{ boxShadow: `0 10px 30px ${currentTheme.glow}` }}
          >
            {isRunning ? (
              <>
                <Pause className="w-6 h-6 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-current" />
                <span>{timeLeft === totalDuration ? 'Start Focus' : 'Resume'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              if (mode === 'FOCUS') switchMode('SHORT_BREAK');
              else switchMode('FOCUS');
            }}
            title="Skip to Next Mode"
            className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Celebration Banner */}
        <AnimatePresence>
          {showCompletion && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center gap-3 text-emerald-600 dark:text-emerald-400"
            >
              <Sparkles className="w-5 h-5 animate-spin" />
              <span className="font-bold text-sm">
                Session Complete! Awesome work. Transitioning to next round...
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

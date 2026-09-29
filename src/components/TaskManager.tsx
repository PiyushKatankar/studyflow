'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  AlertTriangle,
  Clock,
  BookOpen,
  Filter
} from 'lucide-react';
import { Task } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Helper to add days to a date and return YYYY-MM-DD
const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

const defaultTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Linear Algebra Problem Set 4',
    course: 'Math 201',
    dueDate: '2026-10-02',
    priority: 'high',
    completed: false,
  },
  {
    id: 'task-2',
    title: 'Physics Lab Report - Optics',
    course: 'Physics 101',
    dueDate: '2026-10-01',
    priority: 'high',
    completed: false,
  },
  {
    id: 'task-3',
    title: 'Read Chapter 7 - Data Structures',
    course: 'CS 202',
    dueDate: '2026-10-05',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'task-4',
    title: 'Essay Draft - Modern Philosophy',
    course: 'PHIL 301',
    dueDate: '2026-10-08',
    priority: 'low',
    completed: false,
  },
  {
    id: 'task-5',
    title: 'Biology Worksheet - Cell Division',
    course: 'BIO 150',
    dueDate: '2026-09-27',
    priority: 'medium',
    completed: true,
  },
];

const getRelativeDateText = (dateString: string) => {
  const due = new Date(dateString);
  due.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays === -1) return 'Due yesterday';
  if (diffDays < -1) return `Overdue by ${Math.abs(diffDays)} days!`;
  return `Due in ${diffDays} days`;
};

type FilterType = 'All' | 'Due Soon' | 'Completed';

export default function TaskManager() {
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useLocalStorage<Task[]>('studyflow-tasks', defaultTasks);
  const [filter, setFilter] = useState<FilterType>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  // Form State
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !course || !dueDate) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      course,
      dueDate,
      priority,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTitle('');
    setCourse('');
    setDueDate('');
    setPriority('medium');
    setIsFormOpen(false);
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const stats = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const dueSoon = tasks.filter((t) => {
      if (t.completed) return false;
      const due = new Date(t.dueDate);
      due.setHours(0, 0, 0, 0);
      const diffTime = due.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 3;
    }).length;

    return { total, dueSoon, completed };
  }, [tasks]);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (filter === 'Completed') {
      filtered = tasks.filter((t) => t.completed);
    } else if (filter === 'Due Soon') {
      filtered = tasks.filter((t) => {
        if (t.completed) return false;
        const due = new Date(t.dueDate);
        due.setHours(0, 0, 0, 0);
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 3;
      });
    }

    return [...filtered].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }, [tasks, filter]);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center p-6 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl mr-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Tasks</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
          </div>
        </div>

        <div className="flex items-center p-6 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl mr-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Due Soon</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.dueSoon}</p>
          </div>
        </div>

        <div className="flex items-center p-6 bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl mr-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Completed</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
          </div>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex p-1 space-x-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
          {(['All', 'Due Soon', 'Completed'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Add Task Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.form
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleAddTask}
            className="overflow-hidden"
          >
            <div className="p-6 bg-white/50 dark:bg-black/30 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g., Read Chapter 7"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Course</label>
                  <input
                    type="text"
                    required
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="E.g., CS 202"
                    className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl shadow-lg transition-all active:scale-95 font-medium"
                >
                  Add Task
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredAndSortedTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center text-gray-500 dark:text-gray-400"
            >
              No tasks found.
            </motion.div>
          ) : (
            filteredAndSortedTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm border rounded-2xl transition-all shadow-sm hover:shadow-md ${
                  task.completed
                    ? 'border-gray-200 dark:border-gray-800 opacity-60'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start sm:items-center space-x-4 mb-3 sm:mb-0">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`mt-1 sm:mt-0 flex-shrink-0 transition-colors ${
                      task.completed ? 'text-green-500' : 'text-gray-400 hover:text-indigo-500'
                    }`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {task.course}
                      </span>
                      <span
                        className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                          task.priority === 'high'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : task.priority === 'medium'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <h3
                      className={`text-base font-medium text-gray-900 dark:text-white transition-all ${
                        task.completed ? 'line-through text-gray-500 dark:text-gray-500' : ''
                      }`}
                    >
                      {task.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end space-x-4 ml-10 sm:ml-0">
                  <div
                    className={`flex items-center space-x-1 text-sm ${
                      task.completed
                        ? 'text-gray-400'
                        : getRelativeDateText(task.dueDate).includes('Overdue')
                        ? 'text-red-500 font-semibold'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{getRelativeDateText(task.dueDate)}</span>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                    title="Delete task"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

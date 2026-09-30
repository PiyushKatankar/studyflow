"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Always initialize with initialValue on the server and initial client render
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Sync from localStorage once mounted on client to prevent hydration mismatch
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch {
      // ignore JSON parse errors or restricted environments
    }
  }, [key]);

  // Persist whenever storedValue changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(next));
          }
        } catch {
          // ignore quota limits
        }
        return next;
      });
    },
    [key]
  );

  return [storedValue, setValue] as const;
}

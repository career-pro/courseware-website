'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'unlocked_courses';

function loadUnlocked(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return new Set(JSON.parse(raw));
    }
  } catch {}
  return new Set();
}

export function useUnlocked() {
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());

  useEffect(() => {
    setUnlocked(loadUnlocked());
  }, []);

  const unlock = (courseId: string) => {
    setUnlocked((prev) => {
      const next = new Set(prev);
      next.add(courseId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const isUnlocked = (courseId: string) => unlocked.has(courseId);

  return { unlocked, unlock, isUnlocked };
}

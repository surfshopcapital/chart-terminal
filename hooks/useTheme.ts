'use client';

import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const stored = (localStorage.getItem('theme') as Theme) ?? 'dark';
    setThemeState(stored);
    document.documentElement.classList.toggle('dark', stored === 'dark');
  }, []);

  function setTheme(next: Theme) {
    setThemeState(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  }

  function toggle() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return { theme, setTheme, toggle };
}

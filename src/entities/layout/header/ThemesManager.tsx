'use client';
import { useState, useEffect, memo } from 'react';
import ThemeSwitch from '@shared/layout/header/ThemeSwitch';
import styles from './styles/general.module.css';

const themes = ['light', 'dark'] as const;
type Theme = (typeof themes)[number];

const isTheme = (value: string): value is Theme => themes.includes(value as Theme);

function ThemesManager() {
  const [theme, setTheme] = useState<Theme>('light');  // Initial 'light' — валидно

  // Инициализация темы на клиенте
  useEffect(() => {
    const savedTheme = sessionStorage.getItem('theme') || '';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    const validInitial = isTheme(initialTheme) ? initialTheme : 'light';  // Fallback
    setTheme(validInitial);
    document.documentElement.setAttribute('data-theme', validInitial);
    sessionStorage.setItem('theme', validInitial);
  }, []);

  // Отслеживание изменений системной темы (без изменений)
  useEffect(() => {
    if (!theme) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      if (!sessionStorage.getItem('theme')) {
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        sessionStorage.setItem('theme', newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme]);

  // Исправленный toggle: добавлен setTheme!
  const toggleTheme = (nextTheme: Theme) => {
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    sessionStorage.setItem('theme', nextTheme);
  };

  return (
    <div className={styles.themesManager}>
      <ThemeSwitch
        currentState={theme}
        onToggle={toggleTheme}
        themeList={themes}
      />
    </div>
  );
}

export default memo(ThemesManager);
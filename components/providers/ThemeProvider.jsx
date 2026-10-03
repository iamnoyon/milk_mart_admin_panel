"use client";

import { createContext, useContext, useSyncExternalStore } from "react";
import { ToastContainer } from "react-toastify";

const STORAGE_KEY = "theme";
const DEFAULT_THEME = "light";

const listeners = new Set();

function normalizeTheme(value) {
  return value === "dark" || value === "light" ? value : DEFAULT_THEME;
}

function readStoredTheme() {
  if (typeof window === "undefined") return DEFAULT_THEME;
  return normalizeTheme(window.localStorage.getItem(STORAGE_KEY));
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

function persistTheme(theme) {
  window.localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
  listeners.forEach((listener) => listener());
}

function subscribe(onStoreChange) {
  listeners.add(onStoreChange);

  const onStorage = (event) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    applyTheme(readStoredTheme());
    onStoreChange();
  };

  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  return readStoredTheme();
}

function getServerSnapshot() {
  return DEFAULT_THEME;
}

const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = (next) => {
    persistTheme(normalizeTheme(next));
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    persistTheme(isDark ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemedToastContainer(props) {
  const { theme } = useTheme();

  return <ToastContainer {...props} theme={theme} />;
}

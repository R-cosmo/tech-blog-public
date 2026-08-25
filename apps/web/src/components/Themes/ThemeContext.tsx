"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// TODOS:
// 1. Create Theme Provider
// 2. Create useTheme hook
// 3. Use the provider in your layout
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light" as Theme;

    // Prefer data-theme on html if already set (SSR may set this)
    const dataTheme = document.documentElement.getAttribute("data-theme") as Theme | null;
    if (dataTheme) return dataTheme;

    // Fallback to cookie if available
    const cookie = document.cookie
      .split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith("theme="));
    if (cookie) return (cookie.split("=")[1] as Theme) || "light";

    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    // Persist to cookie for SSR reads in future requests (1 year)
    try {
      document.cookie = `theme=${theme}; path=/; max-age=${60 * 60 * 24 * 365}`;
    } catch (e) {
      // ignore (e.g., strict environments)
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

export default ThemeContext;
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import SquishSwitch from "@/components/SquishSwitch";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Light mode is the default theme unless explicitly set to dark by user
    const stored = localStorage.getItem("resutex-theme") as Theme | null;
    const initial: Theme = stored === "dark" ? "dark" : "light";

    setThemeState(initial);
    applyThemeClass(initial);
    setMounted(true);
  }, []);

  const applyThemeClass = (t: Theme) => {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  };

  const setTheme = (next: Theme) => {
    setThemeState(next);
    localStorage.setItem("resutex-theme", next);
    applyThemeClass(next);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeToggle: React.FC<{
  showLabel?: boolean;
  compact?: boolean;
}> = ({ showLabel = false, compact = true }) => {
  const { theme, setTheme, isDark } = useTheme();

  return (
    <div className="flex items-center gap-2 select-none">
      <Sun
        className={`w-3.5 h-3.5 transition-colors ${
          !isDark ? "text-amber-500 font-bold" : "text-neutral-400"
        }`}
      />
      <SquishSwitch
        checked={isDark}
        onChange={(checked) => setTheme(checked ? "dark" : "light")}
        ariaLabel="Toggle Dark and Light mode"
        trackColor="#e4e4e7"
        trackOnColor="#18181b"
        thumbColor="#ffffff"
        thumbOnColor="#ffffff"
        width={compact ? 54 : 64}
        height={compact ? 28 : 32}
        radius={compact ? 14 : 16}
        speed={55}
        stretch={32}
        hoverScale={1.05}
      />
      <Moon
        className={`w-3.5 h-3.5 transition-colors ${
          isDark ? "text-indigo-400 font-bold" : "text-neutral-400"
        }`}
      />
      {showLabel && (
        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300 ml-1">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </div>
  );
};

"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
    theme: Theme;
    toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: "dark",
    toggle: () => {},
});

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");

    // On mount: read saved preference or system preference
    useEffect(() => {
        const saved = localStorage.getItem("atlas-theme") as Theme | null;
        if (saved === "light" || saved === "dark") {
            setTheme(saved);
            applyTheme(saved);
        } else {
            // Default to dark (brand default)
            setTheme("dark");
            applyTheme("dark");
        }
    }, []);

    const toggle = () => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        setTheme(next);
        applyTheme(next);
        localStorage.setItem("atlas-theme", next);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}

function applyTheme(theme: Theme) {
    const root = document.documentElement;
    if (theme === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
    } else {
        root.classList.remove("dark");
        root.classList.add("light");
    }
}

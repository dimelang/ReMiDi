import { useEffect, useState } from "react";
import { Moon, Sun } from 'lucide-react';

export default function ThemedToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>(window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    return (
        <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="absolute top-6 right-6 flex items-center justify-center w-10 h-10
                 rounded-full bg-gray-700 dark:bg-gray-100 
                 shadow-md hover:scale-105
                 transition-all duration-300 ease-out
                 border border-gray-200 dark:border-gray-800"
            aria-label="Toggle theme"
        >
            {theme === "light" ? (
                <Moon className="w-5 h-5 text-gray-100" />
            ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
            )}
        </button>
    );


}
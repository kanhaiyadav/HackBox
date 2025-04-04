"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T) => void] {
    // State to store our value
    const [storedValue, setStoredValue] = useState<T>(initialValue);

    // Initialize on first render only
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            const value = item ? JSON.parse(item) : initialValue;
            setStoredValue(value);
        } catch (error) {
            // If error, just use the initialValue
            console.error("Error reading from localStorage", error);
            setStoredValue(initialValue);
        }
    }, [key]);

    // Return a wrapped version of useState's setter function that persists the new value to localStorage
    const setValue = (value: T) => {
        if (typeof window === "undefined") {
            return;
        }

        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.error("Error writing to localStorage", error);
        }
    };

    return [storedValue, setValue];
}

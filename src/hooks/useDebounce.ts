import { useEffect, useState } from "react";

/**
 *
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 * @returns  The debounced value
 * @description This hook is used to debounce a value. It delays the execution of a function until a certain amount of time has passed since the last time the function was called.
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

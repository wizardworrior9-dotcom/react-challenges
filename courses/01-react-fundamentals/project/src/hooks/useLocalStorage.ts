import { useState, useCallback } from 'react'

/**
 * Custom hook for state management synchronized with localStorage.
 *
 * @template T
 * @param key The key under which the data is stored in localStorage.
 * @param initialValue The fallback initial value if localStorage key is absent or invalid.
 * @returns A tuple containing current state value and a state updater function.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) {
        return JSON.parse(item) as T
      }
    } catch {
      // Ignore parse or storage errors and fallback to initialValue
    }
    return initialValue
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((previousState) => {
          const nextValue =
            typeof value === 'function'
              ? (value as (prev: T) => T)(previousState)
              : value

          try {
            window.localStorage.setItem(key, JSON.stringify(nextValue))
          } catch {
            // Ignore storage write errors
          }

          return nextValue
        })
      } catch {
        // Ignore setter errors
      }
    },
    [key],
  )

  return [storedValue, setValue]
}

export default useLocalStorage

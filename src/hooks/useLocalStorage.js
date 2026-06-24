import { useState, useCallback, useRef } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const storedValueRef = useRef(storedValue)
  storedValueRef.current = storedValue

  const setValue = useCallback((value) => {
    const valueToStore = value instanceof Function ? value(storedValueRef.current) : value
    setStoredValue(valueToStore)
    try {
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch {
      // silently fail
    }
  }, [key])

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch {
      // silently fail
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

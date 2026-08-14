import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, renderHook, act } from '@testing-library/react'
import App from '../src/App'
import useLocalStorage from '../src/hooks/useLocalStorage'
import { ThemeProvider, useTheme } from '../src/contexts/ThemeContext'

describe('Challenge 17: Custom Hook - useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('App should render without crashing', () => {
    render(<App />)
    expect(screen.getByText(/challenges/i)).toBeInTheDocument()
  })

  it('returns initialValue when key is not in localStorage', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default-val'),
    )
    expect(result.current[0]).toBe('default-val')
  })

  it('updates state and persists to localStorage on setter call', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial'),
    )

    act(() => {
      result.current[1]('new-value')
    })

    expect(result.current[0]).toBe('new-value')
    expect(window.localStorage.getItem('test-key')).toBe(
      JSON.stringify('new-value'),
    )
  })

  it('supports functional updater in setter', () => {
    const { result } = renderHook(() => useLocalStorage('count-key', 5))

    act(() => {
      result.current[1]((prev) => prev + 1)
    })

    expect(result.current[0]).toBe(6)
    expect(window.localStorage.getItem('count-key')).toBe(JSON.stringify(6))
  })

  it('returns initialValue when localStorage contains invalid JSON', () => {
    window.localStorage.setItem('bad-json-key', 'invalid json {{{')

    const { result } = renderHook(() =>
      useLocalStorage('bad-json-key', 'fallback'),
    )

    expect(result.current[0]).toBe('fallback')
  })

  it('ThemeContext uses useLocalStorage for theme persistence', () => {
    function TestThemeComponent() {
      const { theme, toggleTheme } = useTheme()
      return (
        <div>
          <span data-testid="theme">{theme}</span>
          <button onClick={toggleTheme}>Toggle</button>
        </div>
      )
    }

    render(
      <ThemeProvider>
        <TestThemeComponent />
      </ThemeProvider>,
    )

    expect(screen.getByTestId('theme').textContent).toBe('light')

    act(() => {
      screen.getByRole('button').click()
    })

    expect(screen.getByTestId('theme').textContent).toBe('dark')
    expect(window.localStorage.getItem('task-app-theme')).toBe(
      JSON.stringify('dark'),
    )
  })
})

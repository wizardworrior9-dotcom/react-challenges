import { useState, useEffect } from 'react'

export interface TodoItem {
  id: number | string
  title: string
  completed?: boolean
}

export default function FetchDemoView() {
  const [items, setItems] = useState<TodoItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadData() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/todos.json', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText || response.status}`)
        }

        const data = (await response.json()) as TodoItem[]
        setItems(data)
        setLoading(false)
      } catch (err: unknown) {
        if (controller.signal.aborted) {
          return
        }
        setError(err instanceof Error ? err.message : 'Failed to fetch')
        setLoading(false)
      }
    }

    loadData()

    return () => {
      controller.abort()
    }
  }, [])

  if (loading) {
    return <div id="fetch-loading">Loading...</div>
  }

  if (error) {
    return <div id="fetch-error">{error}</div>
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Data Fetching Demo</h2>
      <ul id="fetch-list">
        {items.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  )
}

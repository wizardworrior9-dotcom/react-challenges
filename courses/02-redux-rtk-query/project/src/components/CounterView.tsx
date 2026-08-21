import { useAppDispatch, useAppSelector } from '../store/hooks.ts'
import { increment, decrement } from '../store/slices/counterSlice.ts'

export default function CounterView() {
  const count = useAppSelector((state) => state.counter)
  const dispatch = useAppDispatch()

  return (
    <div id="counter-view" data-testid="counter-view" style={{ textAlign: 'center', padding: '1rem' }}>
      <h3>Counter</h3>
      <div data-testid="counter-value" style={{ fontSize: '2rem', margin: '1rem 0' }}>
        {count}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button
          type="button"
          data-testid="increment-btn"
          onClick={() => dispatch(increment())}
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          Increment
        </button>
        <button
          type="button"
          data-testid="decrement-btn"
          onClick={() => dispatch(decrement())}
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}

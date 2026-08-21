interface ErrorDisplayProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorDisplay({ message = 'Something went wrong.', onRetry }: ErrorDisplayProps) {
  return (
    <div id="error-display">
      <p>{message}</p>
      {onRetry && (
        <button id="retry-btn" type="button" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}

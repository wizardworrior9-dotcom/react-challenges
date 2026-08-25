interface ErrorDisplayProps {
  error?: unknown
  message?: string
  onRetry?: () => void
}

export default function ErrorDisplay({ error, message = 'Something went wrong.', onRetry }: ErrorDisplayProps) {
  let displayMessage = message;
  
  if (error) {
    if (typeof error === 'string') {
      displayMessage = error;
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      displayMessage = String((error as Record<string, unknown>).message);
    } else {
      displayMessage = 'An error occurred';
    }
  }

  return (
    <div id="error-display" data-testid="error-display">
      <p>{displayMessage}</p>
      {onRetry && (
        <button id="retry-btn" data-testid="retry-btn" type="button" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}

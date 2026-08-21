// useQueryHook
import { useGetUsersQuery } from '../api/apiSlice'
import ErrorDisplay from './ErrorDisplay'

export default function UsersList() {
  const { data: users, isLoading, isError, error, refetch } = useGetUsersQuery()

  if (isLoading) {
    return (
      <div id="users-list" data-testid="users-list">
        <div id="users-loading" data-testid="users-loading">Loading users...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div id="users-list" data-testid="users-list">
        <div id="users-error" data-testid="users-error">
          <ErrorDisplay message={typeof error === 'string' ? error : 'Failed to load users.'} onRetry={refetch} />
        </div>
      </div>
    )
  }

  return (
    <div id="users-list" data-testid="users-list">
      <h2>Users</h2>
      <ul>
        {users?.map((user) => (
          <li key={user.id} data-testid={`user-${user.id}`}>
            <strong>{user.name}</strong> ({user.username}) — {user.email}
          </li>
        ))}
      </ul>
    </div>
  )
}

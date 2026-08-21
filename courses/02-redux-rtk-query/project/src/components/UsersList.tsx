import { useGetUsersQuery } from '../api/apiSlice'
import ErrorDisplay from './ErrorDisplay'

export default function UsersList() {
  const { data: users, isLoading, isError, refetch } = useGetUsersQuery()

  if (isLoading) {
    return (
      <div id="users-list">
        <div id="users-loading">Loading users...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div id="users-list">
        <ErrorDisplay message="Failed to load users." onRetry={refetch} />
      </div>
    )
  }

  return (
    <div id="users-list">
      <h2>Users</h2>
      <ul>
        {users?.map((user) => (
          <li key={user.id} data-testid={`user-${user.id}`}>
            <strong>{user.name}</strong> — {user.email}
          </li>
        ))}
      </ul>
    </div>
  )
}

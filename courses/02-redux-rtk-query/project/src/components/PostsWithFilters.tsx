import { useAppSelector, useAppDispatch } from '../store/hooks'
import { useGetPostsQuery } from '../api/apiSlice'
import { setUserIdFilter, setSearchText } from '../store/slices/filtersSlice'

export default function PostsWithFilters() {
  const dispatch = useAppDispatch()
  const { userId, searchText } = useAppSelector((state) => state.filters)
  const { data: posts, isLoading, isError } = useGetPostsQuery()

  const filteredPosts = posts
    ?.filter((post) => (userId !== null ? post.userId === userId : true))
    .filter((post) =>
      searchText ? post.title.toLowerCase().includes(searchText.toLowerCase()) : true,
    )

  return (
    <div id="posts-with-filters">
      <div id="filter-controls">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchText}
          onChange={(e) => dispatch(setSearchText(e.target.value))}
        />
        <select
          value={userId ?? ''}
          onChange={(e) => dispatch(setUserIdFilter(e.target.value ? Number(e.target.value) : null))}
        >
          <option value="">All users</option>
          <option value="1">User 1</option>
          <option value="2">User 2</option>
          <option value="3">User 3</option>
        </select>
      </div>

      {isLoading && <div>Loading posts...</div>}
      {isError && <div>Failed to load posts.</div>}

      <ul>
        {filteredPosts?.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

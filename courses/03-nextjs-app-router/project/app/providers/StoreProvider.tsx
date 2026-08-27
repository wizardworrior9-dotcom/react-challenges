'use client'

import { useRef } from 'react'
import { Provider, useSelector, useDispatch } from 'react-redux'
import { makeStore, AppStore, store as defaultStore } from '../store/store'

export { useSelector, useDispatch }

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current || defaultStore}>{children}</Provider>
}

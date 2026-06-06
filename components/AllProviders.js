"use client"
import { Provider } from 'react-redux'
import appStore from '@/utils/appStore'
import AuthProvider from './AuthProvider'

export default function AllProviders({ children }) {
  return (
    <Provider store={appStore}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  )
}

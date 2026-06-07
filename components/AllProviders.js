"use client"
import { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux'
import appStore from '@/utils/appStore'
import AuthProvider from './AuthProvider'

function ThemeManager() {
  const dark = useSelector(state => state.other.darkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [dark]);

  return null;
}

export default function AllProviders({ children }) {
  return (
    <Provider store={appStore}>
      <ThemeManager />
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  )
}

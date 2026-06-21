'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/app/_components/AppShell';
import AuthProvider from '@/app/_components/AuthProvider';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  return (
    <AuthProvider>
      <AppShell>
        {children}
      </AppShell>
    </AuthProvider>
  );
}
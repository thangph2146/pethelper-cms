'use client';

import { AuthProvider } from '@/providers/auth-provider';
import { LoadingProvider } from '@/providers/loading-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <SessionProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <LoadingProvider>

            {children}
          </LoadingProvider>
        </QueryClientProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

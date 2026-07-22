'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSocialsPage = pathname === '/socials';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {!isSocialsPage && <Header />}
      <main className="flex-1">{children}</main>
      {!isSocialsPage && <Footer />}
    </div>
  );
}

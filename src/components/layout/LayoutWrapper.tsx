"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Sidebar from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AIChatbot } from "@/components/chat/AIChatbot";
import PullToRefresh from 'react-simple-pull-to-refresh';
import { useAppRefresh } from '@/hooks/useAppRefresh';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { status } = useSession();
  
  // Public routes that never show the app shell
  const isAlwaysPublic = pathname === '/login' || pathname === '/philosophy' || pathname?.startsWith('/docs');
  
  // Root page is public ONLY if unauthenticated
  const isRootPublic = pathname === '/' && status === 'unauthenticated';
  
  const isPublicRoute = isAlwaysPublic || isRootPublic;

  // We show the shell if:
  // 1. Not a public route
  // 2. AND (Authenticated OR Loading)
  const shouldShowShell = !isPublicRoute && (status === 'authenticated' || status === 'loading');
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { refresh } = useAppRefresh();

  if (!shouldShowShell) {
    return (
      <main style={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
    );
  }

  return (
    <div className="layout-wrapper" style={{ display: 'flex', height: '100dvh', width: '100vw', overflow: 'hidden' }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="page-content" style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <PullToRefresh onRefresh={refresh} className="ptr-container">
            {children}
          </PullToRefresh>
        </main>
        <AIChatbot />
      </div>
    </div>
  );
}

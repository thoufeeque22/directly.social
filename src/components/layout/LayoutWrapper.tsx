"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Sidebar from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AIChatbot } from "@/components/chat/AIChatbot";
import PullToRefresh from 'react-simple-pull-to-refresh';
import { useAppRefresh } from '@/hooks/useAppRefresh';
import { Session } from 'next-auth';

export default function LayoutWrapper({ children, session: initialSession }: { children: React.ReactNode, session: Session | null }) {
  const pathname = usePathname();
  const { status, data: clientSession } = useSession();
  
  // Use either the server-side session OR the client-side session
  const session = clientSession || initialSession;
  const isAuthenticated = !!session;
  
  // Routes that should NEVER show the app shell (Marketing/Auth/Legal)
  // These are handled by the (public) route group or other specialized layouts.
  const isAlwaysPublic = pathname === '/login' || 
    pathname === '/philosophy' || 
    pathname === '/privacy' || 
    pathname === '/terms' || 
    pathname === '/cookies' || 
    pathname === '/' ||
    pathname?.startsWith('/docs');
  
  // We hide the shell ONLY if:
  // 1. It's an always-public route (EXCEPT root path when authenticated)
  const shouldHideShell = isAlwaysPublic && !(pathname === '/' && isAuthenticated);
  const shouldShowShell = !shouldHideShell;
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { refresh } = useAppRefresh();

  if (!shouldShowShell) {
    return <>{children}</>;
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

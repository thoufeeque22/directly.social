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

export default function LayoutWrapper({ 
  children, 
  session: initialSession, 
  isFreeTier = true,
  tierName = "Free Starter"
}: { 
  children: React.ReactNode, 
  session: Session | null, 
  isFreeTier?: boolean,
  tierName?: string
}) {
  const pathname = usePathname();
  const { data: clientSession } = useSession();
  
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
    pathname === '/pricing' ||
    pathname === '/status' ||
    pathname?.startsWith('/docs');
  
  // We hide the shell ONLY if:
  // 1. It's an always-public route, EXCEPT when the user is logged in (excluding the auth page /login)
  const shouldHideShell = isAlwaysPublic && !(pathname !== '/login' && isAuthenticated);
  const shouldShowShell = !shouldHideShell;
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { refresh } = useAppRefresh();

  if (!shouldShowShell) {
    return <>{children}</>;
  }

  return (
    <div className="layout-wrapper">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isFreeTier={isFreeTier} tierName={tierName} />
      <div className="main-content">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} tierName={tierName} />
        <main className="page-content">
          <PullToRefresh onRefresh={refresh} className="ptr-container">
            {children}
          </PullToRefresh>
        </main>
        <AIChatbot />
      </div>
    </div>
  );
}

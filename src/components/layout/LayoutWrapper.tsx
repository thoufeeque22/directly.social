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
  // Hide layout for login page, or for unauthenticated users on any page.
  // We also hide it while loading to prevent flashing the sidebar.
  const isPublicRoute = pathname === '/login' || pathname === '/philosophy' || pathname?.startsWith('/docs') || (pathname === '/' && status === 'unauthenticated');
  const isUnauthenticated = status === 'unauthenticated' || status === 'loading';
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { refresh } = useAppRefresh();

  if (isPublicRoute || (isUnauthenticated && pathname !== '/login')) {
    return (
      <main style={{ width: '100%', minHeight: '100vh' }}>
        {children}
      </main>
    );
  }

  return (
    <div className="layout-wrapper" style={{ height: '100dvh', overflow: 'hidden' }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="main-content" style={{ height: '100%', overflow: 'hidden' }}>
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="page-content" style={{ height: '100%', overflow: 'hidden' }}>
          <PullToRefresh onRefresh={refresh} className="ptr-container">
            {children}
          </PullToRefresh>
        </main>
        <AIChatbot />
      </div>
    </div>
  );
}

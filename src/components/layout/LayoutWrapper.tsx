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
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { refresh } = useAppRefresh();

  return (
    <div className="layout-wrapper">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isFreeTier={isFreeTier} />
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

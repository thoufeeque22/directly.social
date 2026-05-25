"use client";

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AIChatbot } from "@/components/chat/AIChatbot";
import PullToRefresh from 'react-simple-pull-to-refresh';
import { useAppRefresh } from '@/hooks/useAppRefresh';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { refresh } = useAppRefresh();

  if (isLoginPage) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifySelf: 'center', width: '100%' }}>
        {children}
      </main>
    );
  }

  return (
    <div className="layout-wrapper">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="main-content">
        <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
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

/* eslint-disable max-lines */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './Sidebar.module.css';

import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import SettingsIcon from '@mui/icons-material/Settings';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import InsightsIcon from '@mui/icons-material/Insights';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Collapse } from '@mui/material';
import { BRAND } from '@/lib/core/brand';
import { ReferralModal } from '@/components/referral/ReferralModal';

const settingsSubItems = [
  { id: 'destinations', label: 'Destinations' },
  { id: 'snippets', label: 'Snippets' },
  { id: 'ai', label: 'AI Providers' },
  { id: 'storage', label: 'Storage (BYOS)' },
  { id: 'account', label: 'Account' },
  { id: 'support', label: 'Support' },
];

const Sidebar = ({ isOpen, onClose, isFreeTier = true }: { isOpen: boolean; onClose: () => void; isFreeTier?: boolean }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab') || 'destinations';

  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [hasStatusAlert, setHasStatusAlert] = useState(false);

  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [referralData, setReferralData] = useState({
    referralUrl: '',
    activeCount: 0,
    quotaRemaining: 0,
    history: [],
    subscriptionTier: 'FREE_STARTER'
  });

  const handleOpenReferral = async () => {
    setIsReferralModalOpen(true);
    try {
      const res = await fetch('/api/referral');
      if (res.ok) {
        const data = await res.json();
        setReferralData(data);
      }
    } catch (err) {
      console.error('Failed to load referral stats', err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSettingsExpanded(!!pathname?.startsWith('/settings'));
  }, [pathname]);

  useEffect(() => {
    if (!session?.user) return;

    let isMounted = true;
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status/personalized');
        if (res.ok && isMounted) {
          const data = await res.json();
          setHasStatusAlert(data.hasAlert === true);
        }
      } catch (err) {
        console.error('Failed to fetch personalized status', err);
      }
    };

    fetchStatus();
    // Poll every 5 minutes
    const interval = setInterval(fetchStatus, 5 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [session?.user]);

  const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon sx={{ fontSize: 20 }} />, path: '/' },
    { name: 'Schedule', icon: <CalendarMonthIcon sx={{ fontSize: 20 }} />, path: '/schedule' },
    { name: 'Media Gallery', icon: <PermMediaIcon sx={{ fontSize: 20 }} />, path: '/media' },
    { name: 'Activity Hub', icon: <FlashOnIcon sx={{ fontSize: 20 }} />, path: '/activity' },
    ...(session?.user?.role === 'ADMIN' ? [
      { name: 'Analytics', icon: <InsightsIcon sx={{ fontSize: 20 }} />, path: '/admin/analytics' },
    ] : []),
    { name: 'Settings', icon: <SettingsIcon sx={{ fontSize: 20 }} />, path: '/settings' },
    { 
      name: 'System Status', 
      icon: <CloudQueueIcon sx={{ fontSize: 20 }} />, 
      path: '/status',
      alert: hasStatusAlert
    },
    ...(isFreeTier ? [
      { name: 'Upgrade Plan', icon: <AutoAwesomeIcon sx={{ fontSize: 20 }} />, path: '/pricing' }
    ] : []),
  ];

  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`} 
        onClick={onClose}
      />
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <Link href="/" className={styles.logo} onClick={onClose}>
          <div className={styles.logoIcon}>
            <AutoAwesomeIcon sx={{ fontSize: 24, color: 'hsl(var(--primary))' }} />
          </div>
          <span className={styles.logoText}>{BRAND.name}</span>
          <button className={styles.closeButton} onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </Link>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const isSettings = item.name === 'Settings';
          const isActive = pathname === item.path || (isSettings && pathname?.startsWith('/settings'));
          
          return (
            <React.Fragment key={item.name}>
              <Link 
                href={item.path} 
                className={`${styles.navItem} ${isActive && !isSettings ? styles.active : ''}`}
                onClick={(e) => {
                  if (isSettings) {
                    e.preventDefault(); // Just expand/collapse, do not navigate
                    setIsSettingsExpanded(!isSettingsExpanded);
                  } else {
                    setIsSettingsExpanded(false); // Collapse settings when navigating elsewhere
                    onClose();
                  }
                }}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.name} style={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {item.alert && <WarningAmberIcon color="error" sx={{ fontSize: 18 }} />}
                  {item.name}
                </span>
                {isSettings && (
                  <span className={styles.chevron}>
                    {isSettingsExpanded ? <ExpandMoreIcon sx={{ fontSize: 18 }} /> : <ChevronRightIcon sx={{ fontSize: 18 }} />}
                  </span>
                )}
              </Link>
              {isSettings && (
                <Collapse in={isSettingsExpanded} timeout="auto" unmountOnExit>
                  <div className={styles.subnav}>
                    {settingsSubItems.map(sub => (
                      <Link
                        key={sub.id}
                        href={`/settings?tab=${sub.id}`}
                        className={`${styles.subnavItem} ${currentTab === sub.id && isActive ? styles.subnavActive : ''}`}
                        onClick={onClose}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </nav>

        <div style={{ padding: '16px', marginTop: 'auto', borderTop: '1px solid rgba(128,128,128,0.2)' }}>
          <button 
            onClick={handleOpenReferral}
            style={{ 
              width: '100%', padding: '12px', 
              background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)', 
              color: 'white', border: 'none', borderRadius: '8px', 
              cursor: 'pointer', fontWeight: 600, fontSize: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 18 }} /> Get Cloud Pro for Free
          </button>
        </div>
      </aside>
      
      <ReferralModal 
        open={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
        referralUrl={referralData.referralUrl}
        activeCount={referralData.activeCount}
        quotaRemaining={referralData.quotaRemaining}
        history={referralData.history}
        subscriptionTier={referralData.subscriptionTier}
      />
    </>
  );
};

export default Sidebar;

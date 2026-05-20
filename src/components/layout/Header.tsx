'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import styles from './Header.module.css';
import { WhatsNewBadge } from '../WhatsNew/WhatsNewBadge';

export const Header = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const targetPage = pathname.startsWith('/media') ? '/media' : '/history';
      router.push(`${targetPage}?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className={styles.header}>
      <button className={styles.menuBtn} onClick={onToggleSidebar}>☰</button>
      <div className={styles.search}>
        <input
          id="header-search"
          type="text"
          placeholder="Search..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
      <div className={styles.actions}>
        <WhatsNewBadge />
        <UserActions session={session} />
      </div>
    </header>
  );
};

import { Session } from 'next-auth';

// ... (existing imports)

const UserActions = ({ session }: { session: Session | null }) => (
  <>
    <button className={styles.notificationBtn}>🔔</button>
    <button className={styles.createBtn} onClick={() => window.location.hash = 'create-post-section'}>
      + Create Post
    </button>
    {session?.user && (
      <div className={styles.userProfile}>
        {session.user.image ? <img src={session.user.image} alt="User" className={styles.userAvatar} /> : <div className={styles.userAvatar}>{session.user.name?.charAt(0) || 'U'}</div>}
        <button className={styles.logoutBtn} onClick={() => signOut({ callbackUrl: '/login' })}>Sign Out</button>
      </div>
    )}
  </>
);

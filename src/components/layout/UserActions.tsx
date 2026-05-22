'use client';
import React, { useState } from 'react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { Menu, MenuItem } from '@mui/material';
import { WhatsNewPopover } from '../WhatsNew/WhatsNewPopover';
import styles from './Header.module.css';

export function UserActions({ session }: { session: Session | null }) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null);

  const handleWhatsNew = () => { setPopoverAnchor(menuAnchor); setMenuAnchor(null); };

  return (
    <>
      <button className={styles.notificationBtn}>🔔</button>
      <button className={styles.createBtn} onClick={() => { window.location.hash = 'create-post-section'; }}>
        + Create Post
      </button>
      {session?.user && (
        <div className={styles.userProfile}>
          <button
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            aria-label="User profile"
            data-testid="profile-menu-button"
          >
            {session.user.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={session.user.image} alt="User" className={styles.userAvatar} />
            ) : (
              <div className={styles.userAvatar}>{session.user.name?.charAt(0) || 'U'}</div>
            )}
          </button>
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)} disableScrollLock anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MenuItem onClick={handleWhatsNew} data-testid="whats-new-profile-link">What&apos;s New</MenuItem>
            <MenuItem onClick={() => signOut({ callbackUrl: '/login' })} data-testid="sign-out-button">Sign Out</MenuItem>
          </Menu>
          <WhatsNewPopover anchorEl={popoverAnchor} onClose={() => setPopoverAnchor(null)} />
        </div>
      )}
    </>
  );
}

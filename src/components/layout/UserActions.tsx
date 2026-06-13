'use client';
import React, { useState } from 'react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { Menu, MenuItem, Divider, ListItemIcon, ListItemText } from '@mui/material';
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { WhatsNewPopover } from '../WhatsNew/WhatsNewPopover';
import NotificationBell from '../Notifications/NotificationBell';
import styles from './Header.module.css';
import Link from 'next/link';

export function UserActions({ session }: { session: Session | null }) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [helpAnchor, setHelpAnchor] = useState<null | HTMLElement>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null);

  const handleWhatsNew = () => { setPopoverAnchor(menuAnchor); setMenuAnchor(null); };
  const handleHelpClick = (e: React.MouseEvent<HTMLElement>) => { setHelpAnchor(e.currentTarget); };
  const closeAllMenus = () => { setMenuAnchor(null); setHelpAnchor(null); };

  return (
    <>
      <NotificationBell />
      <button className={styles.createBtn} onClick={() => { window.location.hash = 'create-post-section'; }}>
        <span className={styles.btnPlus}>+</span> <span>Create Post</span>
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
          
          <Menu 
            anchorEl={menuAnchor} 
            open={Boolean(menuAnchor)} 
            onClose={() => setMenuAnchor(null)} 
            disableScrollLock 
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleWhatsNew} data-testid="whats-new-profile-link">What&apos;s New</MenuItem>
            
            <MenuItem onClick={handleHelpClick}>
              <ListItemIcon><HelpOutlinedIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Help</ListItemText>
              <ChevronRightIcon fontSize="small" sx={{ ml: 1, opacity: 0.5 }} />
            </MenuItem>

            <Menu
              anchorEl={helpAnchor}
              open={Boolean(helpAnchor)}
              onClose={() => setHelpAnchor(null)}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              disableScrollLock
            >
              <MenuItem component={Link} href="/docs" onClick={closeAllMenus}>Documentation</MenuItem>
              <MenuItem component={Link} href="/privacy" onClick={closeAllMenus}>Privacy Policy</MenuItem>
              <MenuItem component={Link} href="/terms" onClick={closeAllMenus}>Terms of Service</MenuItem>
            </Menu>

            <Divider />
            <MenuItem onClick={() => signOut({ callbackUrl: '/login' })} data-testid="sign-out-button">Sign Out</MenuItem>
          </Menu>
          
          <WhatsNewPopover anchorEl={popoverAnchor} onClose={() => setPopoverAnchor(null)} />
        </div>
      )}
    </>
  );
}

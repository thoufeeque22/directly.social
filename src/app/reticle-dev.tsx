'use client';
import { useEffect } from 'react';

export function ReticleDev() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    void import('@reticlehq/react').then(({ reticle, install, registerCapabilities }) => {
      install();
      const token = process.env.NEXT_PUBLIC_RETICLE_TOKEN;
      reticle.connect(token ? { token } : {});
      registerCapabilities({
        testids: [], // your data-testid values
        signals: [], // your reticle.signal() names
        stores: [], // your registerStore() names
      });
    });
  }, []);
  return null;
}

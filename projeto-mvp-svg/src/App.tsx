/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ProLayout } from './components/layout/ProLayout';
import { VLibras } from './components/accessibility/VLibras';
import { useAuthStore } from './store/useAdminStore';

export default function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <>
      <ProLayout />
      <VLibras />
    </>
  );
}




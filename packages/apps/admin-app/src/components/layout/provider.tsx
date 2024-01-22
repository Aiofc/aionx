'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { Toaster } from '@aionx/aionx-ui';
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster />
        {children}
      </ThemeProvider>
    </>
  );
}

// src/app/layout.tsx
'use client';

import './globals.css';
import { ThemeContextProvider } from '@/context/ThemeContext';
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeContextProvider>
          {children}
        </ThemeContextProvider>
      </body>
    </html>
  );
}

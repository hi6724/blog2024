'use client';
import React, { useState } from 'react';
import NavBar from './NavBar';

function Theme({ children }: any) {
  const [theme, setTheme] = useState('emerald');
  return (
    <div data-theme={theme}>
      <NavBar themeState={[theme, setTheme]} />
      {children}
    </div>
  );
}

export default Theme;

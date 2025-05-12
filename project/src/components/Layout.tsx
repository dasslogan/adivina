import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-4">
      {children}
      <footer className="mt-8 text-center text-sm text-purple-300">
        <p>© 2025 TikTok Riddle Challenge</p>
      </footer>
    </div>
  );
};
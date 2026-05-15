import React from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children, updateAuth }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar updateAuth={updateAuth} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

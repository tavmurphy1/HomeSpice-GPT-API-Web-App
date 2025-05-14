import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Navbar />
        <main>
          {/* Outlet is a placeholder for child routes */}
          {children ?? <Outlet />}
        </main>
    </>
  );
};

export default Layout;
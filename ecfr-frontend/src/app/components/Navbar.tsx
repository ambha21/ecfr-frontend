'use client';

import Link from 'next/link';
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex space-x-6">
          <Link 
            href="/" 
            className="text-xl font-semibold text-white hover:text-slate-300 transition-colors duration-300"
          >
            🗺️ Explore
          </Link>
          <Link 
            href="/search" 
            className="text-xl font-semibold text-white hover:text-slate-300 transition-colors duration-300"
          >
            🔎 Search
          </Link>
          <Link 
            href="/analysis" 
            className="text-xl font-semibold text-white hover:text-slate-300 transition-colors duration-300"
          >
            📊 Analysis
          </Link>
        </div>
        <div>
          <a 
            href="https://github.com/ambha21/ecfr-frontend" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors duration-300"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/Admin/Dashboard', icon: '📊' },
  { name: 'Orders', href: '/Admin/Orders', icon: '📦' },
  { name: 'Categories', href: '/Admin/Categories', icon: '📁' },
  { name: 'Products', href: '/Admin/Products', icon: '🍔' },
  { name: 'Addons', href: '/Admin/Addons', icon: '➕' },
  { name: 'Branches', href: '/Admin/Branches', icon: '📍' },
  { name: 'Customers', href: '/Admin/Customers', icon: '👤' },
  { name: 'Settings', href: '/Admin/Settings', icon: '⚙️' },
  { name: 'Profile', href: '/Admin/Profile', icon: '🆔' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <span className="brand-logo">🛠️</span>
        <span className="brand-name">UPTOWN ADMIN</span>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={`nav-item ${pathname === item.href ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <div className="system-status">
          <span className="status-dot"></span>
          <span className="status-text">System Live</span>
        </div>
      </div>
    </aside>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Layers, Tags } from 'lucide-react';

export default function SidebarNavigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Posts', href: '/admin/posts', icon: FileText },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Tags', href: '/admin/tags', icon: Tags },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 shadow-xl hidden md:block border-r border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wide">Admin Panel</h1>
      </div>
      <nav className="mt-6">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 border-l-4 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-500 font-semibold shadow-inner'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

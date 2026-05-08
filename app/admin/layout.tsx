

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import SidebarNavigation from '@/components/admin/SidebarNavigation';
import { ReactNode } from 'react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
      {/* Sidebar - Extracted to Client Component for active pathing */}
      <SidebarNavigation />

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-h-full transition-colors duration-300 text-gray-900 dark:text-white">
          {children}
        </div>
      </main>
    </div>
  );
}
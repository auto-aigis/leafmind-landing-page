"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/_lib/hooks';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-white text-gray-900">Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Settings', href: '/settings' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-screen bg-white">
      <div className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-gray-200">
        <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">LeafMind</h1>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                isActive(item.href)
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-gray-200 p-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:ml-0">
        <div className="md:hidden flex items-center justify-between h-14 px-4 border-b border-gray-200 bg-white">
          <h1 className="text-lg font-bold text-gray-900">LeafMind</h1>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-gray-700 hover:text-gray-900"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed left-0 top-14 w-64 h-screen bg-white border-r border-gray-200 z-40 overflow-y-auto">
              <nav className="px-4 py-6 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isActive(item.href)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="border-t border-gray-200 p-4">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Logout
                </Button>
              </div>
            </div>
          </>
        )}

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
}

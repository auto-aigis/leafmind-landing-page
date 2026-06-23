'use client';

import {useEffect, useState} from 'react';
import {useRouter, usePathname} from 'next/navigation';
import Link from 'next/link';
import {useAuth} from '@/_lib/hooks';
import {Button} from '@/components/ui/button';
import {Menu, X, LogOut, Leaf} from 'lucide-react';

export function AppShell({children}: {children: React.ReactNode}) {
  const {user, loading, logout} = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return null;

  const isActive = (path: string) => pathname === path ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-700 hover:bg-gray-50';

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen">
      <aside className="hidden md:flex md:w-64 flex-col border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 font-semibold text-gray-900">
            <Leaf className="w-5 h-5" />
            LeafMind
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard" className={`block px-3 py-2 rounded ${isActive('/dashboard')}`}>
            Dashboard
          </Link>
          <Link href="/plants" className={`block px-3 py-2 rounded ${isActive('/plants')}`}>
            My Plants
          </Link>
          <Link href="/pricing" className={`block px-3 py-2 rounded ${isActive('/pricing')}`}>
            Plans
          </Link>
          <Link href="/settings" className={`block px-3 py-2 rounded ${isActive('/settings')}`}>
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <div className="md:hidden h-14 border-b border-gray-200 bg-white flex items-center px-4 gap-3">
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex-1 flex items-center gap-2 font-semibold text-gray-900">
            <Leaf className="w-5 h-5" />
            LeafMind
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden fixed inset-0 bg-black/20 z-40" onClick={() => setMobileOpen(false)} />
        )}

        {mobileOpen && (
          <nav className="md:hidden absolute left-0 top-14 w-64 bg-white border-r border-gray-200 z-50 p-4 space-y-1">
            <Link href="/dashboard" className={`block px-3 py-2 rounded ${isActive('/dashboard')}`}>
              Dashboard
            </Link>
            <Link href="/plants" className={`block px-3 py-2 rounded ${isActive('/plants')}`}>
              My Plants
            </Link>
            <Link href="/pricing" className={`block px-3 py-2 rounded ${isActive('/pricing')}`}>
              Plans
            </Link>
            <Link href="/settings" className={`block px-3 py-2 rounded ${isActive('/settings')}`}>
              Settings
            </Link>
            <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>
        )}

        <main className="flex-1 overflow-auto md:ml-0 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}

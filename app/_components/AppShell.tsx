"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/_components/AuthProvider";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Pricing", href: "/pricing" },
  { label: "Settings", href: "/settings" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-white">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-white">
      <div className="fixed left-0 top-0 bottom-0 z-40 w-64 border-r border-gray-200 bg-white hidden md:block p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-8">LeafMind</h1>
        <nav className="space-y-2 flex-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gray-100 font-medium text-gray-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>
        <Button variant="ghost" onClick={logout} className="w-full justify-start text-gray-700 hover:bg-gray-100">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>

      <div className="md:ml-64 w-full flex flex-col">
        <div className="md:hidden h-14 border-b border-gray-200 bg-white flex items-center px-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">LeafMind</h1>
          <div className="w-10" />
        </div>

        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 top-14 bg-black/20 z-20" onClick={() => setSidebarOpen(false)} />
        )}

        {sidebarOpen && (
          <div className="md:hidden fixed left-0 top-14 bottom-0 w-64 bg-white border-r border-gray-200 z-20 p-4">
            <nav className="space-y-2">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => {
                    router.push(link.href);
                    setSidebarOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  {link.label}
                </button>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="ghost" onClick={() => { logout(); setSidebarOpen(false); }} className="w-full justify-start text-gray-700 hover:bg-gray-100">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
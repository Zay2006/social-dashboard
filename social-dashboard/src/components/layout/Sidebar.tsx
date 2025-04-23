"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings,
  Bell,
  User,
  Palette
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { name: 'Users', icon: Users, href: '/users' },
  { name: 'Posts', icon: FileText, href: '/posts' },
  {
    name: 'Settings',
    icon: Settings,
    href: '/settings',
    submenu: [
      { name: 'Account', icon: User, href: '/settings/account' },
      { name: 'Notifications', icon: Bell, href: '/settings/notifications' },
      { name: 'Appearance', icon: Palette, href: '/settings/appearance' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Social Dashboard</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <div className="space-y-1">
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
                {item.submenu && (
                  <ul className="ml-6 space-y-1">
                    {item.submenu.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          href={subItem.href}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                            pathname === subItem.href
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <subItem.icon className="h-4 w-4" />
                          <span>{subItem.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

import React from 'react';
import {
  Home,
  ClipboardList,
  Settings,
  Phone,
  HelpCircle,
  LogOut,
  HardHat,
  X,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// --- Sidebar Component ---
const Sidebar = ({ user, isSidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { icon: <Home className="h-5 w-5" />, text: 'Dashboard' },
    { icon: <ClipboardList className="h-5 w-5" />, text: 'Instructions' },
    { icon: <Settings className="h-5 w-5" />, text: 'Settings' },
  ];

  const quickActionItems = [
    {
      icon: <Phone className="h-5 w-5" />,
      text: 'Start Video Call',
      href: 'https://videocalling-pxsn-beta.vercel.app/',
    },
    { icon: <HelpCircle className="h-5 w-5" />, text: 'Report Safety Issue' },
  ];

  return (
    <>
      {/* Overlay for mobile. Only appears on small screens when sidebar is open. */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 flex h-full w-64 flex-col border-r bg-white transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          
          {/* Close button for mobile, visible inside the sidebar */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col p-4">
          <Avatar className="h-16 w-16 self-center mb-2">
            <AvatarImage src={user?.avatarUrl} alt={user?.fullname} />
            <AvatarFallback>{user?.fullname?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <h2 className="text-center text-lg font-semibold text-gray-800">
            {user?.fullname || 'Unknown User'}
          </h2>
          <p className="text-center text-sm text-gray-500">{user?.email}</p>
        </div>

        <nav className="flex-1 space-y-4 px-4">
          <div>
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-gray-400">
              Menu
            </h3>
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Button
                    variant={index === 0 ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-3"
                  >
                    {item.icon}
                    {item.text}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-gray-400">
              Quick Actions
            </h3>
            <ul className="space-y-1">
              {quickActionItems.map((item, index) => (
                <li key={index}>
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.icon} {item.text}
                      </a>
                    ) : (
                      <>
                        {item.icon} {item.text}
                      </>
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="p-4 border-t">
          <Button variant="outline" className="w-full justify-start gap-3">
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

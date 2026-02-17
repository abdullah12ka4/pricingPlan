import { Menu, X, Home, ShoppingCart, Users, Settings, Building2, HelpCircle, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Separator } from './ui/separator';

interface MobileSidebarProps {
  currentView: string;
  onNavigate: (view: 'home' | 'customer' | 'admin' | 'sales' | 'training-org') => void;
}

export function MobileSidebar({ currentView, onNavigate }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Home', view: 'home' as const },
    { icon: ShoppingCart, label: 'Pricing Portal', view: 'customer' as const },
    { icon: Users, label: 'Sales Portal', view: 'sales' as const },
    { icon: Building2, label: 'Training Org', view: 'training-org' as const },
    { icon: Settings, label: 'Admin Console', view: 'admin' as const },
  ];

  const handleNavigate = (view: typeof menuItems[number]['view']) => {
    onNavigate(view);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden h-9 w-9 p-0">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">ST</span>
            </div>
            <div>
              <SheetTitle className="text-[#044866] text-left">SkilTrak</SheetTitle>
              <p className="text-xs text-gray-500 text-left">Pricing Platform</p>
            </div>
          </div>
        </SheetHeader>

        <Separator />

        <nav className="p-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavigate(item.view)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                  currentView === item.view
                    ? 'bg-[#044866] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-all">
              <HelpCircle className="w-5 h-5" />
              <span>Help & Support</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">DU</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Demo User</p>
              <p className="text-xs text-gray-500">demo@skiltrak.com</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

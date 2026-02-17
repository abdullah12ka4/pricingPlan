'use client'

import { Bell, Building2, Clock, Mail, Phone, ShieldCheck, User, X } from 'lucide-react';
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MobileSidebar } from './MobileSidebar';
import Cookies from 'js-cookie';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { SalesAgentType } from '../pages/AdminDashboard/Types/AdminType';
import { useGetNotificationQuery } from '@/Redux/services/Notifications';
import { Spinner } from './ui/spinner';
import { timeAgo } from './Reusable/TimeAgo';
import { useState } from 'react';

interface GlobalNavProps {
  currentView: string;
  onNavigate: (view: 'home' | 'customer' | 'admin' | 'sales' | 'training-org') => void;
  showNotifications?: boolean;
  agent?: SalesAgentType
}

export function GlobalNav({ agent, currentView, onNavigate }: GlobalNavProps) {
  const [showProfile, setShowProfile] = useState(false);
  const { data, isLoading, error } = useGetNotificationQuery(true)
  const router = useRouter()

  // const notifications = [
  //   { id: 1, type: 'info', message: 'New pricing tier published', time: '5m ago' },
  //   { id: 2, type: 'success', message: 'Quote #QT-2024-045 accepted', time: '1h ago' },
  //   { id: 3, type: 'warning', message: 'Low credit balance warning', time: '2h ago' },
  // ];

  // const unreadCount = notifications.length;

  const handleLogOut = async () => {
    try {
      Cookies.remove('accessToken')
      toast.success("Login Successfully")
      router.push('/login')
    } catch (error) {
      toast.error('Failed to Logout')
    }

  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-red-500 p-4 text-center">
        <div>
          <p className="font-bold">Error loading data</p>
          <p className="text-sm">
            {(error as { status?: number }).status || "Network Error"}: {(error as { error?: string }).error || "Failed to fetch data"}
          </p>
        </div>
      </div>
    );
  }

  const handleRead = (id: string) => {
    console.log(id)
  }
  const notification = data.data.notifications
  const unreadCount = notification.length
  return (
    <header className="border-b border-[#044866]/10 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 py-3">
        <div className="flex items-center justify-between">
          {/* Mobile Sidebar + Logo */}
          <div className="flex items-center gap-3">
            <MobileSidebar currentView={currentView} onNavigate={onNavigate} />

            {/* Logo & Home */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-lg flex items-center justify-center py-2 px-4">
                <span className="text-white font-bold text-sm">ST</span>
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-lg text-[#044866] leading-none">SkilTrak</span>
                <span className="text-[10px] text-gray-500">Pricing Platform</span>
              </div>
            </button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-5">
            {/* Notifications */}
            {notification.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative">
                    <Bell className="w-4 h-4 text-gray-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Notifications
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                      {unreadCount} new
                    </Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notification.map((notif: any) => (
                    <DropdownMenuItem onClick={() => handleRead(notif.id)} key={notif.id} className="flex flex-col items-start py-3">
                      <span className="text-sm text-gray-700">{notif.message}</span>
                      <span className="text-xs text-gray-500 mt-1">{timeAgo(notif.created_at)}</span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-center text-xs text-[#044866] justify-center">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-full flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 hidden md:inline">{agent?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm">{agent?.name}</span>
                    <span className="text-xs text-gray-500 font-normal">{agent?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowProfile(true)}
                >
                  👤 My Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogOut} className="text-red-600">
                  🚪 Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Dialog.Root open={showProfile} onOpenChange={setShowProfile}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
              <Dialog.Content
                className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-md 
  -translate-x-1/2 -translate-y-1/2 
  rounded-2xl bg-white shadow-xl overflow-hidden focus:outline-none"
              >

                {/* Header */}
                <Dialog.Title>
                  <div className="bg-gradient-to-r from-[#044866] to-[#0D5468] p-6 text-white">
                    <div className="flex items-center gap-4">

                      <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                        {agent?.name?.charAt(0)}
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold">{agent?.name}</h2>
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                          {agent?.role?.replace("_", " ")}
                        </span>
                      </div>

                    </div>
                  </div>
                </Dialog.Title>

                {/* Body */}
                <div className="p-6 space-y-4">

                  <ProfileRow icon={Mail} label="Email" value={agent?.email} />
                  <ProfileRow icon={Phone} label="Phone" value={agent?.phoneNumber || "—"} />
                  <ProfileRow icon={ShieldCheck} label="Status" value={agent?.status} />
                  <ProfileRow icon={Clock} label="Last Login" value={agent?.lastLogin ? timeAgo(agent?.lastLogin) : "—"} />
                  <ProfileRow icon={Building2} label="Organization" value={agent?.organization?.name || "—"} />

                  <Dialog.Close asChild>
                    <button className="absolute right-4 top-4 text-white/80 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </Dialog.Close>

                </div>
              </Dialog.Content>
            </Dialog.Portal>

          </Dialog.Root>

        </div>
      </div>
    </header>
  );
}

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  active?: boolean;
}



function ProfileRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-[#044866]/10 rounded-lg">
        <Icon className="w-4 h-4 text-[#044866]" />
      </div>

      <div className="flex flex-col">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-sm font-medium text-gray-800">
          {value}
        </span>
      </div>
    </div>
  );
}

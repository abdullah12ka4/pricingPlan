'use client';

import { useState } from 'react';
import {
  Bell, Building2, Clock, Mail, MailOpen, Phone, ShieldCheck, User, X,
} from 'lucide-react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import * as Dialog from '@radix-ui/react-dialog';

import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Spinner } from './ui/spinner';
import { MobileSidebar } from './MobileSidebar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

import { useGetNotificationQuery, useReadNotificationMutation } from '@/Redux/services/Notifications';
import { SalesAgentType } from '../pages/AdminDashboard/Types/AdminType';
import { timeAgo } from './Reusable/TimeAgo';

interface GlobalNavProps {
  currentView: string;
  onNavigate: (view: 'home' | 'customer' | 'admin' | 'sales' | 'training-org') => void;
  agent?: SalesAgentType;
}

export function GlobalNav({ agent, currentView, onNavigate }: GlobalNavProps) {
  if (!agent?.id) {
    return null;
  }
  const [all, setAll] = useState(false)
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();
  const { data: notifications, isLoading: notificationLoading, error } = useGetNotificationQuery({ userId: agent?.id, isRead: undefined });
  const [readNotification] = useReadNotificationMutation();
  const handleLogOut = () => {
    Cookies.remove('accessToken');
    toast.success('Logged out');
    router.push('/login');
  };
  const isLoading = notificationLoading

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  if (error) {
    const err = error as { status?: number; error?: string };
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-red-500 p-4 text-center">
        <div>
          <p className="font-bold">Error loading data</p>
          <p className="text-sm">
            {err.status || 'Network Error'}: {err.error || 'Failed to fetch data'}
          </p>
        </div>
      </div>
    );
  }
  const onlyView = notifications?.slice(0, 3)
  const wholeNot = all ? notifications : onlyView
  const unreadNotifications = notifications?.length;
  const handleView = async (id: string) => {
    try {
      const res = await readNotification(id).unwrap();
      if (res.success) {
        toast.success("Message Read Successfully")
      }
    } catch (error) {
      console.log(error)
    }

  }
  return (
    <header className="sticky top-0 z-50 border-b border-[#044866]/10 bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
        {/* Sidebar + Logo */}
        <div className="flex items-center gap-3">
          <MobileSidebar currentView={currentView} onNavigate={onNavigate} />
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 hover:opacity-80"
          >
            <div className="bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-lg py-2 px-4 text-white font-bold text-sm">
              ST
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-lg text-[#044866] leading-none">SkilTrak</span>
              <span className="text-[10px] text-gray-500">Pricing Platform</span>
            </div>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5">
          {/* Notifications */}
          {unreadNotifications !== 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 p-0 relative"
                >
                  <Bell className="w-4 h-4 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-80 z-[9999]"
              >
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notifications
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-600 border-red-200"
                  >
                    {unreadNotifications} new
                  </Badge>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                {wholeNot?.map((n: any) => (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(n.id);
                    }}
                    key={n.id}
                    className="flex flex-col items-start py-3"
                  >
                    <div className="flex items-center justify-between w-full ">
                      <span className="text-sm text-gray-700">{n.message}</span>
                      <Mail className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-xs text-gray-500">
                      {timeAgo(n.createdAt)}
                    </span>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setAll(!all)}
                  className="justify-center text-xs text-[#044866]">
                  {all ? "View Less" : "View all notifications"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 gap-2"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="hidden md:inline text-sm text-gray-700">
                  {agent?.name}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 z-[10000]">
              <DropdownMenuLabel>
                <div>
                  <span className="text-sm">{agent?.name}</span>
                  <p className="text-xs text-gray-500">{agent?.email}</p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowProfile(true)}>
                👤 My Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogOut} className="text-red-600">
                🚪 Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Profile dialog */}
        <Dialog.Root open={showProfile} onOpenChange={setShowProfile}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm" />
            <Dialog.Content
              className="fixed left-1/2 top-1/2 z-[9999] w-[95vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl overflow-hidden"
            >
              <Dialog.Title>
                <div className="bg-gradient-to-r from-[#044866] to-[#0D5468] p-6 text-white flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                    {agent?.name?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{agent?.name}</h2>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {agent?.role?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </Dialog.Title>

              <div className="p-6 space-y-4">
                <ProfileRow icon={Mail} label="Email" value={agent?.email} />
                <ProfileRow icon={Phone} label="Phone" value={agent?.phoneNumber || '—'} />
                <ProfileRow icon={ShieldCheck} label="Status" value={agent?.status} />
                <ProfileRow icon={Clock} label="Last Login" value={agent?.lastLogin ? timeAgo(agent?.lastLogin) : '—'} />
                <ProfileRow icon={Building2} label="Organization" value={agent?.organization?.name || '—'} />

                <Dialog.Close asChild>
                  <button className="absolute top-4 right-4 text-white/80 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
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
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
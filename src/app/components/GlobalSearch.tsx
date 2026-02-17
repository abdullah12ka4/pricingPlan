import { useState } from 'react';
import { Search, ShoppingCart, Users, Settings, Building2, FileText, DollarSign, Package } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (view: string) => void;
}

export function GlobalSearch({ open, onOpenChange, onNavigate }: GlobalSearchProps) {
  const quickActions = [
    {
      icon: ShoppingCart,
      label: 'View Pricing Portal',
      action: 'customer',
      category: 'Navigation'
    },
    {
      icon: Users,
      label: 'Open Sales Portal',
      action: 'sales',
      category: 'Navigation'
    },
    {
      icon: Settings,
      label: 'Open Admin Console',
      action: 'admin',
      category: 'Navigation'
    },
    {
      icon: Building2,
      label: 'View Training Org Portal',
      action: 'training-org',
      category: 'Navigation'
    },
    {
      icon: FileText,
      label: 'Create New Quote',
      action: 'create-quote',
      category: 'Actions'
    },
    {
      icon: Package,
      label: 'Manage Add-ons',
      action: 'manage-addons',
      category: 'Actions'
    },
    {
      icon: DollarSign,
      label: 'Configure Pricing Tiers',
      action: 'configure-tiers',
      category: 'Actions'
    },
  ];

  const handleSelect = (action: string) => {
    onOpenChange(false);
    if (['customer', 'sales', 'admin', 'training-org'].includes(action)) {
      onNavigate(action);
    }
    // Handle other actions as needed
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search for pages, actions, or features..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          {quickActions
            .filter(item => item.category === 'Navigation')
            .map((item, idx) => (
              <CommandItem
                key={idx}
                onSelect={() => handleSelect(item.action)}
                className="flex items-center gap-3 px-3 py-2"
              >
                <item.icon className="w-4 h-4 text-[#044866]" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
        </CommandGroup>

        <CommandGroup heading="Quick Actions">
          {quickActions
            .filter(item => item.category === 'Actions')
            .map((item, idx) => (
              <CommandItem
                key={idx}
                onSelect={() => handleSelect(item.action)}
                className="flex items-center gap-3 px-3 py-2"
              >
                <item.icon className="w-4 h-4 text-[#F7A619]" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

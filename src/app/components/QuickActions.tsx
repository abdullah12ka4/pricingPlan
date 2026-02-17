import { Plus, Download, Send, RefreshCw, FileText, Upload } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface QuickActionsProps {
  context: 'customer' | 'sales' | 'admin' | 'training-org';
  onAction?: (action: string) => void;
}

export function QuickActions({ context, onAction }: QuickActionsProps) {
  const getActions = () => {
    switch (context) {
      case 'customer':
        return [
          { icon: Download, label: 'Download Quote PDF', action: 'download-quote' },
          { icon: Send, label: 'Email Quote', action: 'email-quote' },
          { icon: RefreshCw, label: 'Reset Configuration', action: 'reset' },
        ];
      case 'sales':
        return [
          { icon: Plus, label: 'New Quote', action: 'new-quote' },
          { icon: Send, label: 'Send Payment Link', action: 'send-link' },
          { icon: FileText, label: 'Generate Proposal', action: 'generate-proposal' },
          { icon: Download, label: 'Export Quotes', action: 'export-quotes' },
        ];
      case 'admin':
        return [
          { icon: Plus, label: 'Create Pricing Tier', action: 'create-tier' },
          { icon: Plus, label: 'Create Add-on', action: 'create-addon' },
          { icon: Upload, label: 'Import Pricing Data', action: 'import-data' },
          { icon: Download, label: 'Export Configuration', action: 'export-config' },
        ];
      case 'training-org':
        return [
          { icon: Plus, label: 'Purchase Credits', action: 'purchase-credits' },
          { icon: Download, label: 'Export Credit Report', action: 'export-credits' },
          { icon: Download, label: 'Export Invoice History', action: 'export-invoices' },
          { icon: Send, label: 'Request Support', action: 'support' },
        ];
      default:
        return [];
    }
  };

  const actions = getActions();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-[#F7A619] hover:bg-[#F7A619]/90 text-white shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Quick Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((item, idx) => (
          <DropdownMenuItem
            key={idx}
            onClick={() => onAction?.(item.action)}
            className="flex items-center gap-3"
          >
            <item.icon className="w-4 h-4 text-gray-500" />
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

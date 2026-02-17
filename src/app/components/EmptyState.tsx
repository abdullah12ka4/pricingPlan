import { LucideIcon } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-[#044866]/10 to-[#F7A619]/10 rounded-2xl flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-[#044866]" />
      </div>
      <h3 className="text-xl text-[#044866] mb-2">{title}</h3>
      <p className="text-sm text-gray-600 text-center max-w-md mb-6">{description}</p>
      <div className="flex gap-3">
        {actionLabel && onAction && (
          <Button onClick={onAction} className="bg-[#044866] hover:bg-[#0D5468] text-white">
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="outline" onClick={onSecondaryAction} className="border-[#044866]/20 text-[#044866]">
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

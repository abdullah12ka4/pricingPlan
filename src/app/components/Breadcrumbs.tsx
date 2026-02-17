import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <button
        onClick={items[0]?.onClick}
        className="flex items-center gap-1 text-gray-500 hover:text-[#044866] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </button>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="text-gray-600 hover:text-[#044866] transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-[#044866] font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}

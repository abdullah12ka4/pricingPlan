import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: string;
  subtitle?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, color = '#044866', subtitle }: StatsCardProps) {
  const isPositiveTrend = trend && trend.value > 0;
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;

  return (
    <Card className="border-[#044866]/10 hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-semibold text-[#044866]">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                isPositiveTrend
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              <TrendIcon className="w-3 h-3" />
              <span>{Math.abs(trend.value)}%</span>
            </div>
            <span className="text-xs text-gray-500">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

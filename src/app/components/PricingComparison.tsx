import { Check, X, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface Feature {
  name: string;
  basic: boolean | string;
  premium: boolean | string;
  tooltip?: string;
}

interface PricingComparisonProps {
  category: string;
  features: Feature[];
  onSelectBasic?: () => void;
  onSelectPremium?: () => void;
  highlightPremium?: boolean;
}

export function PricingComparison({
  category,
  features,
  onSelectBasic,
  onSelectPremium,
  highlightPremium = true,
}: PricingComparisonProps) {
  const renderCell = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-600 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-300 mx-auto" />
      );
    }
    return <span className="text-sm text-gray-700">{value}</span>;
  };

  return (
    <Card className="border-[#044866]/20">
      <CardHeader>
        <CardTitle className="text-lg text-[#044866]">{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{feature.name}</span>
                {feature.tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">{feature.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="flex items-center justify-center">
                {renderCell(feature.basic)}
              </div>
              <div className="flex items-center justify-center">
                {renderCell(feature.premium)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface QuickCompareProps {
  basicPrice: number;
  premiumPrice: number;
  onSelectBasic?: () => void;
  onSelectPremium?: () => void;
}

export function QuickCompare({
  basicPrice,
  premiumPrice,
  onSelectBasic,
  onSelectPremium,
}: QuickCompareProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Basic Plan */}
      <Card className="border-2 border-[#044866]/10 hover:border-[#044866]/30 transition-all">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl text-[#044866]">Basic</CardTitle>
            <Badge variant="outline" className="bg-gray-100 text-gray-700">
              Standard
            </Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#044866]">${basicPrice}</span>
            <span className="text-sm text-gray-500">/year</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            {[
              'Admin & sub-admin accounts',
              'Student management',
              'Basic reporting',
              'Standard support',
              'Core CRM features',
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-green-600" />
                {item}
              </li>
            ))}
          </ul>
          {onSelectBasic && (
            <Button
              onClick={onSelectBasic}
              variant="outline"
              className="w-full border-[#044866]/20 text-[#044866] hover:bg-[#044866]/5"
            >
              Select Basic
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Premium Plan */}
      <Card className="border-2 border-[#F7A619] bg-gradient-to-br from-white to-[#F7A619]/5 shadow-lg">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-[#F7A619] text-white">Most Popular</Badge>
        </div>
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl text-[#044866]">Premium</CardTitle>
            <Badge variant="outline" className="bg-[#F7A619]/10 text-[#F7A619] border-[#F7A619]/30">
              Recommended
            </Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#044866]">${premiumPrice}</span>
            <span className="text-sm text-gray-500">/year</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            {[
              'Everything in Basic',
              'AI-powered automation',
              'Advanced analytics',
              'Priority support',
              'Custom workflows',
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-[#F7A619]" />
                <span className={idx === 0 ? 'font-medium' : ''}>{item}</span>
              </li>
            ))}
          </ul>
          {onSelectPremium && (
            <Button
              onClick={onSelectPremium}
              className="w-full bg-[#F7A619] hover:bg-[#F7A619]/90 text-white"
            >
              Select Premium
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

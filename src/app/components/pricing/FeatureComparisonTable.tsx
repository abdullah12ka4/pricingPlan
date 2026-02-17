import { Check, X } from 'lucide-react';
import { Feature } from '../../types/pricing';
import React from 'react';

interface FeatureComparisonTableProps {
  features: Feature[];
  groupByCategory?: boolean;
}

export function FeatureComparisonTable({ features, groupByCategory = true }: FeatureComparisonTableProps) {
  const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-4 h-4 text-[#F7A619] mx-auto" />
      ) : (
        <X className="w-4 h-4 text-gray-300 mx-auto" />
      );
    }
    return <span className="text-xs text-[#044866]">{value}</span>;
  };

  const groupedFeatures = groupByCategory
    ? features.reduce((acc, feature) => {
        const category = feature.category || 'Other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(feature);
        return acc;
      }, {} as Record<string, Feature[]>)
    : { 'All Features': features };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-[#044866]/10">
            <th className="text-left p-3 w-2/5 text-sm text-[#044866]">Feature</th>
            <th className="text-center p-3 w-[15%] text-sm text-[#044866]">Basic</th>
            <th className="text-center p-3 w-[15%] text-sm text-[#044866]">Premium</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
            <React.Fragment key={category}>
              {groupByCategory && (
                <tr className="bg-[#044866]/5">
                  <td colSpan={3} className="p-2.5 text-xs text-[#044866]">
                    {category}
                  </td>
                </tr>
              )}
              {categoryFeatures.map((feature) => (
                <tr key={feature.id} className="border-b border-gray-100 hover:bg-[#044866]/5 transition-colors">
                  <td className="p-3">
                    <div>
                      <div className="text-sm text-[#044866]">{feature.name}</div>
                      {feature.description && (
                        <div className="text-xs text-gray-600 mt-0.5">{feature.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-center">{renderValue(feature.basicPlan === 'Included' ? true  : feature.basicPlan)}</td>
                  <td className="p-3 text-center">{renderValue(feature.premiumPlan === 'Included' ? true  : feature.premiumPlan)}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { PricingTier, PlanType } from '../../types/pricing';
import { Check, HardDrive } from 'lucide-react';

interface PricingTierSelectorProps {
  tiers: PricingTier[];
  selectedPlan: PlanType;
  selectedTier: string | null;
  onSelectTier: (tierId: string) => void;
}

export function PricingTierSelector({
  tiers,
  selectedPlan,
  selectedTier,
  onSelectTier
}: PricingTierSelectorProps) {
  // Get unique organization type from selected tier, or use the first matching tier's org type
  const selectedTierObj = tiers.find(t => t.id === selectedTier);
  const organisationType = selectedTierObj?.organisationType;
  
  // Filter tiers by plan type and organization type (if we have a selected tier)
  const planTiers = tiers.filter(t => {
    if (t.planType !== selectedPlan) return false;
    if (organisationType && t.organisationType !== organisationType) return false;
    if (!organisationType && selectedTier === null) {
      // If no tier selected yet, show tiers from the first matching org type
      const firstOrgType = tiers.find(tier => tier.planType === selectedPlan)?.organisationType;
      return t.organisationType === firstOrgType;
    }
    return true;
  });

  return (
    <div className="space-y-2.5">
      <h3 className="text-base text-[#044866]">Select Student Volume Tier</h3>
      <div className="grid gap-2.5">
        {planTiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => onSelectTier(tier.id)}
            className={`p-3.5 border-2 rounded-lg text-left transition-all group ${
              selectedTier === tier.id
                ? 'border-[#044866] bg-[#044866]/5 shadow-md shadow-[#044866]/10'
                : 'border-gray-200 hover:border-[#044866]/30 bg-white'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-[#044866]">
                    {tier.minStudents === 0 ? 'Up to' : `${tier.minStudents.toLocaleString()} -`} {tier.maxStudents.toLocaleString()} students
                  </span>
                  {tier.label && (
                    <span className="px-2 py-0.5 bg-[#F7A619]/10 text-[#F7A619] rounded text-xs">
                      {tier.label}
                    </span>
                  )}
                  {selectedTier === tier.id && (
                    <div className="w-4 h-4 bg-[#044866] rounded-full flex items-center justify-center ml-auto">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <HardDrive className="w-3 h-3" />
                  <span>{tier.storageGB}GB storage included</span>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-xl text-[#044866]">${tier.annualPrice.toLocaleString()}</div>
                <div className="text-xs text-gray-500">per year</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
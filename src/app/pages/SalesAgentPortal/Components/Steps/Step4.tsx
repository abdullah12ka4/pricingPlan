// Step4.tsx
import { Lightbulb } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { usePricing } from "../PricingContext";
import type { SalesWizardForm } from "../../SalesAgentPortal";
import { PricingPlan } from "@/app/pages/AdminDashboard/Types/AdminType";

export default function Step4({data}:{data: PricingPlan[]}) {
  const { watch, setValue } = useFormContext<SalesWizardForm>();
  const selectedOrgType = watch("organizationType");
  const selectedPlanType = watch("plan");   // 'BASIC' | 'PREMIUM'
  const selectedTierId = watch("tier");     // tier id or null

  // Guard: if we somehow got here without previous selections
  if (!selectedOrgType || !selectedPlanType) {
    return (
      <div className="max-w-4xl mx-auto text-center text-gray-600">
        Please select an organisation type and plan first.
      </div>
    );
  }

  // Only tiers for this organisation + this plan
  const tiers = data
    .filter(
      (p) =>
        p.organisationType === selectedOrgType &&
        p.planType === selectedPlanType
    )
    .sort((a, b) => a.minStudents - b.minStudents);

  const handleSelectTier = (id: string) => {
    // Save to the same field your step validation uses
    setValue("tier", id, { shouldDirty: true });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#044866]/10 to-[#0D5468]/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Lightbulb className="w-8 h-8 text-[#044866]" />
        </div>
        <h2 className="text-2xl text-[#044866] mb-2">Select Student Tier</h2>
        <p className="text-sm text-gray-600">
          Choose based on expected student volume
        </p>
      </div>

      <div className="bg-white border border-[#044866]/10 rounded-2xl p-6 space-y-3">
        {tiers.map((tier) => {
          const isSelected = tier.id === selectedTierId;
          const price = parseFloat(tier.annualPrice);

          let rangeLabel = "";
          if (tier.minStudents === 0) {
            rangeLabel = `Up to ${tier.maxStudents.toLocaleString()} students`;
          } else if (!tier.maxStudents || tier.maxStudents === 0) {
            rangeLabel = `${tier.minStudents.toLocaleString()}+ students`;
          } else {
            rangeLabel = `${tier.minStudents.toLocaleString()} - ${tier.maxStudents.toLocaleString()} students`;
          }

          return (
            <button
              type="button"
              key={tier.id}
              onClick={() => handleSelectTier(tier.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                isSelected
                  ? "border-[#044866] bg-[#044866]/5"
                  : "border-gray-200 hover:border-[#044866]/40"
              }`}
            >
              <div>
                <div className="text-sm text-[#044866] font-medium">
                  {rangeLabel}
                </div>
                <div className="text-xs text-gray-500">
                  {tier.storageGb}GB storage included
                </div>
              </div>
              <div className="text-right">
                <div className="text-base text-[#044866] font-semibold">
                  ${price.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">per year</div>
              </div>
            </button>
          );
        })}

        {tiers.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-6">
            No tiers available for this plan yet.
          </div>
        )}
      </div>
    </div>
  );
}
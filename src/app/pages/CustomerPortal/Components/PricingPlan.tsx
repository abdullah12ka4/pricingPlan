import { Lightbulb } from 'lucide-react';
import React from 'react'
import { SalesWizardForm } from '../../SalesAgentPortal/SalesAgentPortal';
import { useFormContext } from 'react-hook-form';
import { PricingPlan } from '../../AdminDashboard/Types/AdminType';

export default function PricingTier({ data }: { data: PricingPlan[] }) {
    const { watch, setValue } = useFormContext<SalesWizardForm>();
    const selectedOrgType = watch("organizationType");
    const selectedPlanType = watch("plan");   // 'BASIC' | 'PREMIUM'
    const selectedTierId = watch("tier");     // tier id or null

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
        <div >
            <div className="mb-5">
                <h2 className="text-2xl text-[#044866] mb-2">Select Student Tier</h2>
            </div>

            <div className="bg-white border border-[#044866]/10 rounded-2xlspace-y-3">
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
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${isSelected
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
    )
}

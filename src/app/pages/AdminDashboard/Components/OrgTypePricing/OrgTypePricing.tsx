'use client'
import { Spinner } from '@/app/components/ui/spinner';
import { useGetPricingTiersQuery } from '@/Redux/services/tiersApi';
import { Briefcase, Building2, Edit, GraduationCap, School, Star } from 'lucide-react';
import { useState } from 'react';


// types/pricing.ts or at the top of your component
type PricingTier = {
  id: string;
  organisationType: string;
  planType: 'BASIC' | 'PREMIUM';
  description: string;
  annualPrice: string | number
  // add other fields as needed
};

type ProcessedPricing = {
  organisationType: string;
  name: string;
  basicPlan: number;
  premiumPlan: number;
  hasBasic: boolean;
  hasPremium: boolean;
};


export default function OrgTypePricing() {
    const [editingOrgs, setEditingOrgs] = useState<{ [key: string]: boolean }>({});
    const { data = [], isLoading, error } = useGetPricingTiersQuery()

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (error && "status" in error) {
        return (
            <div className="text-red-500 h-screen flex items-center justify-center">
                Error {error.status}: {"error" in error ? error.error : "Something went wrong"}
            </div>
        );
    }

const processedData = Object.values(
  (data as PricingTier[]).reduce<Record<string, ProcessedPricing>>((acc, item) => {
    const orgType = item.organisationType;
    const price = Number(item.annualPrice);

    if (!acc[orgType]) {
      acc[orgType] = {
        organisationType: orgType,
        name: item.description,
        basicPlan: 0,
        premiumPlan: 0,
        hasBasic: false,
        hasPremium: false,
      };
    }

    if (item.planType === 'BASIC') {
      acc[orgType].hasBasic = true;
      acc[orgType].basicPlan =
        acc[orgType].basicPlan === 0
          ? price
          : Math.min(acc[orgType].basicPlan, price);
    }

    if (item.planType === 'PREMIUM') {
      acc[orgType].hasPremium = true;
      acc[orgType].premiumPlan =
        acc[orgType].premiumPlan === 0
          ? price
          : Math.min(acc[orgType].premiumPlan, price);
    }

    return acc;
  }, {})
) as ProcessedPricing[];


    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl text-[#044866] mb-1">Organization Type Pricing</h2>
                    <p className="text-sm text-gray-600">Manage base pricing for different organization types shown on the customer portal</p>
                </div>
            </div>

            {processedData.length < 1 && <div className='flex h-[40vh] items-center justify-center'>
                No organization added yet for plans
            </div> }

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 gap-5">
                {processedData.map((org) => {
                    const IconComponent = org.organisationType === 'SCHOOL' ? School :
                        org.organisationType === 'UNIVERSITY' ? Building2 :
                            org.organisationType === 'TAFE' ? GraduationCap : Briefcase;

                    const isEditing = editingOrgs[org.organisationType] || false;
                    const toggleEditing = () => {
                        setEditingOrgs(prev => ({
                            ...prev,
                            [org.organisationType]: !prev[org.organisationType]
                        }));
                    };

                    return (
                        <div key={org.organisationType} className="bg-white border border-[#044866]/10 rounded-2xl p-6 hover:shadow-lg transition-all">
                            <div className="flex items-start gap-6">
                                {/* Icon */}
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                                >
                                    <IconComponent className="w-8 h-8" />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-lg text-[#044866] mb-1">{org.organisationType}</h3>
                                            <p className="text-sm text-gray-600">{org.name}</p>
                                        </div>
                                    </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <div className="text-xs text-gray-600 mb-1">CRM Basic - Starting Price</div>
                                                <div className="text-2xl text-[#044866]">${org?.basicPlan?.toLocaleString()}<span className="text-sm text-gray-600">/year</span></div>
                                            </div>
                                            <div className="p-4 bg-gradient-to-br from-[#044866]/5 to-[#0D5468]/5 rounded-xl border border-[#044866]/20">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Star className="w-3.5 h-3.5 text-[#F7A619]" />
                                                    <div className="text-xs text-gray-600">CRM Premium - Starting Price</div>
                                                </div>
                                                <div className="text-2xl text-[#044866]">${org?.premiumPlan?.toLocaleString()}<span className="text-sm text-gray-600">/year</span></div>
                                            </div>
                                        </div>                                 
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

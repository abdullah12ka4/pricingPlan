import { PlanType, OrganisationType, PricingTier, BillingCycle } from '@/app/types/pricing';

type NetworkPack = {
    id: string;
    name: string;
    credits: number;
    pricePerCredit: number;
    totalPrice: number;
    autoCalculate: boolean;
    description: string;
    billingCycle: BillingCycle;
}
export interface NetworkPackagesResponse {
  data: {
    packages: NetworkPack[];
  };
}

export interface CheckOutSummary  {
    selectedPlan: PlanType;
    selectedOrgType: OrganisationType;
    tier: PricingTier;
    setupFee: number;
    networkPack?: NetworkPack[];
    totalAnnual: number;
    totalQuarterly: number;
    totalMonthly: number;
    totalOneTime: number;
}
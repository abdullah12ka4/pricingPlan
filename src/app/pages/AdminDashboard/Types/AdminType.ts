export type TABLETYPE = {
  annualPrice: number,
  description: string,
  id?: string,
  maxStudents: number,
  minStudents: number,
  organisationType: 'SCHOOL' | 'RTO' | 'TAFE' | 'UNIVERSITY' | 'CORPORATE',
  planType: 'PREMIUM' | 'BASIC',
  status?: 'ACTIVE'
  storageGb: number
}

export type PricingFormData = {
  organizationType: TABLETYPE['organisationType'];
  plan?: TABLETYPE['planType'];
  tier?: string;
  networkId?: string
};

export type PricingPlan = {
  id: string;
  organisationType: TABLETYPE['organisationType'];
  planType: TABLETYPE['planType'];
  minStudents: number;
  maxStudents: number;
  annualPrice: string; // "3000.00"
  storageGb: number;
  // ... other fields you have
};

export interface AdminDashboardProps {
  onBack: (value: string) => void;
  data: any;
}

export type AdminView = 'dashboard' | 'pricing-tiers' | 'add-ons' | 'network-packs' | 'features' | 'sales-agents' | 'active-quotes' | 'analytics' | 'settings' | 'org-pricing';


export type addons = {
  description: string,
  id: string,
  isPremiumOnly: boolean;
  name: string,
  price: number,
  availablePlans: string[],
  billingFrequency: 'Annual' | 'Quarterly' | 'Monthly',
  category: 'AI & Automation' | "Storage & Infrastructure" | "Support & Services" | "Users & Access" | "Compliance & Security",
  pricingModel: "RECURRING" | "ONE_TIME" | "PACK_BASED" | "SEAT_BASED",
  status: "ACTIVE" | "INACTIVE",
}
export type NetworkType = {
  id: string,
  name: string,
  credits: number,
  pricePerCredit: number,
  description?: string,
  totalPrice: number,
  autoCalculate: boolean,
  services: ['Shared network access', 'Partner configuration', 'Document templates'],
  billingCycle: 'quarterly'
}

export type SalesAgentType = {
  id: string,
  name: string,
  email: string,
  role: string,
  phoneNumber: string | null,
  passwordHash?: string,
  activeQuotes: number,
  totalSales: number,
  conversionRate: number,
  status: string,
  lastLogin?: string,
  organization?: {
    name: string
  }

}



export interface AddOn {
  id: string;
  name: string;
  pricingModel: 'ONE_TIME' | 'RECURRING' | 'PER_STUDENT' | 'USAGE_BASED' | 'SEAT_BASED' | 'PACK_BASED';
  price: number;
  status: 'ACTIVE' | 'INACTIVE';
  description: string;
  category: string;
  billingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  availablePlans: TABLETYPE['planType'][];
}
export interface AddOnItem {
  addonId: string;
  quantity: number;
}

export interface cartItem {
  type: string,
  id: number,
  name: any,
  quantity: AddOnItem,
  price: number,
  billingCycle: string,
  isRecurring: boolean,

}


interface QuoteRequestBody {
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    organization: string;
  };
  tierId: string;
  networkPackageId: string | null;
  organizationId: string;          // you need to decide where this comes from
  organizationType: TABLETYPE['organisationType']; // 'SCHOOL' | etc
  planType: TABLETYPE['planType'];              // 'BASIC' | 'PREMIUM'
  studentCount: number;
  discountPercent: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validUntil: string;              // ISO date string
  internalNotes: string;
  clientNotes: string;
  notes: string;
  addonItems: {
    addonId: string;
    quantity: number;
  }[];
}

export type Plan = {
  id: string;
  organisationType: TABLETYPE['organisationType']; // note: matches API field
  planType: TABLETYPE['planType'];
  annualPrice: string;
  description: string;
};
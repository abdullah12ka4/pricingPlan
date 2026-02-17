// Core pricing system types

export type PlanType = 'BASIC' | 'PREMIUM';
export type OrganisationType = 'SCHOOL' | 'RTO' | 'TAFE' | 'UNIVERSITY' | 'CORPORATE';
export type BillingCycle = 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
export type AddOnPricingModel = 'ONE_TIME' | 'RECURRING' | 'PER_STUDENT' | 'USAGE_BASED' | 'PACK_BASED' | 'SEAT_BASED';
export type OverageEnforcement = 'auto-bill' | 'hard-limit' | 'warn-only';
export type SetupFeePolicy = 'new-customers' | 'always' | 'never';

export interface Feature {
  id: string;
  name: string;
  description: string;
  basicPlan: boolean | string;
  premiumPlan: boolean | string;
  category?: string;
}

export interface PricingTier {
  id: string;
  planType: PlanType;
  organisationType: OrganisationType;
  minStudents: number;
  maxStudents: number;
  storageGB: number;
  annualPrice: number;
  label?: string;
}

export interface SetupFee {
  amount: number;
  policy: SetupFeePolicy;
  includedServices: string[];
}

export interface OverageRule {
  enabled: boolean;
  ratePerStudent: number;
  enforcement: OverageEnforcement;
  graceThreshold: number;
  billingCycle: BillingCycle;
}

export interface ComplianceChecklistItem {
  id: string;
  label: string;
  required: boolean;
}

export interface AddOnCategory {
  id: string;
  name: string;
  description?: string;
}

export interface AddOnPricing {
  pricingModel: AddOnPricingModel;
  price: number;
  billingFrequency?: BillingCycle;
  pricePerStudent?: number;
  minStudents?: number;
  maxStudents?: number;
  unitLabel?: string;
  pricePerUnit?: number;
  freeQuota?: number;
  packQuantity?: number;
  packExpiry?: number;
  pricePerSeat?: number;
  maxSeats?: number;
}

export interface AddOnEligibility {
  plans: PlanType[];
  networkOnly: boolean;
  courseTypes?: string[];
  selfServe: boolean;
  requiresApproval: boolean;
}


export interface PackageVersion {
  id: string;
  version: number;
  createdAt: Date;
  createdBy: string;
  changes: string[];
  applyTo: 'new-only' | 'renewals' | 'existing';
}

export interface ChangeLogEntry {
  id: string;
  timestamp: Date;
  user: string;
  entity: string;
  entityId: string;
  action: 'create' | 'update' | 'delete' | 'publish';
  oldValue?: any;
  newValue?: any;
  version: number;
}

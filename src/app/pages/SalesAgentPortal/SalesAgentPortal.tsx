import { useState, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  ArrowLeft,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { OrganisationType, PlanType } from '@/app/types/pricing';
import { AddOnItem } from '../AdminDashboard/Types/AdminType';

// Components
import Dashboard from './Components/Dashboard';
import Step1 from './Components/Steps/Step1';
import Step2 from './Components/Steps/Step2';
import Step3 from './Components/Steps/Step3';
import Step4 from './Components/Steps/Step4';
import Step5 from './Components/Steps/Step5';
import Step6 from './Components/Steps/Step6';
import Step7 from './Components/Steps/Step7';

// Hooks & Redux
import { usePricing } from './Components/PricingContext';
import { useGetNetworkQuery } from '@/Redux/services/NetworkModal';
import { useGetAddOnsQuery } from '@/Redux/services/AddOns';
import { Spinner } from '@/app/components/ui/spinner';
import { useAddQuotesMutation } from '@/Redux/services/ActiveQuotes';
import { toast } from 'sonner';
import Step8 from './Components/Steps/Step8';
export interface SalesWizardForm {
  client: {
    name: string;
    email: string;
    phone: string;
    organization: string;
  };
  organizationId: string;
  organizationType: OrganisationType | null;
  plan: PlanType;
  tier: string | null;
  networkPack: string | null;
  addOns: AddOnItem[];
  discount: {
    type: 'percentage' | 'fixed';
    value: number;
    notes: string;
    requiresApproval: boolean;
  };
  selAddons?: AddOnItem[];
  unSelAddons?: AddOnItem[];
}

// ✅ Fixed broken template literal syntax
type WatchableField =
  | keyof SalesWizardForm
  | 'client.name'
  | 'client.email'
  | 'client.phone'
  | 'client.organization'
  | `addOns.${number}`
  | 'discount.value'
  | 'discount.notes'
  | 'discount.requiresApproval';
export type Step =
  | 'dashboard'
  | 'client-info'
  | 'org-type'
  | 'plan'
  | 'tier'
  | 'network'
  | 'addons'
  | 'discount'
  | 'review'

// === EXACT API PAYLOAD TYPE AS REQUESTED ===
interface QuoteRequestBody {
  clientInfo: {
    name: string;
    email: string;
    phone: string;
    organization: string;
  };
  tierId: string;
  networkPackageId: string | null;
  organizationType: OrganisationType;
  planType: PlanType;
  studentCount: number;
  discountPercent: number;
  discountReason: string
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validUntil: string;
  internalNotes?: string;
  clientNotes: string;
  notes: string;
  addonItems: {
    addonId: string;
    quantity: number;
  }[];
}

export function SalesAgentPortal({ onBack, user }: { onBack: (value: string) => void, user: any }) {
  const [view, setView] = useState(false)
  const [currentStep, setCurrentStep] = useState<Step>('dashboard');
  const [SelectedQuotes, setSelectedQuotes] = useState<string | null>(null)
  const [linkExpiry, setlinkExpiry] = useState(7)


  const Pricing = usePricing();

  // ✅ Fixed typo: netwrokCredit -> networkCredit
  const {
    data: networkCredit,
    isLoading: networkLoading,
    error: networkError,
  } = useGetNetworkQuery();

  const {
    data: addonData,
    isLoading: addonLoading,
    error: addOnError,
  } = useGetAddOnsQuery();

  const [addQuotes, { isLoading: addQuoteLoading }] = useAddQuotesMutation()

  // Global Loading & Error State
  const loading = networkLoading || addonLoading;
  const error = networkError || addOnError;

  // RHF Setup
  const methods = useForm<SalesWizardForm>({
    mode: 'onChange',
    defaultValues: {
      client: {
        name: '',
        email: '',
        organization: '',
        phone: '',
      },
      organizationId: '',
      organizationType: null,
      plan: 'BASIC',
      tier: null,
      networkPack: null,
      addOns: [],
      discount: {
        type: 'percentage',
        value: 0,
        notes: '',
        requiresApproval: false,
      },
    },
  });

  const { watch } = methods;

  // ✅ Added null safety defaults for all watched values
  const clientInfo = watch('client') ?? { name: '', email: '', phone: '', organization: '' };
  const selectedOrgType = watch('organizationType');
  const selectedPlan = watch('plan');
  const selectedTierId = watch('tier') ?? '';
  const networkPackageId = watch('networkPack');
  const selectedAddOns = watch('addOns') ?? [];
  const discount = watch('discount') ?? { type: 'percentage', value: 0, notes: '', requiresApproval: false };
  const selectedOrganizationId = watch('organizationId') ?? '';

  // Step Validation Logic
  const stepFields: Record<Step, WatchableField[]> = {
    'client-info': ['client.name', 'client.email', 'client.phone', 'client.organization'],
    'org-type': ['organizationType', 'organizationId'],
    plan: ['plan'],
    tier: ['tier'],
    network: ['networkPack'],
    addons: ['addOns'],
    discount: ['discount.value'],
    dashboard: [],
    review: []
  };

  // ✅ Improved validation logic with proper type checking
  const isStepValid =
    currentStep === 'dashboard'
      ? true
      : stepFields[currentStep].every((field) => {
        const value = watch(field as any);

        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'string') return value.trim().length > 0;

        return value !== undefined && value !== null;
      });
  type Tier = {
    id: string,
    maxStudents: number
  }
  // --- FIND SELECTED TIER DATA ---
  const tier = useMemo<Tier | undefined>(
    () => Pricing.find((t: Tier) => t.id === selectedTierId),
    [selectedTierId, Pricing]
  );

  // ==============================================
  // 🎯 MAIN SUBMIT HANDLER - Full safety checks
  // ==============================================
  const handleSubmitForm = async () => {
    // ✅ Full validation including organizationId
    if (!tier || !selectedOrgType || !selectedTierId || !selectedOrganizationId) {
      alert("⚠️ Missing required data! Please complete all steps.");
      return;
    }

    // Calculate link expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + linkExpiry);
    const validUntil = expiryDate.toISOString();

    // 🔨 Build final payload with full type safety
    const submissionPayload: QuoteRequestBody = {
      clientInfo: {
        name: clientInfo.name.trim(),
        email: clientInfo.email.trim(),
        phone: clientInfo.phone.trim(),
        organization: clientInfo.organization.trim(),
      },
      tierId: selectedTierId,
      networkPackageId: networkPackageId ?? null,
      organizationType: selectedOrgType, // Safe because we validated it above
      planType: selectedPlan,
      studentCount: tier.maxStudents,
      discountPercent: discount.type === "percentage" ? discount.value : 0,
      discountType: discount.type,
      discountValue: discount.value,
      validUntil,
      discountReason: discount.notes.trim() || "",
      clientNotes: "",
      notes: "",
      addonItems: selectedAddOns.map((item) => ({
        addonId: item.addonId,
        quantity: item.quantity || 1,
      })),
    };
    try {
      const response = await addQuotes(submissionPayload).unwrap()
      if (response.success) {
        toast.success("Quote Successfully Created")
        const next = getNextStep();
        if (next) setCurrentStep(next);
        setSelectedQuotes(response?.data?.id)
      }
    } catch (error) {
      console.error('Failed to load data', error)
    }

  }

  // --- NAVIGATION HANDLERS ---
  const getNextStep = (): Step | null => {
    const steps: Step[] = [
      'client-info',
      'org-type',
      'plan',
      'tier',
      'network',
      'addons',
      'discount',
      'review'
    ];
    const currentIndex = steps.indexOf(currentStep);
    return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
  };

  const getPreviousStep = (): Step | null => {
    const steps: Step[] = [
      'client-info',
      'org-type',
      'plan',
      'tier',
      'network',
      'addons',
      'discount',
      'review'
    ];
    const currentIndex = steps.indexOf(currentStep);
    return currentIndex > 0 ? steps[currentIndex - 1] : null;
  };

  const handleContinue = () => {
    // Special handling for discount step: submit instead of going to next step
    if (currentStep === "discount") {
      handleSubmitForm();
      return;
    }

    // Normal navigation for all other steps
    const next = getNextStep();
    if (next) setCurrentStep(next);
  };

  const stepTitles = {
    'client-info': 'Client Information',
    'org-type': 'Organisation Type',
    plan: 'Select Plan',
    tier: 'Choose Tier',
    network: 'Network Credits',
    addons: 'Add-ons',
    discount: 'Apply Discount',
    review: 'Review & Generate'
  };
  // --- RENDER PROGRESS BAR ---
  const renderProgressBar = () => {
    const steps: Step[] = [
      'client-info',
      'org-type',
      'plan',
      'tier',
      'network',
      'addons',
      'discount',
      'review'
    ];

    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex === -1) return null; // hide for dashboard/review

    const progress = ((currentIndex + 1) / steps.length) * 100;

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-600">
            Step {currentIndex + 1} of {steps.length}
          </div>
          <div className="text-sm text-[#044866]">
            {currentStep !== 'dashboard' ? stepTitles[currentStep] : null}
          </div>
        </div>

        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#044866] to-[#F7A619] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  // --- RENDER STEPS ---
  const renderStep = () => {
    switch (currentStep) {
      case 'dashboard':
        return <Dashboard setView={setView} id={user?.id} setCurrentStep={setCurrentStep} setSelectedQuotes={setSelectedQuotes} />;
      case 'client-info':
        return <Step1 />;
      case 'org-type':
        return <Step2 org={clientInfo.organization} data={Pricing} />;
      case 'plan':
        return <Step3 data={Pricing} />;
      case 'tier':
        return <Step4 data={Pricing} />;
      case 'network':
        return <Step5 data={networkCredit || []} />; // ✅ Fixed typo
      case 'addons':
        return <Step6 data={addonData || []} setCurrentStep={setCurrentStep} />;
      case 'discount':
        return <Step7 />;
      case 'review':
        return <Step8 id={SelectedQuotes} setexpiry={setlinkExpiry} currentStep={setCurrentStep} />
      default:
        return null;
    }
  };

  // --- MAIN RENDER ---
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-red-500 p-4 text-center">
        <div>
          <p className="font-bold">Error loading data</p>
          <p className="text-sm">
            {(error as { status?: number }).status || "Network Error"}: {(error as { error?: string }).error || "Failed to fetch data"}
          </p>
          <button onClick={() => onBack} className="mt-4 px-4 py-2 bg-gray-200 rounded">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#044866]/5 via-white to-[#F7A619]/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#044866] to-[#0D5468] border-b border-white/10 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {currentStep !== 'dashboard' &&  <button
                type="button"
                onClick={() => {
                  setCurrentStep('dashboard')
              }}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Dashboard</span>
            </button>}           



            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-sm text-white">Sales Agent Portal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {currentStep !== 'dashboard' && renderProgressBar()}

        <FormProvider {...methods}>
          <form>
            {renderStep()}

            {/* Navigation Buttons */}
            {currentStep !== 'dashboard' && (
              <div className="max-w-4xl mx-auto mt-10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const prev = getPreviousStep();
                    if (prev) setCurrentStep(prev);
                    else setCurrentStep('dashboard');
                  }}
                  className={`${view ? 'hidden' : 'block'} cursor-pointer px-6 py-3 border-2 border-[#044866]/20 text-[#044866] rounded-xl hover:border-[#044866] transition-all`}
                >
                  {currentStep === 'client-info'
                    ? 'Back to Dashboard'
                    : 'Previous Step'}
                </button>

                <button
                  type="button"
                  disabled={!isStepValid}
                  onClick={handleContinue}
                  className={`cursor-pointer px-8 py-3 bg-gradient-to-r from-[#044866] to-[#0D5468] text-white rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 ${currentStep === 'review' ? 'hidden' : 'block'}`}
                >
                  {currentStep === 'discount' ? addQuoteLoading ? 'Creating Quote...' : 'Create Quote' : 'Continue'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
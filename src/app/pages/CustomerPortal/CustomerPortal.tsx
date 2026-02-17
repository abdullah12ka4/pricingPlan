import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import Organization from './Components/Organization';
import Features from './Components/Features';
import PricingTier from './Components/PricingPlan';
import { NetworkPackSelector } from '@/app/components/pricing/NetworkPackSelector';
import Step6 from '../SalesAgentPortal/Components/Steps/Step6';
import { CheckoutSummary } from '@/app/components/pricing/CheckoutSummary';
import { usePricing } from '../SalesAgentPortal/Components/PricingContext';
import { Spinner } from '@/app/components/ui/spinner';
import { useAddQuotesMutation } from '@/Redux/services/ActiveQuotes';
import { useGetAddOnsQuery } from '@/Redux/services/AddOns';
import { useGetNetworkQuery } from '@/Redux/services/NetworkModal';

interface CustomerPricingProps {
  onBack: () => void;
  onCheckout: (summary: any) => void;
}

export function CustomerPortal({ onBack, onCheckout }: CustomerPricingProps) {
  const { data: networkCreditPacks, isLoading: networkLoading } = useGetNetworkQuery();
  const { data: addOnData, isLoading: addOnLoading } = useGetAddOnsQuery();

  const Pricing = usePricing();
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [addQuotes] = useAddQuotesMutation();

  const methods = useForm({ mode: 'onChange' });
  const { watch } = methods;
  const organizationId = watch('organizationId');
  const organizationType = watch('organizationType');
  const plan = watch('plan');
  const tier = watch('tier');
  const networkPack = watch('networkPack');
  const addOns = watch('addOns');

  const selectedTier = useMemo<any>(() => {
    if (!tier || !organizationType) return null;
    return Pricing.find(
      (p:any) => p.id === tier && p.organisationType === organizationType
    );
  }, [tier, organizationType, Pricing]);

  const selectedAddOns = useMemo(() => {
    if (!addOns || !addOnData) return [];
    return Object.entries(addOns)
      .map(([id, qty]: any) => {
        const addon = addOnData.find((a:any) => a.id === qty.addonId);
        if (!addon) return null;
        return { ...addon, quantity: qty.quantity };
      })
      .filter(Boolean);
  }, [addOns, addOnData]);

  const previewPayload = useMemo(() => {
    if (!organizationType || !tier || !networkPack || !selectedTier) return null;
    return {
      organizationType,
      planType: plan,
      tierId: tier,
      networkPackageId: networkPack,
      studentCount: selectedTier.maxStudents,
      addonItems: selectedAddOns.map(a => ({ addonId: a.id, quantity: a.quantity })),
      validUntil: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString() // 7 days from now
    };
  }, [organizationId, organizationType, plan, tier, networkPack, selectedAddOns]);

  console.log(previewPayload)
  useEffect(() => {
    if (!previewPayload) return;

    const createQuote = async () => {
      try {
        setLoading(true);
        const result = await addQuotes(previewPayload).unwrap();
        setCheckoutData({ ...result, organization_id: organizationId });
      } catch (err) {
        console.error('Error creating quote:', err);
      } finally {
        setLoading(false);
      }
    };

    createQuote();
  }, [previewPayload, organizationId, addQuotes]);

  const handleCheckout = () => {
    if (checkoutData) onCheckout(checkoutData);
  };

  const isLoading = loading || networkLoading || addOnLoading;
  if (isLoading) return <div className="flex h-screen items-center justify-center"><Spinner /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#044866]/5 via-white to-[#F7A619]/5">
      <div className="bg-white/80 backdrop-blur-sm border-b border-[#044866]/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 py-3.5">
          <button onClick={onBack} className="flex items-center gap-2 text-[#044866] hover:text-[#0D5468] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-7">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F7A619]/10 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#F7A619]" />
            <span className="text-xs text-[#044866]">Flexible Pricing Plans</span>
          </div>
          <h1 className="text-3xl mb-2.5 text-[#044866]">Choose Your SkilTrak Plan</h1>
          <p className="text-base text-gray-600">Complete CRM solution for managing work-based learning placements</p>
        </div>

        <FormProvider {...methods}>
          <form>
            <Organization data={Pricing} />
            <Features />

            {organizationId && <div className="bg-white rounded-xl border border-[#044866]/10 p-5 mb-7 shadow-sm"><PricingTier data={Pricing} /></div>}

            {plan && networkCreditPacks && (
              <div className="bg-white rounded-xl border border-[#044866]/10 p-5 mb-7 shadow-sm">
                <NetworkPackSelector packs={networkCreditPacks} />
              </div>
            )}

            {networkPack && addOnData && <Step6 data={addOnData} />}

            {checkoutData && (
              <div className="lg:fixed lg:top-20 lg:right-8 lg:w-80">
                <CheckoutSummary summary={checkoutData.data} onCheckout={handleCheckout} />
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
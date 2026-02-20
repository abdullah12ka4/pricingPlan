import { useState, useEffect, useMemo, useRef } from 'react';
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
import { useAddQuotesMutation, useGenerateLinkMutation, useGetQuotesQuery, useGetSpecificQuotesQuery, useUpdateQuotesMutation } from '@/Redux/services/ActiveQuotes';
import { useGetAddOnsQuery } from '@/Redux/services/AddOns';
import { useGetNetworkQuery } from '@/Redux/services/NetworkModal';
import { useGetSubscriptionByOrgQuery } from '@/Redux/services/Subscription';


interface CustomerPricingProps {
  onBack: () => void;
  onCheckout: (summary: any) => void;
  agent?: any;
  setAddOns: (selectedAddOns: any[]) => void;
  unselAddon: (unselectedAddOns: any[]) => void;
}

export function CustomerPortal({ onBack, onCheckout, agent, setAddOns, unselAddon }: CustomerPricingProps) {
  const initializedRef = useRef(false);
  const { data: networkCreditPacks, isLoading: networkLoading } = useGetNetworkQuery();
  const { data: addOnData, isLoading: addOnLoading } = useGetAddOnsQuery();
  const { data: quotesData, isLoading: quotesLoading } = useGetQuotesQuery({ agentId: agent?.id });
  const { data: specificQuotesData, refetch, isLoading: specificQuotesLoading } = useGetSpecificQuotesQuery(quotesData?.data.quotes[0]?.id, {
    skip: !quotesData?.data.quotes[0]?.id // Only fetch when quote ID exists
  });
  const { data: subscriptionData, isLoading: subscriptionLoading, error: subscriptionError } = useGetSubscriptionByOrgQuery(agent?.organizationId)


  const memoExistingAddOns = useMemo(() => {
    if (!subscriptionData?.[0]?.addons) return [];

    return subscriptionData[0].addons.map((addon: any) => ({
      addonId: addon.addonId || addon.id,
      quantity: addon.quantity,
    }));
  }, [subscriptionData]);

  const [addQuotes] = useAddQuotesMutation();
  const [updateQuotes] = useUpdateQuotesMutation();

  const Pricing = usePricing();


  const [loading, setLoading] = useState(false);

  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      organizationId: agent?.organizationId,
      organizationType: '',
      plan: '',
      tier: '',
      networkPack: '',
      addOns: [],
    },
  });
  const { watch, reset } = methods;
  useEffect(() => {
    if (!subscriptionData?.[0]) return;
    reset((prev) => ({
      ...prev,
      addOns: subscriptionData[0].addons?.map((addon: any) => ({
        addonId: addon.addonId || addon.id,
        quantity: addon.quantity,
      })) ?? [],
    }));
  }, [subscriptionData]);
  const organizationId = watch('organizationId');
  const organizationType = watch('organizationType');
  const plan = watch('plan');
  const tier = watch('tier');
  const networkPack = watch('networkPack');
  const addOns = watch('addOns');


  const selectedTier = useMemo<any>(() => {
    if (!tier || !organizationType) return null;
    return Pricing.find(
      (p: any) => p.id === tier && p.organisationType === organizationType
    );
  }, [tier, organizationType, Pricing]);

  const selectedAddOns = useMemo(() => {
    if (!addOns || !addOnData) return [];
    return Object.entries(addOns)
      .map(([id, qty]: any) => {
        const addon = addOnData.find((a: any) => a.id === qty.addonId);
        if (!addon) return null;
        return { ...addon, quantity: qty.quantity };
      })
      .filter(Boolean);
  }, [addOns, addOnData]);

  const previewPayload = useMemo(() => {
    if (!organizationType || !tier || !networkPack || !selectedTier) return null;
    return {
      clientInfo: {
        name: agent?.name || '',
        email: agent?.email || '',
        phone: agent?.phoneNumber || '',
        organization: agent?.organization?.name || '',
      },
      organizationType,
      planType: plan,
      tierId: tier,
      organizationId: agent?.organizationId,
      networkPackageId: networkPack,
      studentCount: selectedTier.maxStudents,
      addonItems: selectedAddOns.map(a => ({ addonId: a.id, quantity: a.quantity })),
      validUntil: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString() // 7 days from now
    };
  }, [organizationId, organizationType, plan, tier, networkPack, selectedAddOns]);

  const prevPayloadRef = useRef<string | null>(null);
  useEffect(() => {
    if (!previewPayload) return;
    // 🔥 Skip first run caused by form initialization
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }

    const serialized = JSON.stringify(previewPayload);
    if (serialized === prevPayloadRef.current) return; // ✅ skip if nothing changed
    prevPayloadRef.current = serialized;

    const createQuote = async () => {
      try {
        setLoading(true);
        if (specificQuotesData?.data) {
          await updateQuotes({
            id: specificQuotesData?.data.id,
            body: previewPayload
          }).unwrap();
          await refetch();
        } else {
          await addQuotes(previewPayload).unwrap();
        }

        setAddOns(selectedAddOns.map(a => a.id));
      } catch (err) {
        console.error('Error creating quote:', err);
      } finally {
        setLoading(false);
      }
    };

    createQuote();
  }, [previewPayload]);

  const handleCheckout = () => {
    if (!specificQuotesData) return null;
    onCheckout(specificQuotesData?.data);
  };
  const isLoading = loading || networkLoading || addOnLoading || quotesLoading || specificQuotesLoading || subscriptionLoading;
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

            <div className="bg-white rounded-xl border border-[#044866]/10 p-5 mb-7 shadow-sm"><PricingTier data={Pricing} /></div>

            {plan && networkCreditPacks && (
              <div className="bg-white rounded-xl border border-[#044866]/10 p-5 mb-7 shadow-sm">
                <NetworkPackSelector packs={networkCreditPacks} />
              </div>
            )}

            {networkPack && addOnData && <Step6 data={addOnData} existingAddOn={memoExistingAddOns} />}

            {specificQuotesData?.data && networkPack && (
              <div className="lg:fixed lg:top-20 lg:right-8 lg:w-80">
                <CheckoutSummary summary={specificQuotesData?.data} onCheckout={handleCheckout} />
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
import {
  useAddQuotesMutation,
  useGetQuotesQuery,
  useGetSpecificQuotesQuery,
  useUpdateQuotesMutation,
} from '@/Redux/services/ActiveQuotes';
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

export function CustomerPortal({
  onBack,
  onCheckout,
  agent,
  setAddOns,
  unselAddon,
}: CustomerPricingProps) {
  const { data: networkCreditPacks, isLoading: networkLoading } = useGetNetworkQuery();
  const { data: addOnData, isLoading: addOnLoading } = useGetAddOnsQuery();
  const { data: quotesData, isLoading: quotesLoading } = useGetQuotesQuery({ agentId: agent?.id });
  const {
    data: specificQuotesData,
    refetch,
    isLoading: specificQuotesLoading,
  } = useGetSpecificQuotesQuery(quotesData?.data.quotes[0]?.id, {
    skip: !quotesData?.data.quotes[0]?.id,
  });
  const {
    data: subscriptionData,
    isLoading: subscriptionLoading,
  } = useGetSubscriptionByOrgQuery(agent?.organizationId);

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
      addOns: [] as any[],
      selAddons: [] as any[],
      unSelAddons: [] as any[],
    },
  });

  /**
   * ─── EXISTING SUBSCRIPTION ADDONS ────────────────────────────────────────
   * These are the BASELINE from the server. They NEVER change during the
   * session — they represent what the user had BEFORE opening this page.
   * We freeze them into a ref on first load so re-fetches cannot overwrite them.
   */
  const baselineAddonsRef = useRef<{ addonId: string; quantity: number }[] | null>(null);

  const existingSubscriptionAddons = useMemo(() => {
    if (!subscriptionData?.[0]?.addons) return [];
    return subscriptionData[0].addons.map((addon: any) => ({
      addonId: addon.addonId || addon.id,
      quantity: addon.quantity,
    }));
  }, [subscriptionData]);

  /**
   * ─── PRELOAD GUARD ────────────────────────────────────────────────────────
   * addonPreloadDone: set to true ONCE after existing addons are written into
   * the form. Diffs (added/removed) are frozen at [] until this is true.
   * Using a ref for the "did we fire" guard so re-renders don't reset it.
   */
  const preloadFiredRef = useRef(false);
  const [addonPreloadDone, setAddonPreloadDone] = useState(false);

  useEffect(() => {
    // Wait until subscription query has resolved (loading = false)
    if (subscriptionLoading) return;
    // Only run once
    if (preloadFiredRef.current) return;
    preloadFiredRef.current = true;

    if (existingSubscriptionAddons.length > 0) {
      // Freeze the baseline — this ref is the ground truth for diffs
      baselineAddonsRef.current = existingSubscriptionAddons;
      methods.setValue('addOns', existingSubscriptionAddons, { shouldValidate: false });
    } else {
      // New customer — no baseline
      baselineAddonsRef.current = [];
    }

    // Let the form state settle before diffs start
    setTimeout(() => setAddonPreloadDone(true), 0);
  // existingSubscriptionAddons intentionally excluded — we only want this to
  // run once after subscriptionLoading flips to false
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionLoading]);

  const { watch } = methods;
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

  // Resolve full addon objects from the addOns form array
  const selectedAddOns = useMemo(() => {
    if (!addOns?.length || !addOnData) return [];
    return addOns
      .map((qty: any) => {
        const addon = addOnData.find((a: any) => a.id === qty.addonId);
        if (!addon) return null;
        return { ...addon, quantity: qty.quantity };
      })
      .filter(Boolean);
  }, [addOns, addOnData]);

  /**
   * ─── DIFF COMPUTATION ────────────────────────────────────────────────────
   * Both diffs use baselineAddonsRef (frozen at load time) NOT the live
   * subscriptionData — so re-fetches from updateQuotes never corrupt them.
   *
   * Guard: return [] until addonPreloadDone = true.
   */
  const currentAddonIdSet = useMemo(
    () => new Set(addOns.map((a: any) => a.addonId)),
    [addOns]
  );

  const baselineAddonIdSet = useMemo(() => {
    if (!baselineAddonsRef.current) return new Set<string>();
    return new Set(baselineAddonsRef.current.map((a) => a.addonId));
  }, [addonPreloadDone]); // re-derive only after preload done

  // Addons the user ADDED (not in baseline)
  const addedAddonIds = useMemo(() => {
    if (!addonPreloadDone) return [];
    return addOns
      .filter((a: any) => !baselineAddonIdSet.has(a.addonId))
      .map((a: any) => a.addonId);
  }, [addOns, baselineAddonIdSet, addonPreloadDone]);

  // Addons the user REMOVED (were in baseline, no longer selected)
  const removedAddonIds = useMemo(() => {
    if (!addonPreloadDone) return [];
    if (!baselineAddonsRef.current) return [];
    return baselineAddonsRef.current
      .filter((a) => !currentAddonIdSet.has(a.addonId))
      .map((a) => a.addonId);
  }, [currentAddonIdSet, addonPreloadDone]);

  /**
   * ─── QUOTE CREATION ──────────────────────────────────────────────────────
   */
  const selectedAddOnsJsonRef = useRef<string>('');
  const selectedAddOnsJson = JSON.stringify(
    selectedAddOns.map((a: any) => ({ id: a.id, quantity: a.quantity }))
  );
  if (selectedAddOnsJson !== selectedAddOnsJsonRef.current) {
    selectedAddOnsJsonRef.current = selectedAddOnsJson;
  }

  const previewPayload = useMemo(() => {
    if (!organizationType || !tier || !networkPack || !selectedTier) return null;

    const addonItems = JSON.parse(selectedAddOnsJsonRef.current || '[]').map(
      (a: any) => ({ addonId: a.id, quantity: a.quantity })
    );

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
      addonItems,
      validUntil: new Date(
        new Date().setDate(new Date().getDate() + 7)
      ).toISOString(),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationType, plan, tier, networkPack, selectedTier, selectedAddOnsJsonRef.current]);

  const prevPayloadRef = useRef<string | null>(null);

  useEffect(() => {
    if (!previewPayload) return;

    const serialized = JSON.stringify(previewPayload);
    if (serialized === prevPayloadRef.current) return;
    prevPayloadRef.current = serialized;

    const createQuote = async () => {
      try {
        setLoading(true);
        if (specificQuotesData?.data) {
          await updateQuotes({
            id: specificQuotesData.data.id,
            body: previewPayload,
          }).unwrap();
          await refetch();
        } else {
          await addQuotes(previewPayload).unwrap();
        }
      } catch (err) {
        console.error('Error creating/updating quote:', err);
      } finally {
        setLoading(false);
      }
    };

    createQuote();
  }, [previewPayload]);

  /**
   * ─── SYNC PARENT ─────────────────────────────────────────────────────────
   * Only fire after preload is done — prevents stale diffs on mount.
   */
  useEffect(() => {
    if (!addonPreloadDone) return;
    setAddOns(addedAddonIds);
  }, [addedAddonIds, addonPreloadDone]);

  useEffect(() => {
    if (!addonPreloadDone) return;
    unselAddon(removedAddonIds);
  }, [removedAddonIds, addonPreloadDone]);

  const handleCheckout = () => {
    if (!specificQuotesData) return null;
    onCheckout(specificQuotesData?.data);
  };

  const isLoading =
    loading ||
    networkLoading ||
    addOnLoading ||
    quotesLoading ||
    specificQuotesLoading ||
    subscriptionLoading;

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#044866]/5 via-white to-[#F7A619]/5">
      <div className="bg-white/80 backdrop-blur-sm border-b border-[#044866]/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 py-3.5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#044866] hover:text-[#0D5468] transition-colors"
          >
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
          <p className="text-base text-gray-600">
            Complete CRM solution for managing work-based learning placements
          </p>
        </div>

        <FormProvider {...methods}>
          <form>
            <Organization data={Pricing} />
            <Features />

            <div className="bg-white rounded-xl border border-[#044866]/10 p-5 mb-7 shadow-sm">
              <PricingTier data={Pricing} />
            </div>

            {plan && networkCreditPacks && (
              <div className="bg-white rounded-xl border border-[#044866]/10 p-5 mb-7 shadow-sm">
                <NetworkPackSelector packs={networkCreditPacks} />
              </div>
            )}

            {networkPack && addOnData && (
              <Step6
                data={addOnData}
                existingAddOn={baselineAddonsRef.current ?? []}
              />
            )}

            {specificQuotesData?.data && networkPack && (
              <div className="lg:fixed lg:top-20 lg:right-8 lg:w-80">
                <CheckoutSummary
                  summary={specificQuotesData.data}
                  onCheckout={handleCheckout}
                />
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
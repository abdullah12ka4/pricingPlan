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

/** Debounce helper — returns a stable debounced version of `fn`. */
function useDebounceCallback<T extends (...args: any[]) => any>(fn: T, delay: number): T {
  const fnRef = useRef(fn);
  fnRef.current = fn; // always up-to-date without recreating the debounced wrapper

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fnRef.current(...args);
      }, delay);
    },
    [delay]
  ) as T;
}

export function CustomerPortal({
  onBack,
  onCheckout,
  agent,
  setAddOns,
  unselAddon,
}: CustomerPricingProps) {
  // ─── DATA FETCHING ────────────────────────────────────────────────────────
  const { data: networkCreditPacks, isLoading: networkLoading } = useGetNetworkQuery();
  const { data: addOnData, isLoading: addOnLoading } = useGetAddOnsQuery();
  const { data: quotesData, isLoading: quotesLoading } = useGetQuotesQuery({ agentId: agent?.id });

  const firstQuoteId = quotesData?.data.quotes[0]?.id;

  const {
    data: specificQuotesData,
    refetch,
    isLoading: specificQuotesLoading,
  } = useGetSpecificQuotesQuery(firstQuoteId, { skip: !firstQuoteId });

  const { data: subscriptionData, isLoading: subscriptionLoading } =
    useGetSubscriptionByOrgQuery(agent?.organizationId);

  const [addQuotes] = useAddQuotesMutation();
  const [updateQuotes] = useUpdateQuotesMutation();

  const Pricing = usePricing();
  const [quoteLoading, setQuoteLoading] = useState(false);

  // ─── FORM ─────────────────────────────────────────────────────────────────
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      organizationId: agent?.organizationId,
      organizationType: '',
      plan: '',
      tier: '',
      networkPack: '',
      addOns: [] as any[],
    },
  });

  const { watch, setValue } = methods;
  const organizationType = watch('organizationType');
  const plan = watch('plan');
  const tier = watch('tier');
  const networkPack = watch('networkPack');
  const addOns = watch('addOns');

  // ─── BASELINE (frozen on first load) ─────────────────────────────────────
  /**
   * baselineAddonsRef: the server state BEFORE the user touched anything.
   * Never updated after initial load — diffs are always against this snapshot.
   */
  const baselineAddonsRef = useRef<{ addonId: string; quantity: number }[] | null>(null);
  const preloadFiredRef = useRef(false);
  const [addonPreloadDone, setAddonPreloadDone] = useState(false);

  useEffect(() => {
    if (subscriptionLoading || preloadFiredRef.current) return;
    preloadFiredRef.current = true;

    const baseline =
      subscriptionData?.[0]?.addons?.map((addon: any) => ({
        addonId: addon.addonId ?? addon.id,
        quantity: addon.quantity,
      })) ?? [];

    baselineAddonsRef.current = baseline;

    if (baseline.length > 0) {
      setValue('addOns', baseline, { shouldValidate: false });
    }

    // Let form state settle before diffs start
    setTimeout(() => setAddonPreloadDone(true), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionLoading]);

  // ─── SELECTED TIER ────────────────────────────────────────────────────────
  const selectedTier = useMemo<any>(() => {
    if (!tier || !organizationType) return null;
    return Pricing.find((p: any) => p.id === tier && p.organisationType === organizationType);
  }, [tier, organizationType, Pricing]);

  // ─── FULL ADDON OBJECTS ───────────────────────────────────────────────────
  const selectedAddOns = useMemo(() => {
    if (!addOns?.length || !addOnData) return [];
    return addOns
      .map((qty: any) => {
        const addon = addOnData.find((a: any) => a.id === qty.addonId);
        return addon ? { ...addon, quantity: qty.quantity } : null;
      })
      .filter(Boolean);
  }, [addOns, addOnData]);

  // ─── DIFFS (added / removed vs baseline) ─────────────────────────────────
  const currentAddonIdSet = useMemo(() => new Set(addOns.map((a: any) => a.addonId)), [addOns]);

  const baselineAddonIdSet = useMemo(() => {
    if (!baselineAddonsRef.current) return new Set<string>();
    return new Set(baselineAddonsRef.current.map((a) => a.addonId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addonPreloadDone]);

  const addedAddonIds = useMemo(() => {
    if (!addonPreloadDone) return [];
    return addOns.filter((a: any) => !baselineAddonIdSet.has(a.addonId)).map((a: any) => a.addonId);
  }, [addOns, baselineAddonIdSet, addonPreloadDone]);

  const removedAddonIds = useMemo(() => {
    if (!addonPreloadDone || !baselineAddonsRef.current) return [];
    return baselineAddonsRef.current
      .filter((a) => !currentAddonIdSet.has(a.addonId))
      .map((a) => a.addonId);
  }, [currentAddonIdSet, addonPreloadDone]);

  // ─── QUOTE UPSERT (debounced) ─────────────────────────────────────────────
  /**
   * Build the payload inside the callback so we never form stale closures.
   * Debounced at 600 ms — selections won't fire a network request until the
   * user pauses, eliminating the "heavy / irritating" rapid-fire requests.
   */
  const prevPayloadRef = useRef<string | null>(null);
  const specificQuotesDataRef = useRef(specificQuotesData);
  specificQuotesDataRef.current = specificQuotesData;

  const upsertQuote = useCallback(async () => {
    if (!organizationType || !tier || !networkPack || !selectedTier) return;

    const addonItems = selectedAddOns.map((a: any) => ({ addonId: a.id, quantity: a.quantity }));

    const payload = {
      clientInfo: {
        name: agent?.name ?? '',
        email: agent?.email ?? '',
        phone: agent?.phoneNumber ?? '',
        organization: agent?.organization?.name ?? '',
      },
      organizationType,
      planType: plan,
      tierId: tier,
      organizationId: agent?.organizationId,
      networkPackageId: networkPack,
      studentCount: selectedTier.maxStudents,
      addonItems,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const serialized = JSON.stringify(payload);
    if (serialized === prevPayloadRef.current) return; // nothing changed
    prevPayloadRef.current = serialized;
    console.log("QUOTE PAYLOAD", payload)

    try {
      setQuoteLoading(true);
      const existing = specificQuotesDataRef.current?.data;
      if (existing) {
       const res =  await updateQuotes({ id: existing.id, body: payload }).unwrap();
       console.log("UPDATE QUOTES", res)
       await refetch();
      } else {
       const res = await addQuotes(payload).unwrap();
       console.log("ADD QUOTE", res)
      }
    } catch (err) {
      console.error('Error creating/updating quote:', err);
    } finally {
      setQuoteLoading(false);
    }
  }, [
    organizationType,
    plan,
    tier,
    networkPack,
    selectedTier,
    selectedAddOns,
    agent,
    addQuotes,
    updateQuotes,
    refetch,
  ]);

  const debouncedUpsertQuote = useDebounceCallback(upsertQuote, 600);

  useEffect(() => {
    debouncedUpsertQuote();
  }, [debouncedUpsertQuote, organizationType, plan, tier, networkPack, selectedAddOns]);

  // ─── SYNC PARENT ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!addonPreloadDone) return;
    setAddOns(addedAddonIds);
  }, [addedAddonIds, addonPreloadDone, setAddOns]);

  useEffect(() => {
    if (!addonPreloadDone) return;
    unselAddon(removedAddonIds);
  }, [removedAddonIds, addonPreloadDone, unselAddon]);

  // ─── CHECKOUT ─────────────────────────────────────────────────────────────
  const handleCheckout = useCallback(() => {
    if (!specificQuotesData?.data) return;
    onCheckout(specificQuotesData.data);
  }, [specificQuotesData, onCheckout]);

  // ─── LOADING GATE ─────────────────────────────────────────────────────────
  const isLoading =
    quoteLoading ||
    networkLoading ||
    addOnLoading ||
    quotesLoading ||
    specificQuotesLoading ||
    subscriptionLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // ─── RENDER ───────────────────────────────────────────────────────────────
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
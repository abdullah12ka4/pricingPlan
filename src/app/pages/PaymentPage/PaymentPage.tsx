import { useEffect, useState } from 'react';
import { ArrowLeft, CreditCard, Building, Lock, Check, AlertCircle, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { useAddOrganizationMutation, useUpdateOrganizationMutation } from '@/Redux/services/Organization';
import { useAddSubscriptionMutation, useDowngradeSubscriptionMutation, useGetSubscriptionByOrgQuery, useUpdateSubscriptionMutation, useUpgradeSubscriptionMutation } from '@/Redux/services/Subscription';
import { usePaymentIntentMutation } from '@/Redux/services/Payment';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'your_publishable_key_here');

interface PaymentPageProps {
  summary: any;
  onBack: () => void;
  onComplete: () => void;
  agent: any;
  agentRefetch: () => void;
  /**
   * selAddon — addon IDs that are NEWLY ADDED (not in existing subscription).
   * Used as additional_addon_ids in upgradeSubscription payload.
   */
  selAddon: any[];
  /**
   * unselAddon — addon IDs that were REMOVED from the existing subscription.
   * Used as remove_addon_ids in downgradeSubscription payload.
   */
  unselAddon?: any[];
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      color: '#374151',
      '::placeholder': { color: '#9CA3AF' },
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    invalid: { color: '#EF4444' },
  },
};

function PaymentForm({ summary, onBack, onComplete, agent, agentRefetch, selAddon, unselAddon }: PaymentPageProps) {
  const stripe = useStripe();
  const elements = useElements();

  const { data: subscriptionData } = useGetSubscriptionByOrgQuery(agent?.organizationId);
  const [addOrganization] = useAddOrganizationMutation();
  const [updateOrganization] = useUpdateOrganizationMutation();
  const [upgradeSubscription] = useUpgradeSubscriptionMutation();
  const [downgradeSubscription] = useDowngradeSubscriptionMutation();
  const [updateSubscription] = useUpdateSubscriptionMutation();
  const [addSubscription] = useAddSubscriptionMutation();
  const [paymentIntent] = usePaymentIntentMutation();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer'>('card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [cardErrors, setCardErrors] = useState({ cardNumber: '', cardExpiry: '', cardCvc: '' });
  // ✅ Track completion so we can show success screen inside this component
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionType, setCompletionType] = useState<'new' | 'upgrade' | 'downgrade'>('new');

  const existingOrganization = agent?.organization;

  const [billingInfo, setBillingInfo] = useState({
    name: existingOrganization?.name || '',
    type: existingOrganization?.type || summary?.organization_type || '',
    abnAcn: existingOrganization?.abnAcn || '',
    contactEmail: existingOrganization?.contactEmail || '',
    contactPhone: existingOrganization?.contactPhone || '',
    addressLine1: existingOrganization?.addressLine1 || '',
    city: existingOrganization?.city || '',
    state: existingOrganization?.state || '',
    postalCode: existingOrganization?.postalCode || '',
    billingEmail: existingOrganization?.billingEmail || '',
    primaryContactName: existingOrganization?.primaryContactName || '',
  });

  /**
   * ✅ Determine upgrade vs downgrade based on pricing tier comparison.
   * isUpgrade: new plan costs MORE than existing → upgradeSubscription API
   * isDowngrade: new plan costs LESS → downgradeSubscription API
   *
   * Additional logic:
   * - If selAddon has entries → user added new addons (goes to additional_addon_ids)
   * - If unselAddon has entries → user removed addons (goes to remove_addon_ids)
   * - Both can happen simultaneously (e.g. user swaps addons during upgrade)
   */
  const existingTotal = subscriptionData?.length > 0
    ? parseFloat(subscriptionData[0]?.tier?.annualPrice ?? '0') +
      parseFloat(
        subscriptionData[0]?.addons?.reduce(
          (acc: number, addon: any) => acc + addon.unitPrice * addon.quantity,
          0
        ) ?? '0'
      )
    : 0;

  const newTotal = summary?.totals?.subtotal ?? 0;
  const hasExistingSubscription = subscriptionData && subscriptionData.length > 0;

  /**
   * isUpgrade: plan cost went up OR new addons were added
   * isDowngrade: plan cost went down OR addons were removed (and nothing added)
   */
  const isUpgrade = hasExistingSubscription && (
    newTotal >= existingTotal || (selAddon && selAddon.length > 0)
  );
  const isDowngrade = hasExistingSubscription && !isUpgrade;

  console.log('selAddon (newly added):', selAddon);
  console.log('unselAddon (removed):', unselAddon);
  console.log('isUpgrade:', isUpgrade, '| isDowngrade:', isDowngrade);

  useEffect(() => {
    if (!elements) return;
    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    cardNumberElement?.on('change', (event) => {
      setCardErrors(prev => ({ ...prev, cardNumber: event.error?.message ?? '' }));
    });
    cardExpiryElement?.on('change', (event) => {
      setCardErrors(prev => ({ ...prev, cardExpiry: event.error?.message ?? '' }));
    });
    cardCvcElement?.on('change', (event) => {
      setCardErrors(prev => ({ ...prev, cardCvc: event.error?.message ?? '' }));
    });
  }, [elements]);

  const handleOrganization = async () => {
    try {
      if (existingOrganization?.id) {
        await updateOrganization({ id: existingOrganization.id, payload: billingInfo }).unwrap();
      } else {
        await addOrganization(billingInfo).unwrap();
      }
      agentRefetch();
    } catch (err: any) {
      console.error('Organization error:', err);
      throw new Error('Failed to save organization details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }
    if (!billingInfo.name || !billingInfo.abnAcn || !billingInfo.primaryContactName ||
      !billingInfo.billingEmail || !billingInfo.contactPhone || !billingInfo.addressLine1 ||
      !billingInfo.city || !billingInfo.state || !billingInfo.postalCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Save/Update organization
      await handleOrganization();

      let stripePaymentMethodId = '';

      // Step 2: Card payment for new subscriptions.
      // NOTE: For upgrades, card is confirmed AFTER upgradeSubscription returns client_secret.
      // So we skip the upfront paymentIntent call for upgrades — handled in the upgrade block.
      if (paymentMethod === 'card' && !hasExistingSubscription) {
        if (!stripe || !elements) throw new Error('Stripe not loaded');
        const cardNumberElement = elements.getElement(CardNumberElement);
        if (!cardNumberElement) throw new Error('Card not found');

        const response = await paymentIntent({ quoteId: summary?.id }).unwrap();

        const { error, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
          response.client_secret,
          {
            payment_method: {
              card: cardNumberElement,
              billing_details: {
                name: cardholderName,
                email: billingInfo.billingEmail,
              },
            },
          }
        );

        if (error) throw new Error(error.message);
        if (confirmedIntent?.status !== 'succeeded') throw new Error('Payment failed');

        stripePaymentMethodId = response.payment_id;
      }

      // ─── UPGRADE ────────────────────────────────────────────────────────────
      if (isUpgrade && hasExistingSubscription) {
        const upgradePayload = {
          new_pricing_tier_id: summary?.pricing_tier?.id,
          new_plan_type: summary?.plan_type,
          additional_addon_ids: selAddon ?? [],
          effective_date: 'immediate',
        };
        console.log('upgradePayload:', upgradePayload);

        const upgradeRes = await upgradeSubscription({
          id: subscriptionData[0]?.id,
          payload: upgradePayload,
        }).unwrap();
        console.log('upgradeRes:', upgradeRes);

        /**
         * ✅ API returns status: "pending_payment" when Stripe charge is needed.
         * Use the client_secret from the response to confirm card payment.
         * If status is already "active", skip Stripe and go straight to success.
         */
        if (upgradeRes?.data?.status === 'pending_payment' && upgradeRes?.data?.client_secret) {
          if (!stripe || !elements) throw new Error('Stripe not loaded');

          const cardNumberElement = elements.getElement(CardNumberElement);
          if (!cardNumberElement) throw new Error('Card element not found. Please use card payment method.');

          const { error, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
            upgradeRes.data.client_secret,
            {
              payment_method: {
                card: cardNumberElement,
                billing_details: {
                  name: cardholderName,
                  email: billingInfo.billingEmail,
                },
              },
            }
          );

          if (error) throw new Error(error.message ?? 'Upgrade payment failed');
          if (confirmedIntent?.status !== 'succeeded') throw new Error('Upgrade payment was not completed');
        }

        // ✅ Payment confirmed (or no payment required) — show success screen
        setCompletionType('upgrade');
        setIsCompleted(true);
        agentRefetch();

      // ─── DOWNGRADE ──────────────────────────────────────────────────────────
      } else if (isDowngrade && hasExistingSubscription) {
        const downgradePayload = {
          new_pricing_tier_id: summary?.pricing_tier?.id,
          new_plan_type: summary?.plan_type,
          remove_addon_ids: unselAddon ?? [],
          reason: 'Plan downgrade',
        };
        console.log('downgradePayload:', downgradePayload);
        await downgradeSubscription({
          id: subscriptionData[0]?.id,
          payload: downgradePayload,
        }).unwrap();
        setCompletionType('downgrade');
        setIsCompleted(true);
        agentRefetch();

      // ─── NEW SUBSCRIPTION ───────────────────────────────────────────────────
      } else {
        const subscriptionPayload: any = {
          organization_id: agent?.organization?.id || existingOrganization?.id,
          quote_id: summary?.id,
          plan_type: summary?.plan_type,
          start_date: summary?.created_at,
          pricing_tier_id: summary?.pricing_tier?.id,
          network_package_id: summary?.network_package?.id,
          /**
           * ✅ For new subscriptions, selAddon holds ALL selected addon IDs.
           */
          addon_ids: selAddon ?? [],
          billing_cycle: 'annual',
          auto_renew: true,
          payment_method: paymentMethod,
          payment_details: {
            stripe_payment_method_id: paymentMethod === 'card' ? stripePaymentMethodId : '',
          },
        };
        console.log('newSubscriptionPayload:', subscriptionPayload);
        const res = await addSubscription(subscriptionPayload).unwrap();
        console.log('addSubscription response:', res);
        if (res?.success) {
          setCompletionType('new');
          setIsCompleted(true);
          agentRefetch();
        }
      }
    } catch (err: any) {
      console.error('Payment error:', err);

      let errorMessage = 'Something went wrong. Please try again.';
      let errorDescription: string | undefined;

      if (err.message) errorMessage = err.message;
      if (err.data?.message) errorMessage = err.data.message;
      if (err.data?.errors) {
        errorDescription = Object.values(err.data.errors).flat().join(', ');
      }

      toast.error(errorMessage, { description: errorDescription });
    } finally {
      setIsProcessing(false);
    }
  };


  // ─── SUCCESS SCREEN ────────────────────────────────────────────────────────
  if (isCompleted) {
    const isUpgradeComplete = completionType === 'upgrade';
    const isDowngradeComplete = completionType === 'downgrade';

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#044866]/5 via-white to-[#F7A619]/5 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Animated success card */}
          <div className="bg-white rounded-2xl shadow-xl border border-[#044866]/10 overflow-hidden">
            {/* Top accent bar */}
            <div className={`h-1.5 w-full ${isUpgradeComplete ? 'bg-gradient-to-r from-green-400 to-emerald-500' : isDowngradeComplete ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-[#044866] to-[#0D5468]'}`} />

            <div className="p-8 text-center">
              {/* Icon */}
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${isUpgradeComplete ? 'bg-green-100' : isDowngradeComplete ? 'bg-amber-100' : 'bg-[#044866]/10'}`}>
                <CheckCircle2 className={`w-10 h-10 ${isUpgradeComplete ? 'text-green-600' : isDowngradeComplete ? 'text-amber-600' : 'text-[#044866]'}`} />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-[#044866] mb-2">
                {isUpgradeComplete ? 'Plan Upgraded!' : isDowngradeComplete ? 'Plan Updated!' : 'Payment Successful!'}
              </h1>

              {/* Subtitle */}
              <p className="text-gray-500 text-sm mb-6">
                {isUpgradeComplete
                  ? 'Your subscription has been upgraded successfully. Changes are effective immediately.'
                  : isDowngradeComplete
                  ? 'Your subscription has been updated. Changes will take effect at the next billing cycle.'
                  : 'Your subscription is now active. Welcome aboard!'}
              </p>

              {/* Summary box */}
              <div className={`rounded-xl p-4 mb-6 text-left border ${isUpgradeComplete ? 'bg-green-50 border-green-200' : isDowngradeComplete ? 'bg-amber-50 border-amber-200' : 'bg-[#044866]/5 border-[#044866]/20'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className={`w-4 h-4 ${isUpgradeComplete ? 'text-green-600' : isDowngradeComplete ? 'text-amber-600' : 'text-[#044866]'}`} />
                  <span className="text-sm font-semibold text-[#044866]">
                    {isUpgradeComplete ? 'Upgrade Summary' : isDowngradeComplete ? 'Plan Change Summary' : 'Subscription Summary'}
                  </span>
                </div>
                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Plan</span>
                    <span className="font-medium">CRM {summary?.plan_type === 'BASIC' ? 'Basic' : 'Premium'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tier</span>
                    <span className="font-medium">{summary?.pricing_tier?.name}</span>
                  </div>
                  {summary?.network_package && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Network Pack</span>
                      <span className="font-medium">{summary.network_package.name}</span>
                    </div>
                  )}
                  {(isUpgradeComplete || isDowngradeComplete) ? (
                    <div className="flex justify-between pt-1 border-t border-gray-200 mt-1">
                      <span className="text-gray-500">Status</span>
                      <span className={`font-semibold ${isUpgradeComplete ? 'text-green-600' : 'text-amber-600'}`}>
                        {isUpgradeComplete ? '✓ Active (Immediate)' : '✓ Scheduled'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between pt-1 border-t border-gray-200 mt-1">
                      <span className="text-gray-500">Amount Charged</span>
                      <span className="font-semibold text-[#044866]">${summary?.totals?.total_amount}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* What happens next */}
              <div className="text-left mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">What happens next</p>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2 text-xs text-gray-600">
                    <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                    A confirmation email has been sent to {agent?.email}
                  </li>
                  {!isUpgradeComplete && !isDowngradeComplete && (
                    <li className="flex items-start gap-2 text-xs text-gray-600">
                      <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                      Payment receipt will arrive within a few minutes
                    </li>
                  )}
                  <li className="flex items-start gap-2 text-xs text-gray-600">
                    <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                    Your dashboard now reflects the updated plan
                  </li>
                </ul>
              </div>

              {/* CTA button */}
              <button
                onClick={() => {
                  const messages = {
                    upgrade: { title: 'Plan upgraded successfully! ⬆️', desc: 'Your new plan is active immediately.' },
                    downgrade: { title: 'Plan updated successfully!', desc: 'Changes take effect at your next billing cycle.' },
                    new: { title: 'Payment completed successfully! 🎉', desc: 'Your package has been activated.' },
                  };
                  const msg = messages[completionType];
                  toast.success(msg.title, { description: msg.desc });
                  onComplete();
                }}
                className={`w-full py-3 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg ${isUpgradeComplete ? 'bg-gradient-to-r from-green-500 to-emerald-600' : isDowngradeComplete ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-[#044866] to-[#0D5468]'}`}
              >
                <RefreshCw className="w-4 h-4" />
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#044866]/5 via-white to-[#F7A619]/5">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-[#044866]/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 py-3.5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#044866] hover:text-[#0D5468] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Pricing</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-7">
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#044866]/10 rounded-full mb-3">
            <Lock className="w-3.5 h-3.5 text-[#044866]" />
            <span className="text-xs text-[#044866]">Secure Checkout</span>
          </div>
          <h1 className="text-3xl mb-2.5 text-[#044866]">Complete Your Purchase</h1>
          <p className="text-base text-gray-600">You're one step away from transforming your training management</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-5">
              {/* Billing Information */}
              <div className="bg-white border border-[#044866]/10 rounded-xl p-5 shadow-sm">
                <h2 className="text-lg text-[#044866] mb-4">Billing Information</h2>
                <div className="grid md:grid-cols-2 gap-3.5">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1.5">Organisation Name *</label>
                    <input type="text" required value={billingInfo.name}
                      onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}
                      className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                      placeholder="Your training organisation name" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">ABN *</label>
                    <input type="text" required value={billingInfo.abnAcn}
                      onChange={(e) => setBillingInfo({ ...billingInfo, abnAcn: e.target.value })}
                      className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                      placeholder="12 345 678 901" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Contact Name *</label>
                    <input type="text" required value={billingInfo.primaryContactName}
                      onChange={(e) => setBillingInfo({ ...billingInfo, primaryContactName: e.target.value })}
                      className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                      placeholder="Full name" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Email *</label>
                    <input type="email" required value={billingInfo.billingEmail}
                      onChange={(e) => setBillingInfo({ ...billingInfo, billingEmail: e.target.value, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                      placeholder="contact@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Phone *</label>
                    <input type="tel" required value={billingInfo.contactPhone}
                      onChange={(e) => setBillingInfo({ ...billingInfo, contactPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                      placeholder="04XX XXX XXX" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1.5">Street Address *</label>
                    <input type="text" required value={billingInfo.addressLine1}
                      onChange={(e) => setBillingInfo({ ...billingInfo, addressLine1: e.target.value })}
                      className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                      placeholder="123 Main Street" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">City *</label>
                    <input type="text" required value={billingInfo.city}
                      onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                      className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                      placeholder="Sydney" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">State *</label>
                    <select required value={billingInfo.state}
                      onChange={(e) => setBillingInfo({ ...billingInfo, state: e.target.value })}
                      className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20">
                      <option value="">Select State</option>
                      <option value="NSW">NSW</option>
                      <option value="VIC">VIC</option>
                      <option value="QLD">QLD</option>
                      <option value="WA">WA</option>
                      <option value="SA">SA</option>
                      <option value="TAS">TAS</option>
                      <option value="ACT">ACT</option>
                      <option value="NT">NT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Postcode *</label>
                    <input type="text" required value={billingInfo.postalCode}
                      onChange={(e) => setBillingInfo({ ...billingInfo, postalCode: e.target.value })}
                      className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                      placeholder="2000" />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white border border-[#044866]/10 rounded-xl p-5 shadow-sm">
                <h2 className="text-lg text-[#044866] mb-4">Payment Method</h2>
                <div className="grid md:grid-cols-2 gap-3 mb-5">
                  <button type="button" onClick={() => setPaymentMethod('card')} disabled={isProcessing}
                    className={`p-3.5 border-2 rounded-lg text-left transition-all ${paymentMethod === 'card' ? 'border-[#044866] bg-[#044866]/5' : 'border-gray-200 hover:border-[#044866]/30'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-[#044866]" />
                      <span className="text-sm text-[#044866]">Credit/Debit Card</span>
                      {paymentMethod === 'card' && <Check className="w-4 h-4 text-[#044866] ml-auto" />}
                    </div>
                    <p className="text-xs text-gray-600">Pay securely with your card</p>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('bank_transfer')} disabled={isProcessing}
                    className={`p-3.5 border-2 rounded-lg text-left transition-all ${paymentMethod === 'bank_transfer' ? 'border-[#044866] bg-[#044866]/5' : 'border-gray-200 hover:border-[#044866]/30'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Building className="w-4 h-4 text-[#044866]" />
                      <span className="text-sm text-[#044866]">Bank Transfer</span>
                      {paymentMethod === 'bank_transfer' && <Check className="w-4 h-4 text-[#044866] ml-auto" />}
                    </div>
                    <p className="text-xs text-gray-600">Invoice sent after order</p>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="pt-4 border-t border-gray-100 space-y-3.5">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1.5">Cardholder Name *</label>
                      <input type="text" required value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                        placeholder="Name as it appears on card" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1.5">Card Number *</label>
                      <div className={`w-full px-3 py-2 border rounded-lg transition-all ${cardErrors.cardNumber ? 'border-red-300 focus-within:ring-2 focus-within:ring-red-200' : 'border-[#044866]/20 focus-within:ring-2 focus-within:ring-[#044866]/20'}`}>
                        <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
                      </div>
                      {cardErrors.cardNumber && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{cardErrors.cardNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1.5">Expiry Date *</label>
                        <div className={`w-full px-3 py-2 border rounded-lg transition-all ${cardErrors.cardExpiry ? 'border-red-300 focus-within:ring-2 focus-within:ring-red-200' : 'border-[#044866]/20 focus-within:ring-2 focus-within:ring-[#044866]/20'}`}>
                          <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
                        </div>
                        {cardErrors.cardExpiry && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{cardErrors.cardExpiry}</p>}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1.5">CVC *</label>
                        <div className={`w-full px-3 py-2 border rounded-lg transition-all ${cardErrors.cardCvc ? 'border-red-300 focus-within:ring-2 focus-within:ring-red-200' : 'border-[#044866]/20 focus-within:ring-2 focus-within:ring-[#044866]/20'}`}>
                          <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                        </div>
                        {cardErrors.cardCvc && <p className="text-xs text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{cardErrors.cardCvc}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Your payment is secured by Stripe</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank_transfer' && (
                  <div className="p-3.5 bg-[#044866]/5 rounded-lg border border-[#044866]/10">
                    <div className="flex gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-[#044866] mt-0.5" />
                      <div>
                        <p className="text-sm text-[#044866] mb-1">Bank Transfer Instructions</p>
                        <p className="text-xs text-gray-600">
                          {isUpgrade
                            ? 'An invoice will be sent to your email. Your plan upgrade will activate once payment is received.'
                            : 'You will receive an invoice with our bank details via email. Your subscription will be activated once payment is received (usually 1-2 business days).'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="bg-white border border-[#044866]/10 rounded-xl p-5 shadow-sm">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#044866]" required />
                  <div className="text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-[#044866] hover:text-[#0D5468] underline">Terms and Conditions</a>{' '}
                    and{' '}
                    <a href="#" className="text-[#044866] hover:text-[#0D5468] underline">Privacy Policy</a>.
                    I understand that my subscription will renew automatically unless cancelled.
                  </div>
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-[#044866]/10 rounded-xl p-5 shadow-lg sticky top-20">
                <h3 className="text-base text-[#044866] mb-4">Order Summary</h3>

                {/* Subscription change badge */}
                {hasExistingSubscription && (
                  <div className={`mb-4 px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${isUpgrade ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                    {isUpgrade ? '⬆ Upgrading your subscription' : '⬇ Downgrading your subscription'}
                  </div>
                )}

                <div className="space-y-3.5 mb-5">
                  <div className="pb-3.5 border-b border-gray-100">
                    <div className="text-sm text-[#044866] mb-1">
                      CRM {summary?.plan_type === 'BASIC' ? 'Basic' : 'Premium'}
                    </div>
                    <div className="text-xs text-gray-600 mb-2">{summary?.pricing_tier?.min_max_gb}</div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Annual License</span>
                      <span className="text-[#044866]">${summary?.pricing_tier?.annual_price}</span>
                    </div>
                  </div>

                  {summary?.setupFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Setup Fee</span>
                      <span className="text-[#044866]">${summary?.setupFee?.toLocaleString()}</span>
                    </div>
                  )}

                  {summary?.network_package && (
                    <div className="pb-3.5 border-b border-gray-100">
                      <div className="text-sm text-[#044866] mb-1">{summary.network_package.name} Credits</div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Quarterly</span>
                        <span className="text-[#044866]">${summary.network_package.total_cost?.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  {summary?.items?.length > 0 && (
                    <div className="pb-3.5 border-b border-gray-100">
                      <div className="text-xs text-gray-600 mb-2">Add-ons</div>
                      {summary.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-xs mb-1.5">
                          <span className="text-gray-600 flex items-center gap-1">
                            {item.name}
                            {/* ✅ Badge: new vs existing vs removed */}
                            {selAddon?.includes(item.id) && (
                              <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">New</span>
                            )}
                            {unselAddon?.includes(item.id) && (
                              <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">Removed</span>
                            )}
                          </span>
                          <span className="text-[#044866]">${item.total_price}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-5 pb-5 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Due Today</span>
                    <span className="text-[#044866]">${summary?.totals?.one_time_total}</span>
                  </div>
                  {summary?.totals?.annual_total > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Annual (from Year 2)</span>
                      <span className="text-[#044866]">${summary?.totals?.annual_total}</span>
                    </div>
                  )}
                  {summary?.totals?.quarterly_total > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Per Quarter</span>
                      <span className="text-[#044866]">${summary?.totals?.quarterly_total}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-5">
                  <span className="text-base text-[#044866]">Total Due Today</span>
                  <span className="text-2xl text-[#044866]">${summary?.totals?.total_amount}</span>
                </div>

                <button type="submit" disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-[#044866] to-[#0D5468] text-white py-2.5 rounded-lg hover:shadow-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      {hasExistingSubscription
                        ? isUpgrade ? 'Confirm Upgrade' : 'Confirm Downgrade'
                        : paymentMethod === 'card' ? 'Complete Purchase' : 'Place Order'}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1 mt-3">
                  <Lock className="w-3 h-3 text-gray-500" />
                  <p className="text-xs text-gray-500">Secure 256-bit SSL encrypted payment</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PaymentPage(props: PaymentPageProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}
import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, CreditCard, Building, Lock, Check, AlertCircle } from 'lucide-react';
import { useAddOrganizationMutation, useUpdateOrganizationMutation } from '@/Redux/services/Organization';
import { useAddSubscriptionMutation, useDowngradeSubscriptionMutation, useGetSubscriptionByOrgQuery, useGetSubscriptionQuery, useUpdateSubscriptionMutation, useUpgradeSubscriptionMutation } from '@/Redux/services/Subscription';
import { usePaymentIntentMutation } from '@/Redux/services/Payment';
import { useCreataInvoiceMutation } from '@/Redux/services/Invoice';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'sonner'; // Import toast from sonner

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'your_publishable_key_here');

interface PaymentPageProps {
  summary: any;
  onBack: () => void;
  onComplete: () => void;
  agent: any;
  agentRefetch: () => void;
  selAddon: any;
  unselAddon?: any;
}

// Stripe card input styling
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '14px',
      color: '#374151',
      '::placeholder': {
        color: '#9CA3AF',
      },
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    invalid: {
      color: '#EF4444',
    },
  },
};

function PaymentForm({ summary, onBack, onComplete, agent, agentRefetch, selAddon, unselAddon }: PaymentPageProps) {
  const paymentIntentCallCount = useRef(0);
  const stripe = useStripe();
  const elements = useElements();
  const { data: subscriptionData, isLoading: subscriptionLoading, error: subscriptionError } = useGetSubscriptionByOrgQuery(agent?.organizationId)
  const [addOrganization] = useAddOrganizationMutation();
  const [updateOrganization] = useUpdateOrganizationMutation();
  const [upgradeSubscription] = useUpgradeSubscriptionMutation();
  const [downgradeSubscription] = useDowngradeSubscriptionMutation();
  const [updateSubscription] = useUpdateSubscriptionMutation();
  const [addSubscription] = useAddSubscriptionMutation();
  const [paymentIntent] = usePaymentIntentMutation();
  const [createInvoice] = useCreataInvoiceMutation();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [cardErrors, setCardErrors] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });
  const existingOrganization = agent?.organization;

  console.log('subscriptionData', subscriptionData)

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

  useEffect(() => {
    if (!elements) return;
    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);
    const cardCvcElement = elements.getElement(CardCvcElement);

    if (cardNumberElement) {
      cardNumberElement.on('change', (event) => {
        setCardErrors(prev => ({
          ...prev,
          cardNumber: event.error ? event.error.message : ''
        }));
      });
    }

    if (cardExpiryElement) {
      cardExpiryElement.on('change', (event) => {
        setCardErrors(prev => ({
          ...prev,
          cardExpiry: event.error ? event.error.message : ''
        }));
      });
    }

    if (cardCvcElement) {
      cardCvcElement.on('change', (event) => {
        setCardErrors(prev => ({
          ...prev,
          cardCvc: event.error ? event.error.message : ''
        }));
      });
    }
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

  const getStripeErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      'card_declined': 'Your card was declined. Please try a different card.',
      'expired_card': 'Your card has expired. Please use a different card.',
      'incorrect_cvc': 'The security code (CVC) is incorrect. Please check and try again.',
      'incorrect_number': 'The card number is incorrect. Please check and try again.',
      'insufficient_funds': 'Your card has insufficient funds. Please use a different card.',
      'invalid_expiry_month': 'The expiration month is invalid. Please check and try again.',
      'invalid_expiry_year': 'The expiration year is invalid. Please check and try again.',
      'invalid_number': 'The card number is invalid. Please check and try again.',
      'processing_error': 'An error occurred while processing your card. Please try again.',
      'rate_limit': 'Too many requests. Please wait a moment and try again.',
      'authentication_required': 'Your card requires authentication. Please try again.',
      'payment_intent_authentication_failure': 'Card authentication failed. Please try a different card.',
    };

    return errorMessages[errorCode] || 'Payment failed. Please check your card details and try again.';
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

      // Check if subscription already exists
      const hasExistingSubscription = subscriptionData && subscriptionData.length > 0;

      // Step 2: Handle payment based on method ONLY if it's a NEW subscription
      if (!hasExistingSubscription && paymentMethod === 'card') {
        if (!stripe || !elements) {
          throw new Error('Stripe has not loaded yet');
        }

        if (cardErrors.cardNumber || cardErrors.cardExpiry || cardErrors.cardCvc) {
          toast.error('Please fix card details errors before submitting');
          setIsProcessing(false);
          return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);
        if (!cardNumberElement) {
          throw new Error('Card details not found');
        }
        paymentIntentCallCount.current += 1;

        const startTime = performance.now();
        console.log("🔥 paymentIntent called:", paymentIntentCallCount.current);

        const response = await paymentIntent({ quoteId: summary?.id }).unwrap();

        const endTime = performance.now();
        console.log("⏱ paymentIntent time:", (endTime - startTime).toFixed(2), "ms");

        console.log("✅ paymentIntent response:", response);

        if (!response?.client_secret) {
          toast.dismiss('payment-processing');
          throw new Error('Failed to initialize payment');
        }

        const secret = response.client_secret;
        const paymentId = response.payment_id;

        toast.loading('Processing payment...', { id: 'payment-processing' });

        const { error: stripeError, paymentIntent: confirmedIntent } =
          await stripe.confirmCardPayment(secret, {
            payment_method: {
              card: cardNumberElement,
              billing_details: {
                name: cardholderName,
                email: billingInfo.billingEmail,
                phone: billingInfo.contactPhone,
                address: {
                  line1: billingInfo.addressLine1,
                  city: billingInfo.city,
                  state: billingInfo.state,
                  postal_code: billingInfo.postalCode,
                  country: 'AU',
                },
              },
            },
          });

        toast.dismiss('payment-processing');

        if (stripeError) {
          toast.error(stripeError.message || 'Payment failed');
          setIsProcessing(false);
          return;
        }

        if (confirmedIntent?.status !== 'succeeded') {
          toast.error('Payment not successful.');
          setIsProcessing(false);
          return;
        }

        stripePaymentMethodId = paymentId;
      } else {
        const subscriptionPayload = {
          organization_id: agent?.organization?.id || existingOrganization?.id,
          quote_id: summary?.id,
          plan_type: summary?.plan_type,
          pricing_tier_id: summary?.pricing_tier?.id,
          network_package_id: summary?.network_package?.id,
          addon_ids: selAddon || [],
          start_date: summary?.created_at || new Date().toISOString(),
          billing_cycle: 'annual',
          auto_renew: true,
          payment_method: paymentMethod,
          payment_details: paymentMethod === 'card' ? {
            stripe_payment_method_id: stripePaymentMethodId,
          } : {},
        };

        const subscriptionResponse = await addSubscription(subscriptionPayload).unwrap();
        console.log('Subscription Created:', subscriptionResponse);

        toast.success('Payment processed successfully!', {
          description: 'Your subscription is now active.'
          // CREATE new subscription

        })
      }
      onComplete();    
  } catch (err: any) {
    console.error('Payment error:', err);

    let errorMessage = 'Something went wrong. Please try again.';
    let errorDescription = undefined;

    if (err.message) {
      errorMessage = err.message;
    }

    if (err.data?.message) {
      errorMessage = err.data.message;
    }

    if (err.data?.errors) {
      errorDescription = Object.values(err.data.errors).flat().join(', ');
    }

    toast.error(errorMessage, {
      description: errorDescription,
    });
  } finally {
    setIsProcessing(false);
  }
};
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
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-5">
            {/* Billing Information */}
            <div className="bg-white border border-[#044866]/10 rounded-xl p-5 shadow-sm">
              <h2 className="text-lg text-[#044866] mb-4">Billing Information</h2>

              <div className="grid md:grid-cols-2 gap-3.5">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-1.5">Organisation Name *</label>
                  <input
                    type="text"
                    required
                    value={billingInfo.name}
                    onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}
                    className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                    placeholder="Your training organisation name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">ABN *</label>
                  <input
                    type="text"
                    required
                    value={billingInfo.abnAcn}
                    onChange={(e) => setBillingInfo({ ...billingInfo, abnAcn: e.target.value })}
                    className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                    placeholder="12 345 678 901"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={billingInfo.primaryContactName}
                    onChange={(e) => setBillingInfo({ ...billingInfo, primaryContactName: e.target.value })}
                    className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={billingInfo.billingEmail}
                    onChange={(e) => setBillingInfo({ ...billingInfo, billingEmail: e.target.value, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                    placeholder="contact@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={billingInfo.contactPhone}
                    onChange={(e) => setBillingInfo({ ...billingInfo, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                    placeholder="04XX XXX XXX"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-1.5">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={billingInfo.addressLine1}
                    onChange={(e) => setBillingInfo({ ...billingInfo, addressLine1: e.target.value })}
                    className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">City *</label>
                  <input
                    type="text"
                    required
                    value={billingInfo.city}
                    onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                    className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                    placeholder="Sydney"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">State *</label>
                  <select
                    required
                    value={billingInfo.state}
                    onChange={(e) => setBillingInfo({ ...billingInfo, state: e.target.value })}
                    className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                  >
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
                  <input
                    type="text"
                    required
                    value={billingInfo.postalCode}
                    onChange={(e) => setBillingInfo({ ...billingInfo, postalCode: e.target.value })}
                    className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                    placeholder="2000"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-[#044866]/10 rounded-xl p-5 shadow-sm">
              <h2 className="text-lg text-[#044866] mb-4">Payment Method</h2>

              <div className="grid md:grid-cols-2 gap-3 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    if (paymentMethod !== 'card') {
                      console.log('🔄 Switched to card payment');
                      setPaymentMethod('card');
                    }
                  }}
                  disabled={isProcessing}
                  className={`p-3.5 border-2 rounded-lg text-left transition-all ${paymentMethod === 'card'
                    ? 'border-[#044866] bg-[#044866]/5'
                    : 'border-gray-200 hover:border-[#044866]/30'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-[#044866]" />
                    <span className="text-sm text-[#044866]">Credit/Debit Card</span>
                    {paymentMethod === 'card' && <Check className="w-4 h-4 text-[#044866] ml-auto" />}
                  </div>
                  <p className="text-xs text-gray-600">Pay securely with your card</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (paymentMethod !== 'bank') {
                      setPaymentMethod('bank');
                    }
                  }}
                  disabled={isProcessing}
                  className={`p-3.5 border-2 rounded-lg text-left transition-all ${paymentMethod === 'bank'
                    ? 'border-[#044866] bg-[#044866]/5'
                    : 'border-gray-200 hover:border-[#044866]/30'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Building className="w-4 h-4 text-[#044866]" />
                    <span className="text-sm text-[#044866]">Bank Transfer</span>
                    {paymentMethod === 'bank' && <Check className="w-4 h-4 text-[#044866] ml-auto" />}
                  </div>
                  <p className="text-xs text-gray-600">Invoice sent after order</p>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="pt-4 border-t border-gray-100 space-y-3.5">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Cardholder Name *</label>
                    <input
                      type="text"
                      required
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                      placeholder="Name as it appears on card"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Card Number *</label>
                    <div className={`w-full px-3 py-2 border rounded-lg transition-all ${cardErrors.cardNumber
                      ? 'border-red-300 focus-within:ring-2 focus-within:ring-red-200'
                      : 'border-[#044866]/20 focus-within:ring-2 focus-within:ring-[#044866]/20'
                      }`}>
                      <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
                    </div>
                    {cardErrors.cardNumber && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {cardErrors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1.5">Expiry Date *</label>
                      <div className={`w-full px-3 py-2 border rounded-lg transition-all ${cardErrors.cardExpiry
                        ? 'border-red-300 focus-within:ring-2 focus-within:ring-red-200'
                        : 'border-[#044866]/20 focus-within:ring-2 focus-within:ring-[#044866]/20'
                        }`}>
                        <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
                      </div>
                      {cardErrors.cardExpiry && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {cardErrors.cardExpiry}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1.5">CVC *</label>
                      <div className={`w-full px-3 py-2 border rounded-lg transition-all ${cardErrors.cardCvc
                        ? 'border-red-300 focus-within:ring-2 focus-within:ring-red-200'
                        : 'border-[#044866]/20 focus-within:ring-2 focus-within:ring-[#044866]/20'
                        }`}>
                        <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                      </div>
                      {cardErrors.cardCvc && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {cardErrors.cardCvc}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Your payment is secured by Stripe</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div className="p-3.5 bg-[#044866]/5 rounded-lg border border-[#044866]/10">
                  <div className="flex gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-[#044866] mt-0.5" />
                    <div>
                      <p className="text-sm text-[#044866] mb-1">Bank Transfer Instructions</p>
                      <p className="text-xs text-gray-600">
                        You will receive an invoice with our bank details via email. Your subscription will be
                        activated once payment is received (usually 1-2 business days).
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="bg-white border border-[#044866]/10 rounded-xl p-5 shadow-sm">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#044866]"
                  required
                />
                <div className="text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-[#044866] hover:text-[#0D5468] underline">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[#044866] hover:text-[#0D5468] underline">
                    Privacy Policy
                  </a>
                  . I understand that my subscription will renew automatically unless cancelled.
                </div>
              </label>
            </div>
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-[#044866]/10 rounded-xl p-5 shadow-lg sticky top-20">
              <h3 className="text-base text-[#044866] mb-4">Order Summary</h3>

              <div className="space-y-3.5 mb-5">
                {/* Plan */}
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

                {/* Setup Fee */}
                {summary?.setupFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Setup Fee</span>
                    <span className="text-[#044866]">${summary?.setupFee?.toLocaleString()}</span>
                  </div>
                )}

                {/* Network Pack */}
                {summary?.network_package && (
                  <div className="pb-3.5 border-b border-gray-100">
                    <div className="text-sm text-[#044866] mb-1">
                      {summary.network_package.name} Credits
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Quarterly</span>
                      <span className="text-[#044866]">
                        ${summary.network_package.total_cost?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Add-ons */}
                {summary?.items?.length > 0 && (
                  <div className="pb-3.5 border-b border-gray-100">
                    <div className="text-xs text-gray-600 mb-2">Add-ons</div>
                    {summary.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="text-[#044866]">${item.total_price}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totals */}
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

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-[#044866] to-[#0D5468] text-white py-2.5 rounded-lg hover:shadow-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    {paymentMethod === 'card' ? 'Complete Purchase' : 'Place Order'}
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

// Main export with Stripe Elements wrapper
export function PaymentPage(props: PaymentPageProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}
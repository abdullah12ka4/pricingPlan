import { useState } from 'react';
import { ArrowLeft, CreditCard, Building, Lock, Check, AlertCircle } from 'lucide-react';
import { useAddOrganizationMutation } from '@/Redux/services/Organization';

interface PaymentPageProps {
  summary: any;
  onBack: () => void;
  onComplete: () => void;
}

export function PaymentPage({ summary, onBack, onComplete }: PaymentPageProps) {  
  const [addOrganization] = useAddOrganizationMutation()
  console.log("Summary on Payment Page", summary)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [billingInfo, setBillingInfo] = useState({
    name: summary.tier.description || '',
    type: '',
    abnAcn: '',
    contactName: summary.profile.name || '',
    contactEmail: summary.profile.email || '',
    contactPhone: summary.profile.phoneNumber || '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: ''
  });

  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  const OrganizationHandle = async()=>{
    console.log('Payload is', billingInfo)
  
    const res = await addOrganization(billingInfo).unwrap()
    console.log(res)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    OrganizationHandle()    
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      alert('Payment processed successfully! Welcome to SkilTrak.');
      onComplete();
    }, 2000);
  };

  const grandTotal = summary.totalOneTime + summary.totalAnnual;

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

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-5">
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
                    value={billingInfo.organisationName}
                    onChange={(e) => setBillingInfo({ ...billingInfo, organisationName: e.target.value })}
                    className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                    placeholder="Your training organisation name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">ABN *</label>
                  <input
                    type="text"
                    required
                    value={billingInfo.abn}
                    onChange={(e) => setBillingInfo({ ...billingInfo, abn: e.target.value })}
                    className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                    placeholder="12 345 678 901"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={billingInfo.contactName}
                    onChange={(e) => setBillingInfo({ ...billingInfo, contactName: e.target.value })}
                    className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                    placeholder="Full name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={billingInfo.email}
                    onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                    className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                    placeholder="contact@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={billingInfo.phone}
                    onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                    placeholder="04XX XXX XXX"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-1.5">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={billingInfo.address}
                    onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
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
                    value={billingInfo.postcode}
                    onChange={(e) => setBillingInfo({ ...billingInfo, postcode: e.target.value })}
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
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3.5 border-2 rounded-lg text-left transition-all ${paymentMethod === 'card'
                      ? 'border-[#044866] bg-[#044866]/5'
                      : 'border-gray-200 hover:border-[#044866]/30'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-[#044866]" />
                    <span className="text-sm text-[#044866]">Credit/Debit Card</span>
                    {paymentMethod === 'card' && (
                      <Check className="w-4 h-4 text-[#044866] ml-auto" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600">Pay securely with your card</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-3.5 border-2 rounded-lg text-left transition-all ${paymentMethod === 'bank'
                      ? 'border-[#044866] bg-[#044866]/5'
                      : 'border-gray-200 hover:border-[#044866]/30'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Building className="w-4 h-4 text-[#044866]" />
                    <span className="text-sm text-[#044866]">Bank Transfer</span>
                    {paymentMethod === 'bank' && (
                      <Check className="w-4 h-4 text-[#044866] ml-auto" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600">Invoice sent after order</p>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="grid md:grid-cols-2 gap-3.5 pt-4 border-t border-gray-100">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1.5">Card Number *</label>
                    <input
                      type="text"
                      required
                      value={cardInfo.cardNumber}
                      onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1.5">Cardholder Name *</label>
                    <input
                      type="text"
                      required
                      value={cardInfo.cardName}
                      onChange={(e) => setCardInfo({ ...cardInfo, cardName: e.target.value })}
                      className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                      placeholder="Name as it appears on card"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">Expiry Date *</label>
                    <input
                      type="text"
                      required
                      value={cardInfo.expiry}
                      onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                      className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1.5">CVV *</label>
                    <input
                      type="text"
                      required
                      value={cardInfo.cvv}
                      onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                      className="w-full px-3 py-2 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                      placeholder="123"
                      maxLength={4}
                    />
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
                        You will receive an invoice with our bank details via email. Your subscription will be activated once payment is received (usually 1-2 business days).
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
                    CRM {summary.selectedPlan === 'basic' ? 'Basic' : 'Premium'}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {summary.selectedOrgType} · {summary.tier.minStudents === 0 ? 'Up to' : `${summary.tier.minStudents.toLocaleString()} -`} {summary.tier.maxStudents.toLocaleString()} students
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Annual License</span>
                    <span className="text-[#044866]">${summary.tier.annualPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Setup Fee */}
                {summary.setupFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Setup Fee</span>
                    <span className="text-[#044866]">${summary.setupFee.toLocaleString()}</span>
                  </div>
                )}

                {/* Network Pack */}
                {summary.networkPack && (
                  <div className="pb-3.5 border-b border-gray-100">
                    <div className="text-sm text-[#044866] mb-1">
                      {summary.networkPack.name} Credits
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Quarterly</span>
                      <span className="text-[#044866]">${summary.networkPack.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                {/* Add-ons */}
                {summary.addOns.length > 0 && (
                  <div className="pb-3.5 border-b border-gray-100">
                    <div className="text-xs text-gray-600 mb-2">Add-ons</div>
                    {summary.addOns.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="text-[#044866]">${item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-5 pb-5 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Due Today</span>
                  <span className="text-[#044866]">${summary.totalOneTime.toLocaleString()}</span>
                </div>
                {summary.totalAnnual > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Annual (from Year 2)</span>
                    <span className="text-[#044866]">${summary.totalAnnual.toLocaleString()}</span>
                  </div>
                )}
                {summary.totalQuarterly > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Per Quarter</span>
                    <span className="text-[#044866]">${summary.totalQuarterly.toLocaleString()}</span>
                  </div>
                )}
                {summary.totalMonthly > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Per Month</span>
                    <span className="text-[#044866]">${summary.totalMonthly.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mb-5">
                <span className="text-base text-[#044866]">Total Due Today</span>
                <span className="text-2xl text-[#044866]">${grandTotal.toLocaleString()}</span>
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
                    Complete Purchase
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1 mt-3">
                <Lock className="w-3 h-3 text-gray-500" />
                <p className="text-xs text-gray-500">Secure 256-bit SSL encrypted payment</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

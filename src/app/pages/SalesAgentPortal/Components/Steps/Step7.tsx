import { useFormContext } from 'react-hook-form';
import { DollarSign, Percent, Lock } from 'lucide-react';
import { SalesWizardForm } from '../../SalesAgentPortal';

export default function Step7() {
  const { watch, setValue } = useFormContext<SalesWizardForm>();

  // Get discount from RHF form state
  const discount = watch('discount');
  const checkoutSummary = watch('checkoutSummary' as any);
  console.log(checkoutSummary)
  const calculateDiscount = () => {
    if (!checkoutSummary || discount.value === 0) return 0;
    const baseTotal = checkoutSummary.totalOneTime + checkoutSummary.totalAnnual;
    if (discount.type === 'percentage') {
      return (baseTotal * discount.value) / 100;
    } else {
      return discount.value;
    }
  };
  const discountAmount = calculateDiscount();

  // NOTE: these validation alerts should be triggered on submit / step change, not during render.
  // Don’t keep these `alert` checks in the component body in real code.

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#F7A619]/10 to-[#F7A619]/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-[#F7A619]" />
        </div>
        <h2 className="text-2xl text-[#044866] mb-2">Apply Discount</h2>
        <p className="text-sm text-gray-600">Optional: Add a discount for your client</p>
      </div>

      <div className="bg-gradient-to-br from-[#F7A619]/10 to-[#F7A619]/5 border-2 border-[#F7A619]/20 rounded-2xl p-8 shadow-lg">
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          {/* Discount type */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Discount Type</label>
            <select
              value={discount.type}
              onChange={(e) =>
                setValue('discount.type', e.target.value as 'percentage' | 'fixed')
              }
              className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F7A619]/30"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>

          {/* Discount value */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              {discount.type === 'percentage' ? 'Discount %' : 'Discount Amount'}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max={discount.type === 'percentage' ? 100 : undefined}
                step={discount.type === 'percentage' ? 1 : 100}
                value={discount.value}
                onChange={(e) =>
                  setValue(
                    'discount.value',
                    parseFloat(e.target.value) || 0,
                    { shouldValidate: true }
                  )
                }
                className="w-full px-4 py-3 pr-10 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F7A619]/30"
                placeholder={discount.type === 'percentage' ? '10' : '500'}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                {discount.type === 'percentage' ? <Percent className="w-4 h-4" /> : '$'}
              </div>
            </div>
          </div>
        </div>

        {discount.value > 0 && (
          <>
            {/* Reason */}
            <div className="mb-5">
              <label className="block text-sm text-gray-700 mb-2">
                Discount Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={discount.notes}
                onChange={(e) => setValue('discount.notes', e.target.value, { shouldValidate: true })}
                className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F7A619]/30"
                rows={3}
                placeholder="Explain reason for discount (e.g., multi-year commitment, competitor match, strategic partnership)"
                required
              />
            </div>

            {/* Requires approval */}
            {discount.value > 20 && (
              <div className="p-4 bg-white border-2 border-[#F7A619] rounded-xl">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={discount.requiresApproval}
                    onChange={(e) =>
                      setValue('discount.requiresApproval', e.target.checked, {
                        shouldValidate: true,
                      })
                    }
                    className="mt-1 w-5 h-5 accent-[#044866] rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Lock className="w-4 h-4 text-[#F7A619]" />
                      <span className="text-sm text-[#044866]">Requires Admin Approval</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Discounts over 20% require manager approval before generating payment link
                    </p>
                  </div>
                </label>
              </div>
            )}
          </>
        )}

        {discount.value === 0 && (
          <div className="text-center p-6 bg-white/50 rounded-xl">
            <p className="text-sm text-gray-600">No discount applied</p>
            <p className="text-xs text-gray-500 mt-1">You can skip this step to continue</p>
          </div>
        )}
      </div>
    </div>
  );
}
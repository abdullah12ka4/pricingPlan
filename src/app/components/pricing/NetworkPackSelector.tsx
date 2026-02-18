import { useFormContext } from 'react-hook-form';
import { Check, Zap, Info, Clock, TrendingDown, AlertCircle, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { BillingCycle } from '@/app/types/pricing';


export type NetworkPack = {
  id: string;
  name: string;
  credits: number;
  pricePerCredit: number;
  totalPrice: number;
  autoCalculate: boolean;
  description: string;
  billingCycle: BillingCycle;
}
export function NetworkPackSelector({
  packs,
}: { packs: NetworkPack[] }) {
  const { setValue, watch } = useFormContext();
  const selectedPack = watch('networkPack'); // Get the current value from the form state

  // Function to handle pack selection and update the form state
  const handleSelectPack = (packId: string | null) => {
    // If the currently selected pack is clicked again, deselect it (set to null)
    const newPackId = selectedPack === packId ? null : packId;
    setValue('networkPack', newPackId, { shouldDirty: true, shouldTouch: true });
  };

  // Function to clear the selection
  const clearSelection = () => {
    setValue('networkPack', null, { shouldDirty: true, shouldTouch: true });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-base text-[#044866] flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-[#F7A619]" />
          Network Credits (Optional)
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          WPO (Work Placement Opportunities) credits power SkilTrak's industry placement matching system.
          <span className="font-medium text-[#044866]"> 1 credit = 1 student industry placement match.</span>
        </p>
      </div>

      {/* Information Alert */}
      <Alert className="border-[#044866]/20 bg-gradient-to-r from-[#044866]/5 to-[#F7A619]/5">
        <Info className="h-4 w-4 text-[#044866]" />
        <AlertDescription className="text-sm text-gray-700">
          <div className="space-y-2">
            <p className="font-medium text-[#044866]">How Network Credits Work:</p>
            <ul className="space-y-1.5 ml-1">
              <li className="flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#F7A619] mt-0.5 flex-shrink-0" />
                <span className="text-xs leading-relaxed">
                  <strong>Simple Pricing:</strong> Every time a student is matched with an industry placement,
                  1 credit is consumed - transparent and predictable costs.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#F7A619] mt-0.5 flex-shrink-0" />
                <span className="text-xs leading-relaxed">
                  <strong>Quarterly Billing:</strong> Credits are billed every 3 months and
                  expire at the end of each quarter to ensure fresh allocation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingDown className="w-3.5 h-3.5 text-[#F7A619] mt-0.5 flex-shrink-0" />
                <span className="text-xs leading-relaxed">
                  <strong>Volume Discounts:</strong> Larger packages offer better per-credit rates -
                  save up to 19% with our Enterprise package.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-[#F7A619] mt-0.5 flex-shrink-0" />
                <span className="text-xs leading-relaxed">
                  <strong>Organisation-Specific:</strong> Credits cannot be shared between organisations
                  and are tied to your training provider account.
                </span>
              </li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>

      {/* Package Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-600">
            Select a quarterly package or skip to configure your CRM plan only
          </p>
          {selectedPack && (
            <button
              type="button"
              onClick={clearSelection}
              className="text-xs text-[#044866] hover:text-[#0D5468] underline decoration-dotted underline-offset-2"
            >
              Clear selection
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {packs?.map((pack: any) => {
            const savingsPercent = pack.id === 'small' ? 0 :
              pack.id === 'medium' ? 6 :
                pack.id === 'large' ? 13 : 19;

            return (
              <button
                type='button'
                key={pack.id}
                onClick={() => handleSelectPack(pack.id)}
                className={`p-4 border-2 rounded-xl text-left transition-all relative group hover:shadow-lg ${selectedPack === pack.id
                    ? 'border-[#F7A619] bg-gradient-to-br from-[#F7A619]/10 to-[#F7A619]/5 shadow-lg shadow-[#F7A619]/20'
                    : 'border-gray-200 hover:border-[#F7A619]/30 bg-white'
                  }`}
              >
                {/* Best Value Badge */}
                {pack.id === 'large' && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-gradient-to-r from-[#044866] to-[#0D5468] rounded-full text-[10px] text-white font-medium shadow-md">
                    Best Value
                  </div>
                )}

                {/* Selection Indicator */}
                {selectedPack === pack.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-[#F7A619] rounded-full flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                {/* Package Header */}
                <div className="mb-3">
                  <div className="text-base font-semibold text-[#044866] mb-1">{pack.name}</div>
                  <div className="text-xs text-gray-600 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#F7A619]" />
                    {pack.credits.toLocaleString()} WPO credits/quarter
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-3 pb-3 border-b border-gray-200">
                  {pack.id === 'enterprise' ? (
                    <div>
                      <div className="text-2xl font-bold text-[#044866]">Custom</div>
                      <div className="text-xs text-gray-500 mt-0.5">Contact sales</div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-2xl font-bold text-[#044866]">
                          ${pack.totalPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">/quarter</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">
                          ${pack.pricePerCredit}/credit
                        </span>
                        {savingsPercent > 0 && (
                          <span className="text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                            Save {savingsPercent}%
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-1.5">
                  {pack.description?.split('\n').map((s: any) => s.trim()).filter(Boolean).slice(0, 3).map((service: any, idx: number) => (
                    <div key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                      <Check className="w-3 h-3 text-[#F7A619] mt-0.5 flex-shrink-0" />
                      <span className="leading-tight">{service}</span>
                    </div>
                  ))}
                </div>

                {/* Quarterly Note */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="text-[10px] text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Billed quarterly • Auto-renewal available
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="text-xs font-semibold text-[#044866] mb-2 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          Important Information About Network Credits
        </h4>
        <div className="grid md:grid-cols-2 gap-3 text-xs text-gray-600">
          <div>
            <p className="font-medium text-gray-700 mb-1">✓ What's Included:</p>
            <ul className="space-y-0.5 ml-3">
              <li>• Unlimited industry placement searches</li>
              <li>• AI-powered student-to-industry matching</li>
              <li>• Automated placement notifications</li>
              <li>• Placement tracking and reporting</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-gray-700 mb-1">⚡ Key Details:</p>
            <ul className="space-y-0.5 ml-3">
              <li>• Credits expire at end of each quarter</li>
              <li>• No rollover to next billing period</li>
              <li>• Can upgrade/downgrade packages anytime</li>
              <li>• Low balance alerts at 20 credits remaining</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
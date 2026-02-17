import { ShoppingCart, ArrowRight } from 'lucide-react';


export function CheckoutSummary({ summary , onCheckout}: any) {
  console.log("Summary", summary)
  if(!summary) return null;
  return (
    <div className="bg-white border-2 border-[#044866]/10 rounded-xl p-5 sticky top-5 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="w-4 h-4 text-[#044866]" />
        <h3 className="text-base text-[#044866]">Order Summary</h3>
      </div>

      <div className="space-y-3.5 mb-5">
        {/* Plan */}
        <div className="pb-3.5 border-b border-gray-100">
          <div className="flex justify-between items-start mb-1.5">
            <div>
              <div className="text-sm text-[#044866]">
                CRM {summary.selectedPlan === 'BASIC' ? 'BASIC' : 'PREMIUM'}
              </div>
              <div className="text-xs text-gray-600 mt-0.5">
               {summary.pricing_tier.min_max_gb}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[#044866]">${summary.pricing_tier.annual_price}</div>
              <div className="text-xs text-gray-500">per year</div>
            </div>
          </div>
        </div>

        {/* Setup Fee */}

          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600">Setup Fee (one-time)</span>
            <span className="text-[#044866]">${summary?.totals?.tax_amount}</span>
          </div>

        {/* Network Pack */}
        {summary.network_package && (
          <div className="pb-3.5 border-b border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-[#044866]">{summary.network_package.name} Credits</div>
                <div className="text-xs text-gray-600 mt-0.5">
                  {summary.network_package.credits} WPO credits
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-[#044866]">${summary.network_package.total_cost}</div>
                <div className="text-xs text-gray-500">per quarter</div>
              </div>
            </div>
          </div>
        )}

        {/* Add-ons */}
        {summary.items.length > 0 && (
          <div className="pb-3.5 border-b border-gray-100">
            <div className="text-xs text-gray-600 mb-2">Add-ons</div>
            <div className="space-y-1.5">
              {summary.items.map((item:any) => (
                <div key={item.id} className="flex justify-between items-start text-xs">
                  <div className="flex-1">
                    <div className="text-[#044866]">{item.name}</div>
                    {item.quantity && item.quantity > 1 && (
                      <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                    )}
                  </div>
                  <div className="text-right ml-2">
                    <div className="text-[#044866]">${item.total_price * item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="space-y-2.5 mb-5">
        {summary.totals.one_time_total > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">One-time Total</span>
            <span className="text-base text-[#044866]">${summary.totals.one_time_total}</span>
          </div>
        )}
        {summary.totals.annual_total > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Annual Total</span>
            <span className="text-base text-[#044866]">${summary.totals.annual_total}</span>
          </div>
        )}
        {summary.totals.quarterly_total > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Quarterly Total</span>
            <span className="text-base text-[#044866]">${summary.totals.quarterly_total}</span>
          </div>
        )}
        {summary.totalMonthly > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Monthly Total</span>
            <span className="text-base text-[#044866]">${summary.totalMonthly.toLocaleString()}</span>
          </div>
        )}
      </div>

      <button
      type='button'
      onClick={onCheckout}
        className="w-full bg-gradient-to-r from-[#044866] to-[#0D5468] text-white py-2.5 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm group"
      >
        <span>Continue to Checkout</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>

      <p className="text-xs text-gray-500 mt-3 text-center">
        All prices in AUD. Taxes calculated at checkout.
      </p>
    </div>
  );
}
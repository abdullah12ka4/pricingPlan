import { AddOn } from '@/app/pages/AdminDashboard/Types/AdminType';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

// This interface should now match the data from your RTK Query
interface AddOnCardProps {
  addOn: AddOn;
  selected: boolean;
  onToggle: () => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

export function AddOnCard({ addOn, quantity, selected, onToggle, onQuantityChange }: AddOnCardProps) {
  const IconComponent = Icons.Package as LucideIcon;

  const getPriceDisplay = () => {
    // Price and other details are now at the top level of the `addOn` object
    const price = addOn.price
    if (isNaN(price)) {
      return 'Custom pricing';
    }

    switch (addOn.pricingModel) {
      case 'ONE_TIME':
        return `$${price.toLocaleString()} one-time`;
      case 'RECURRING':
        return `$${price.toLocaleString()}/${addOn.billingFrequency.toLowerCase()}`;
      case 'PER_STUDENT':
        return `$${price.toLocaleString()}/student`;
      case 'SEAT_BASED':
        return `$${price.toLocaleString()}/seat/${addOn.billingFrequency.toLowerCase()}`;
      case 'PACK_BASED':
        return `$${price.toLocaleString()}`;
      default:       
        return `$${price.toLocaleString()}`;
    }
  };


  return (
    <div
      className={`p-3.5 border-2 rounded-lg transition-all ${
        selected 
          ? 'border-[#044866] bg-[#044866]/5 shadow-md shadow-[#044866]/10' 
          : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
            selected ? 'bg-gradient-to-br from-[#044866] to-[#0D5468]' : 'bg-gray-100'
          }`}>
            <IconComponent className={`w-4 h-4 ${selected ? 'text-white' : 'text-gray-600'}`} />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="text-sm font-medium text-[#044866]">{addOn.name}</h4>
                {/* "Popular" badge removed as 'featured' is not in the data */}
              </div>
              <p className="text-xs text-gray-600 mb-1.5 leading-relaxed">{addOn.description}</p>
              <div className="text-xs font-semibold text-[#044866]">{getPriceDisplay()}</div>
            </div>

            {/* Add/Remove Button */}
            <button
              type="button"
              onClick={onToggle}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all w-20 text-center ${
                selected
                  ? 'bg-[#044866] text-white hover:bg-[#0D5468] shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {selected ? 'Remove' : 'Add'}
            </button>
          </div>

          {selected && 
          (addOn.pricingModel === 'ONE_TIME' ||
             addOn.pricingModel === 'PACK_BASED' ||
             addOn.pricingModel === 'PER_STUDENT') && (
            <div className="mt-2.5 flex items-center gap-2.5">
              <label className="text-xs text-gray-600">Quantity:</label>
              <div className="flex items-center gap-1.5">
                <button
                type='button'
                  onClick={() => onQuantityChange(Math.max(quantity - 1))}
                  className="w-7 h-7 rounded border border-[#044866]/20 flex items-center justify-center hover:bg-[#044866]/5 disabled:opacity-40 disabled:cursor-not-allowed text-xs text-[#044866]"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    onQuantityChange(Math.min(Math.max(val, 1), 10));
                  }}
                  className="w-14 text-center border border-[#044866]/20 rounded px-2 py-1 text-xs text-[#044866]"
                  min={1}
                  max={10}                
                  />
                <button
                type='button'
                  onClick={() => onQuantityChange(Math.min(10, quantity + 1))}
                  className="w-7 h-7 rounded border border-[#044866]/20 flex items-center justify-center hover:bg-[#044866]/5 disabled:opacity-40 disabled:cursor-not-allowed text-xs text-[#044866]"
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
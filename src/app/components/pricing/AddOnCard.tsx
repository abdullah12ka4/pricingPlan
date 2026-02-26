import { AddOn } from '@/app/pages/AdminDashboard/Types/AdminType';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface AddOnCardProps {
  addOn: AddOn;
  selected: boolean;
  onToggle: () => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  /**
   * isExisting — true if this addon was part of the user's active subscription.
   * Used to show a "Current" badge and differentiate from newly added addons.
   */
  isExisting?: boolean;
}

export function AddOnCard({ addOn, quantity, selected, onToggle, onQuantityChange, isExisting = false }: AddOnCardProps) {
  const IconComponent = Icons.Package as LucideIcon;

  const getPriceDisplay = () => {
    const price = addOn.price;
    if (isNaN(price)) return 'Custom pricing';

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

  /**
   * Border/background states:
   * - selected + existing  → teal border (active, unchanged)
   * - selected + new       → green border (newly added)
   * - not selected + was existing (removed) → red/amber border (being removed)
   * - not selected + never had → default gray
   */
  const getContainerClass = () => {
    if (selected && isExisting) {
      return 'border-[#044866] bg-[#044866]/5 shadow-md shadow-[#044866]/10';
    }
    if (selected && !isExisting) {
      return 'border-green-500 bg-green-50 shadow-md shadow-green-500/10';
    }
    if (!selected && isExisting) {
      return 'border-amber-400 bg-amber-50 shadow-sm shadow-amber-400/10';
    }
    return 'border-gray-200 hover:border-gray-300 bg-white';
  };

  const getIconClass = () => {
    if (selected && !isExisting) return 'bg-gradient-to-br from-green-500 to-green-600';
    if (selected) return 'bg-gradient-to-br from-[#044866] to-[#0D5468]';
    if (!selected && isExisting) return 'bg-amber-100';
    return 'bg-gray-100';
  };

  const getIconColorClass = () => {
    if (selected) return 'text-white';
    if (!selected && isExisting) return 'text-amber-600';
    return 'text-gray-600';
  };

  const getButtonClass = () => {
    if (selected && !isExisting) {
      return 'bg-green-600 text-white hover:bg-green-700 shadow-sm';
    }
    if (selected) {
      return 'bg-[#044866] text-white hover:bg-[#0D5468] shadow-sm';
    }
    if (!selected && isExisting) {
      return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
    }
    return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  const getButtonLabel = () => {
    if (selected && isExisting) return 'Remove';
    if (selected && !isExisting) return 'Remove';
    if (!selected && isExisting) return 'Restore';
    return 'Add';
  };

  return (
    <div className={`p-3.5 border-2 rounded-lg transition-all ${getContainerClass()}`}>
      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${getIconClass()}`}>
            <IconComponent className={`w-4 h-4 ${getIconColorClass()}`} />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <h4 className="text-sm font-medium text-[#044866]">{addOn.name}</h4>

                {/* ✅ Status badges */}
                {isExisting && selected && (
                  <span className="text-[10px] bg-[#044866]/10 text-[#044866] px-1.5 py-0.5 rounded-full font-medium">
                    Current
                  </span>
                )}
                {!isExisting && selected && (
                  <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                    New
                  </span>
                )}
                {isExisting && !selected && (
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
                    Will be removed
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mb-1.5 leading-relaxed">{addOn.description}</p>
              <div className="text-xs font-semibold text-[#044866]">{getPriceDisplay()}</div>
            </div>

            {/* Add/Remove/Restore Button */}
            <button
              type="button"
              onClick={onToggle}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all w-24 text-center ${getButtonClass()}`}
            >
              {getButtonLabel()}
            </button>
          </div>

          {/* Quantity controls — shown when selected and pricing model supports it */}
          {selected &&
            (addOn.pricingModel === 'ONE_TIME' ||
              addOn.pricingModel === 'PACK_BASED' ||
              addOn.pricingModel === 'PER_STUDENT') && (
              <div className="mt-2.5 flex items-center gap-2.5">
                <label className="text-xs text-gray-600">Quantity:</label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onQuantityChange(Math.max(quantity - 1, 1))}
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
                    type="button"
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
'use client'

import { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { AddOnCard } from '@/app/components/pricing/AddOnCard';
import { Package } from 'lucide-react';
import { AddOn, AddOnItem } from '@/app/pages/AdminDashboard/Types/AdminType';
import type { SalesWizardForm, Step } from '../../SalesAgentPortal';

interface Step6Props {
  data: AddOn[];
  setCurrentStep?: React.Dispatch<React.SetStateAction<Step>>;
  /**
   * existingAddOn — the FROZEN baseline from the active subscription.
   * Used ONLY as a visual hint (badge colours, "Current" label).
   * Step6 does NOT write this into the form — CustomerPortal already did that.
   */
  existingAddOn?: AddOnItem[];
}

export default function Step6({ data, setCurrentStep, existingAddOn = [] }: Step6Props) {
  const { watch, setValue } = useFormContext<SalesWizardForm>();

  const selectedPlan = watch('plan');
  const addOnItems = (watch('addOns') ?? []) as AddOnItem[];

  /**
   * Step6 NEVER pre-populates the form.
   * CustomerPortal owns the preload via its useEffect + setValue.
   * If Step6 also called setValue here it would fight CustomerPortal and
   * re-add removed addons every time the component re-mounts
   * (e.g. when networkPack changes and the conditional re-renders Step6).
   */

  const handleAddOnToggle = (addOnId: string) => {
    const existingIndex = addOnItems.findIndex((item) => item.addonId === addOnId);

    if (existingIndex >= 0) {
      const updated = addOnItems.filter((item) => item.addonId !== addOnId);
      setValue('addOns', updated, { shouldValidate: true });
    } else {
      setValue('addOns', [...addOnItems, { addonId: addOnId, quantity: 1 }], {
        shouldValidate: true,
      });
    }
  };

  const handleQuantityChange = (addOnId: string, quantity: number) => {
    if (quantity <= 0) {
      const updated = addOnItems.filter((item) => item.addonId !== addOnId);
      setValue('addOns', updated, { shouldValidate: true });
      return;
    }

    const existingIndex = addOnItems.findIndex((item) => item.addonId === addOnId);

    if (existingIndex >= 0) {
      const updated = [...addOnItems];
      updated[existingIndex] = { ...updated[existingIndex], quantity };
      setValue('addOns', updated, { shouldValidate: true });
    } else {
      setValue('addOns', [...addOnItems, { addonId: addOnId, quantity }], {
        shouldValidate: true,
      });
    }
  };

  // Group add-ons by category
  const addOnsByCategory: Record<string, AddOn[]> = {};
  data?.forEach((addOn: AddOn) => {
    if (!addOnsByCategory[addOn.category]) {
      addOnsByCategory[addOn.category] = [];
    }
    addOnsByCategory[addOn.category].push(addOn);
  });

  // Filter add-ons based on selected plan
  const filteredAddOnsByCategory: Record<string, AddOn[]> = {};
  Object.entries(addOnsByCategory).forEach(([category, addOns]) => {
    filteredAddOnsByCategory[category] = addOns.filter(
      (addOn) =>
        addOn.availablePlans.includes(selectedPlan) && addOn.status === 'ACTIVE'
    );
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#044866]/10 to-[#0D5468]/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-[#044866]" />
        </div>
        <h2 className="text-2xl text-[#044866] mb-2">Add-ons & Enhancements</h2>
        <p className="text-sm text-gray-600">Optional: Enhance with additional features</p>
        {existingAddOn.length > 0 && (
          <p className="text-xs text-[#F7A619] mt-1">
            ✓ Your current add-ons are pre-selected below
          </p>
        )}
      </div>

      {data && Object.keys(filteredAddOnsByCategory).length > 0 ? (
        <div className="bg-white border border-[#044866]/10 rounded-2xl p-6 shadow-lg">
          {Object.entries(filteredAddOnsByCategory).map(([category, addOns]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-base text-[#044866] mb-3">{category}</h3>
              <div className="grid gap-3">
                {addOns.map((addOn) => {
                  const selectedItem = addOnItems.find(
                    (item) => item.addonId === addOn.id
                  );
                  const isSelected = !!selectedItem;
                  const quantity = selectedItem?.quantity ?? 1;
                  const isExisting = existingAddOn.some((e) => e.addonId === addOn.id);

                  return (
                    <AddOnCard
                      key={addOn.id}
                      addOn={addOn}
                      selected={isSelected}
                      quantity={quantity}
                      isExisting={isExisting}
                      onToggle={() => handleAddOnToggle(addOn.id)}
                      onQuantityChange={(qty) => handleQuantityChange(addOn.id, qty)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#044866]/10 rounded-2xl p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No add-ons available for this configuration</p>
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setValue('addOns', [], { shouldValidate: true });
            setCurrentStep?.('discount');
          }}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Continue without add-ons
        </button>
      </div>
    </div>
  );
}
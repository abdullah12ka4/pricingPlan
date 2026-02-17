// Step3.tsx
import { FeatureComparisonTable } from "@/app/components/pricing/FeatureComparisonTable";
// import { features } from "@/app/data/mockPricingData"; // keep if you still use static feature list
import { Check, CheckCircle, Star } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { PricingFormData, PricingPlan, TABLETYPE } from "@/app/pages/AdminDashboard/Types/AdminType";
import { useGetFeaturesQuery } from "@/Redux/services/Features";

export default function Step3({ data }: { data: PricingPlan[] }) {
  const [showFeatures, setShowFeatures] = useState(false);
  const { watch, setValue } = useFormContext<PricingFormData>();
  const selectedOrgType = watch("organizationType");
  const selectedPlan = (watch("plan") ?? "BASIC") as TABLETYPE['planType'];
  const { data: features, isLoading, error } = useGetFeaturesQuery();
  // All plans for the selected organisation type
  const orgPlans = data.filter(
    (p) => p.organisationType === selectedOrgType
  );

  const getStartingPriceForPlanType = (planType: TABLETYPE['planType']) => {
    const relevant = orgPlans.filter((p) => p.planType === planType);
    if (!relevant.length) return null;

    const min = Math.min(
      ...relevant.map((p) => parseFloat(p.annualPrice))
    );
    return min;
  };



  const basicPrice = getStartingPriceForPlanType("BASIC");
  const premiumPrice = getStartingPriceForPlanType("PREMIUM");

  const handleSelectPlan = (planType: TABLETYPE['planType']) => {
    setValue("plan", planType, { shouldDirty: true });
    // Reset any previously selected tier
    setValue("tier", undefined, { shouldDirty: true });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#044866]/10 to-[#0D5468]/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-[#044866]" />
        </div>
        <h2 className="text-2xl text-[#044866] mb-2">Choose CRM Plan</h2>
        <p className="text-sm text-gray-600">
          Select the plan that fits your client's needs
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* BASIC card – only show if we actually have BASIC tiers */}
        {basicPrice !== null && (
          <button
            type="button"
            onClick={() => handleSelectPlan("BASIC")}
            className={`relative p-8 border-2 rounded-2xl text-left transition-all hover:shadow-xl ${selectedPlan === "BASIC"
                ? "border-[#044866] bg-gradient-to-br from-[#044866]/5 to-[#0D5468]/5 shadow-lg"
                : "border-[#044866]/10 bg-white"
              }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl text-[#044866] mb-1">CRM Basic</h3>
                <p className="text-sm text-gray-600">
                  Essential features for getting started
                </p>
              </div>
              {selectedPlan === "BASIC" && (
                <CheckCircle className="w-6 h-6 text-[#044866]" />
              )}
            </div>
            <div className="text-2xl text-[#044866] mb-4">
              From ${basicPrice.toLocaleString()}
              <span className="text-sm text-gray-600">/year</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Admin & sub-admin accounts
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Student management
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                Basic reporting
              </li>
            </ul>
          </button>
        )}

        {/* PREMIUM card – only show if we have PREMIUM tiers */}
        {premiumPrice !== null && (
          <button
            type="button"
            onClick={() => handleSelectPlan("PREMIUM")}
            className={`relative p-8 border-2 rounded-2xl text-left transition-all hover:shadow-xl ${selectedPlan === "PREMIUM"
                ? "border-[#044866] bg-gradient-to-br from-[#044866] to-[#0D5468] text-white shadow-lg"
                : "border-[#044866]/10 bg-white"
              }`}
          >
            <div className="absolute -top-3 right-6 px-3 py-1 bg-[#F7A619] rounded-full text-xs text-white">
              Most Popular
            </div>

            <div className="flex justify-between items-start mb-4">
              <div>
                <h3
                  className={`text-xl mb-1 ${selectedPlan === "PREMIUM"
                      ? "text-white"
                      : "text-[#044866]"
                    }`}
                >
                  CRM Premium
                </h3>
                <p
                  className={`text-sm ${selectedPlan === "PREMIUM"
                      ? "text-white/80"
                      : "text-gray-600"
                    }`}
                >
                  Advanced automation & AI features
                </p>
              </div>
              {selectedPlan === "PREMIUM" && (
                <CheckCircle className="w-6 h-6 text-white" />
              )}
            </div>
            <div
              className={`text-2xl mb-4 ${selectedPlan === "PREMIUM" ? "text-white" : "text-[#044866]"
                }`}
            >
              From ${premiumPrice.toLocaleString()}
              <span
                className={`text-sm ${selectedPlan === "PREMIUM"
                    ? "text-white/70"
                    : "text-gray-600"
                  }`}
              >
                /year
              </span>
            </div>
            <ul
              className={`space-y-2 text-sm ${selectedPlan === "PREMIUM"
                  ? "text-white/90"
                  : "text-gray-700"
                }`}
            >
              <li className="flex items-center gap-2">
                <Check
                  className={`w-4 h-4 ${selectedPlan === "PREMIUM"
                      ? "text-white"
                      : "text-green-600"
                    }`}
                />
                Everything in Basic
              </li>
              <li className="flex items-center gap-2">
                <Check
                  className={`w-4 h-4 ${selectedPlan === "PREMIUM"
                      ? "text-white"
                      : "text-green-600"
                    }`}
                />
                AI-powered automation
              </li>
              <li className="flex items-center gap-2">
                <Check
                  className={`w-4 h-4 ${selectedPlan === "PREMIUM"
                      ? "text-white"
                      : "text-green-600"
                    }`}
                />
                Advanced analytics & insights
              </li>
            </ul>
          </button>
        )}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setShowFeatures(!showFeatures)}
          className="text-sm text-[#044866] hover:text-[#0D5468] underline decoration-dotted"
        >
          {showFeatures ? "Hide" : "View"} Detailed Feature Comparison
        </button>
      </div>

      {showFeatures && (
        <div className="mt-6 bg-white border border-[#044866]/10 rounded-2xl p-6">
          <FeatureComparisonTable features={features} />
        </div>
      )}
    </div>
  );
}
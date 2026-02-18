import {
  Briefcase,
  Building2,
  Check,
  GraduationCap,
  LucideIcon,
  School,
  University,
} from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Plan, TABLETYPE } from "../../AdminDashboard/Types/AdminType";

/* ---------------- TYPES ---------------- */

interface FormData {
  organizationType: TABLETYPE["organisationType"] | null;
  organizationId?: string;
  plan?: Plan["planType"];
}

/* ---------------- COMPONENT ---------------- */

export default function Organization({ data }: { data: Plan[] }) {

  const { watch, setValue } = useFormContext<FormData>();

  const selectedOrgType = watch("organizationType");
  const selectedPlan = watch("plan");

  /* ------------ ORG META ------------ */

  const ORG_META: Record<
    TABLETYPE["organisationType"],
    { label: string; description: string; icon: LucideIcon }
  > = {
    SCHOOL: {
      label: "School",
      description: "Primary & secondary schools",
      icon: School,
    },
    UNIVERSITY: {
      label: "University",
      description: "Higher education institutions",
      icon: University,
    },
    RTO: {
      label: "RTO",
      description: "Register Training Organization",
      icon: Building2,
    },
    TAFE: {
      label: "TAFE",
      description: "Technical & Further Education",
      icon: GraduationCap,
    },
    CORPORATE: {
      label: "Corporate",
      description: "Corporate Training Provider",
      icon: Briefcase,
    },
  };

  /* ------------ GROUP ORGS + STARTING PRICE ------------ */

  const orgCards = Object.values(
    data.reduce((acc, plan) => {
      const type = plan.organisationType;

      if (!ORG_META[type]) return acc;

      const price = Number(plan.annualPrice);

      acc[type] ??= {
        organisationType: type,
        organisationId: plan.id,
        minAny: Infinity,
        minBasic: Infinity,
      };

      acc[type].minAny = Math.min(acc[type].minAny, price);

      if (plan.planType === "BASIC") {
        acc[type].minBasic = Math.min(acc[type].minBasic, price);
      }

      return acc;
    }, {} as Record<
      TABLETYPE["organisationType"],
      {
        organisationType: TABLETYPE["organisationType"];
        organisationId: string;
        minAny: number;
        minBasic: number;
      }
    >)
  ).map((group) => ({
    ...group,
    ...ORG_META[group.organisationType],
    startingPrice:
      group.minBasic !== Infinity ? group.minBasic : group.minAny,
  }));

  /* ------------ PRICE HELPERS ------------ */

  const getPlanPrice = (type: "BASIC" | "PREMIUM") => {
    if (!selectedOrgType) return 0;

    const plans = data.filter(
      (p) =>
        p.planType === type &&
        p.organisationType === selectedOrgType
    );

    if (!plans.length) return 0;

    return Math.min(...plans.map((p) => Number(p.annualPrice)));
  };

  /* ------------ HANDLERS ------------ */

  const handleOrgSelect = (
    type: TABLETYPE["organisationType"],
    id: string
  ) => {
    setValue("organizationType", type, { shouldValidate: true });
    setValue("organizationId", id, { shouldValidate: true });
  };

  /* ------------ UI ------------ */

  return (
    <>
      {!selectedOrgType && (
        <div className="mb-10">
          <h2 className="text-xl mb-5 text-[#044866] text-center">
            Select Your Organisation Type
          </h2>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {orgCards.map((card) => {
              const Icon = card.icon;

              return (
                <button
                  type="button"
                  key={`${card.organisationType}-${card.organisationId}`}
                  onClick={() =>
                    handleOrgSelect(
                      card.organisationType,
                      card.organisationId
                    )
                  }
                  className="group p-4 bg-white border-2 border-[#044866]/10 rounded-xl hover:border-[#044866]/30 hover:shadow-lg transition-all text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#044866]/10 to-[#0D5468]/5 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-[#044866]" />
                  </div>

                  <h3 className="text-sm text-[#044866] mb-1">
                    {card.label}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">
                    {card.description}
                  </p>

                  <div className="text-xs text-[#F7A619]">
                    From ${card.startingPrice.toLocaleString()}/yr
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedOrgType && (
        <div className="mb-7">
          <div className="grid md:grid-cols-2 gap-5 mb-10">
            {/* BASIC */}
            <button
              type="button"
              onClick={() => setValue("plan", "BASIC")}
              className={`relative p-5 border-2 rounded-xl text-left transition-all overflow-hidden group ${
                selectedPlan === "BASIC"
                  ? "border-[#044866] bg-[#044866]/5 shadow-lg shadow-[#044866]/10"
                  : "border-gray-200 hover:border-[#044866]/30 bg-white"
              }`}
            >
              <h2 className="text-xl text-[#044866] mb-2">CRM Basic</h2>

              <div className="flex items-baseline gap-1">
                <span className="text-xs text-gray-500">Starting from</span>
                <span className="text-2xl text-[#044866]">
                  ${getPlanPrice("BASIC").toLocaleString()}
                </span>
                <span className="text-xs text-gray-500">/year</span>
              </div>
            </button>

            {/* PREMIUM */}
            <button
              type="button"
              onClick={() => setValue("plan", "PREMIUM")}
              className={`relative p-5 border-2 rounded-xl text-left transition-all overflow-hidden group ${
                selectedPlan === "PREMIUM"
                  ? "border-[#044866] bg-gradient-to-br from-[#044866] to-[#0D5468] shadow-lg shadow-[#044866]/20"
                  : "border-gray-200 hover:border-[#044866]/30 bg-white"
              }`}
            >
              <h2
                className={`text-xl mb-2 ${
                  selectedPlan === "PREMIUM"
                    ? "text-white"
                    : "text-[#044866]"
                }`}
              >
                CRM Premium
              </h2>

              <div className="flex items-baseline gap-1">
                <span
                  className={`text-xs ${
                    selectedPlan === "PREMIUM"
                      ? "text-white/70"
                      : "text-gray-500"
                  }`}
                >
                  Starting from
                </span>
                <span
                  className={`text-2xl ${
                    selectedPlan === "PREMIUM"
                      ? "text-white"
                      : "text-[#044866]"
                  }`}
                >
                  ${getPlanPrice("PREMIUM").toLocaleString()}
                </span>
                <span
                  className={`text-xs ${
                    selectedPlan === "PREMIUM"
                      ? "text-white/70"
                      : "text-gray-500"
                  }`}
                >
                  /year
                </span>
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

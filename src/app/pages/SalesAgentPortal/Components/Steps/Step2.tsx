import {
  Briefcase,
  Building2,
  CheckCircle,
  GraduationCap,
  School,
  University,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { Plan, TABLETYPE } from '@/app/pages/AdminDashboard/Types/AdminType';

// 🚨 UPDATED: Added organizationId to form data
type FormData = {
  organizationType: TABLETYPE['organisationType'];
  organizationId: string; // New field to store selected org ID
};

// Static metadata for what each card should look like
const ORG_META: Record<
 TABLETYPE['organisationType'],
  { label: string; description: string; icon: LucideIcon }
> = {
  SCHOOL: {
    label: 'School',
    description: 'Primary & secondary schools',
    icon: School,
  },
  UNIVERSITY: {
    label: 'University',
    description: 'Higher education institutions',
    icon: University,
  },
  RTO:{
    label: "RTO",
    description:'Register Training Organization',
    icon: Building2
  },
  TAFE:{
    label:'TAFE',
    description:'Technical & Further Education',
    icon:GraduationCap
  },
  CORPORATE:{
    label:'Corporate',
    description:'Corporate Training Provider',
    icon: Briefcase
  }
};

export default function Step2({ org, data }: { org: string, data: Plan[] }) {

  const { watch, setValue } = useFormContext<FormData>();
  const selectedOrgType = watch('organizationType');
  const selectedOrgId = watch('organizationId');

  // 🔄 UPDATED: Improved grouping logic to capture orgId along with pricing
  const orgCards = Object.values(
    data.reduce(
      (acc, plan) => {
        const type = plan.organisationType;
        
        // Only process valid org types that exist in our metadata
        if(!ORG_META[type]) return acc;

        const price = parseFloat(plan.annualPrice);
        const current = acc[type] ?? {
            organisationType: type,
            organisationId: plan.id, // Capture the actual org ID from the plan
            minAny: Infinity,
            minBasic: Infinity,
          };

        // Track minimum prices
        current.minAny = Math.min(current.minAny, price);
        if (plan.planType === 'BASIC') {
          current.minBasic = Math.min(current.minBasic, price);
        }

        acc[type] = current;
        return acc;
      },
      {} as Record<
        TABLETYPE['organisationType'],
        { 
          organisationType: TABLETYPE['organisationType'];
          organisationId: string;
          minAny: number; 
          minBasic: number;
        }
      >
    )
  ).map((group) => {
    const meta = ORG_META[group.organisationType];
    const startingPrice = group.minBasic !== Infinity ? group.minBasic : group.minAny;

    return {
      ...group,
      startingPrice,
      ...meta,
    };
  });

  // 🎯 MAIN SELECTION HANDLER: Sets both org type and org ID
  const handleOrgSelect = (type: TABLETYPE['organisationType'], id: string) => {
    // Safely set both form values
    setValue('organizationType', type, { shouldValidate: true });
    setValue('organizationId', id, { shouldValidate: true });
  }


  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#044866]/10 to-[#0D5468]/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-[#044866]" />
        </div>
        <h2 className="text-2xl text-[#044866] mb-2">Select Organisation Type</h2>
        <p className="text-sm text-gray-600">
          Choose the type that best matches {org}
        </p>
      </div>
 {orgCards.length === 0 && <p className='text-center font-semibold text-xl'>No organization available</p>}
      <div className="grid md:grid-cols-3 gap-5">
       
        {orgCards.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedOrgType === card.organisationType && selectedOrgId === card.organisationId;

          return (
            <button
              type="button"
              key={`${card.organisationType}-\({card.organisationId}`}
              onClick={() => handleOrgSelect(card.organisationType, card.organisationId)}
              className={`group p-6 border-2 rounded-2xl text-center transition-all hover:shadow-xl \){
                isSelected
                  ? 'border-[#044866] bg-gradient-to-br from-[#044866]/5 to-[#0D5468]/5 shadow-lg'
                  : 'border-[#044866]/10 hover:border-[#044866]/30 bg-white'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform \({
                  isSelected
                    ? 'bg-gradient-to-br from-[#044866] to-[#0D5468]'
                    : 'bg-gradient-to-br from-[#044866]/10 to-[#0D5468]/5'
                }`}
              >
                <Icon
                  className={`w-7 h-7 \){
                    isSelected ? 'text-white' : 'text-[#044866]'
                  }`}
                />
              </div>

              <h3 className="text-base text-[#044866] mb-1">{card.label}</h3>
              <p className="text-xs text-gray-600 mb-3">{card.description}</p>

              <div className="text-sm text-[#F7A619]">
                From ${card.startingPrice.toLocaleString()}/year
              </div>

              {isSelected && (
                <div className="mt-3 flex items-center justify-center gap-2 text-[#044866]">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs">Selected</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
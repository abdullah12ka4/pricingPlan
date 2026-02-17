'use client'
import { FeatureComparisonTable } from '@/app/components/pricing/FeatureComparisonTable';
import { useGetFeaturesQuery } from '@/Redux/services/Features';
import { useState } from 'react'

export default function Features() {
      const [showFeatures, setShowFeatures] = useState(false);
        const { data: features } = useGetFeaturesQuery();
    return (
        <div>
            {/* Feature Comparison Toggle */}
            <div className="text-center mb-7">
                <button
                    type='button'
                    onClick={() => setShowFeatures(!showFeatures)}
                    className="text-sm text-[#044866] hover:text-[#0D5468] underline decoration-dotted underline-offset-4"
                >
                    {showFeatures ? 'Hide' : 'Compare'} Features
                </button>
            </div>

            {showFeatures && (
                <div className="bg-white rounded-xl border border-[#044866]/10 p-5 mb-7 shadow-sm">
                    <FeatureComparisonTable features={features} />
                </div>
            )}
        </div>
    )
}

'use client'

import { NetworkPackSelector } from '@/app/components/pricing/NetworkPackSelector'
import { NetworkPack } from '@/app/home/Types/homeTypes'

import { Zap } from 'lucide-react'
import { useState } from 'react'

export default function Step5({ data }: { data: NetworkPack[] }) {
  const [selectedNetworkPack, setSelectedNetworkPack] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#044866]/10 to-[#0D5468]/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Zap className="w-8 h-8 text-[#044866]" />
        </div>
        <h2 className="text-2xl text-[#044866] mb-2">Network Credit Package</h2>
        <p className="text-sm text-gray-600">Optional: Add quarterly network credits (WPO)</p>
      </div>

      <div className="bg-white border border-[#044866]/10 rounded-2xl p-6 shadow-lg">
        <NetworkPackSelector packs={data} />
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => setSelectedNetworkPack(null)}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Skip network credits for now
        </button>
      </div>
    </div>
  )
}

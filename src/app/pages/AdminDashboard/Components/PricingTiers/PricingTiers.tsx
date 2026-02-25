'use client'
import { Plus } from 'lucide-react'
import PricingTableFilters from './PricingTableFilters'
import { useState } from 'react'
import { PricingTiersForm } from './PricingTiersForm'
import { TABLETYPE } from '../../Types/AdminType'


export default function PricingTiers() {  
  const [showModal, setshowModal] = useState(false)
  const [selectedTier, setselectedTier] = useState<TABLETYPE | null>(null)

  const handleEditTier = (tier: TABLETYPE) => {
  setselectedTier(tier)  // store the tier to edit
  setshowModal(true)     // open the form modal
  }

  return (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl text-[#044866] mb-1">Pricing Tiers Management</h2>
              <p className="text-sm text-gray-600">Configure pricing for different student volume tiers and organisation types</p>
            </div>
            <button
              onClick={() => {
                setselectedTier(null)
                setshowModal(true)
              }}
              className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#044866] to-[#0D5468] text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Create New Tier
            </button>
          </div>

          {showModal && <PricingTiersForm tier={selectedTier} setShowCreateModal={setshowModal}/>}
    
          {/* Filters */}
          <PricingTableFilters editTier={handleEditTier} setModal={setshowModal} />
    
        </div>
  )
}

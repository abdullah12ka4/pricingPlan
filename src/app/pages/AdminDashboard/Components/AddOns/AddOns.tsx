'use client'


import { Spinner } from '@/app/components/ui/spinner';
import { useDeleteAddOnsMutation, useGetAddOnsQuery } from '@/Redux/services/AddOns'
import {  MoreVertical, Plus, Star, Trash2 } from 'lucide-react'
import { useState } from 'react';
import { AddOnsForm } from './AddOnsForm';
import { toast } from 'sonner';
import { addons } from '../../Types/AdminType';

export default function AddOns() {
  const [showModel, setshowModel] = useState(false)
  const { data, isLoading, error } = useGetAddOnsQuery();
  const [selectedAddOns, setselectedAddOns] = useState<addons | null>(null)
  const [deleteAddOns] = useDeleteAddOnsMutation();
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error && "status" in error) {
    return (
      <div className="text-red-500 h-screen flex items-center justify-center">
        Error {error.status}: {"error" in error ? error.error : "Something went wrong"}
      </div>
    );
  }

  // console.log(data)

  //  console.log("AddONS", data)

  const handleEdit = (tier: addons) => {
    setselectedAddOns(tier)
    setshowModel(true)
  }
  const handleDelete = async (id: string) => {
    try {
      if (id) {
        await deleteAddOns(id).unwrap()
        toast.success('Successfully Deleted AddOn')
      }
    } catch (error) {
      console.error("Error deleting AddOn:", error);
    }

  }
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-[#044866] mb-1">Add-ons Management</h2>
          <p className="text-sm text-gray-600">Manage additional features and services</p>
        </div>
        <button
          onClick={() => {
            setshowModel(true)
            setselectedAddOns(null)
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#044866] to-[#0D5468] text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Add-on
        </button>
      </div>
      {showModel && <AddOnsForm setModal={setshowModel} addData={selectedAddOns} />}
      {!data || data.length < 1 && <div className='min-h-[60vh] flex items-center justify-center w-full'>
        NO AddOns Found
      </div>}
      {/* Add-ons Grid */}
      <div className="grid grid-cols-2 gap-5">

        {data.map((addon: addons) => (
          <div key={addon.id} className="bg-white border border-[#044866]/10 rounded-xl p-5 hover:shadow-lg transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base text-[#044866]">{addon.name}</h3>
                  {addon.isPremiumOnly && (
                    <Star className="w-4 h-4 text-[#F7A619]" />
                  )}
                </div>
                <p className="text-xs text-gray-600 mb-2">{addon.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-[#044866]/5 text-[#044866] capitalize rounded-full text-xs">
                    {addon.pricingModel.toLowerCase()}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full capitalize text-xs ${addon.status === 'ACTIVE'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                    }`}>
                    {addon.status.toLowerCase()}
                  </span>
                </div>
              </div>
              <button className="p-1.5 hover:bg-gray-100 rounded transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Pricing</span>
                <span className="text-sm text-[#044866]">
                  {addon.price?.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Available for</span>
                <span className="text-xs text-gray-700">
                  {addon.availablePlans.join(', ')}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEdit(addon)}
                className="flex-1 px-3 py-2 border border-[#044866]/20 text-[#044866] rounded-lg text-sm hover:bg-[#044866]/5 transition-colors">
                Edit
              </button>
              <button
                onClick={() => handleDelete(addon.id)}
                className="cursor-pointer px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

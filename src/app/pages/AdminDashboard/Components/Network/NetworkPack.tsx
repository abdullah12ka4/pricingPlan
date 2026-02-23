'use client'

import { Plus, Trash2, Zap } from "lucide-react"
import { useState } from "react"
import NetworkPackForm from "./NetworkPackForm"
import { useDeleteNetworkMutation, useGetNetworkQuery } from "@/Redux/services/NetworkModal"
import { Spinner } from "@/app/components/ui/spinner"
import { toast } from "sonner"
import { NetworkType } from "../../Types/AdminType"

export default function NetworkPack() {
  const [showModal, setshowModal] = useState(false)
  const [selectedNetwork, setselectedNetwork] = useState<NetworkType | null>(null)
  const { data, isLoading, error } = useGetNetworkQuery()
  const [deleteNetwork] = useDeleteNetworkMutation();

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

  const handleDelete = async (id: string) => {
    try {
      if (id) {
        const res = await deleteNetwork(id).unwrap();
        if(res?.id){
        toast.success('Network package deleted successfully!');
        }
      }
    } catch (error) {
      toast.error('Failed to delete network package.');
      console.error("Delete Error:", error);
    }
  }
  const handleEdit = async (pack: NetworkType) => {
    setshowModal(true);
    setselectedNetwork(pack);
  }

 return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-[#044866] mb-1">Network Credit Packages</h2>
          <p className="text-sm text-gray-600">Manage quarterly WPO credit packages</p>
        </div>
        <button
          onClick={() => {
            setshowModal(true)
            setselectedNetwork(null)
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#044866] to-[#0D5468] text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Network
        </button>
      </div>
      {showModal && <NetworkPackForm modal={setshowModal} selectedNetwork={selectedNetwork} />}
      {/* Network Packs Grid */}
      <div className="grid grid-cols-3 gap-5">
        {data?.map((pack: NetworkType) => (
          <div key={pack.id} className="bg-white border-2 border-[#044866]/10 rounded-xl p-5 hover:border-[#044866]/30 hover:shadow-lg transition-all group relative">

            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#044866]/10 to-[#0D5468]/5 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-[#044866]" />
              </div>
              <h3 className="text-lg text-[#044866] mb-1">{pack.name}</h3>
              <div className="text-2xl text-[#044866] mb-1">{pack.credits.toLocaleString()}</div>
              <div className="text-xs text-gray-600">credits / quarter</div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cost per credit</span>
                <span className="text-[#044866]">${pack.pricePerCredit ? Number(pack.pricePerCredit).toFixed(2) : null}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total cost</span>
                <span className="text-[#044866]">${pack.totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Billing</span>
                <span className="text-gray-700">Quarterly</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(pack)}
                className="cursor-pointer flex-1 px-3 py-2 border border-[#044866]/20 text-[#044866] rounded-lg text-sm hover:bg-[#044866]/5 transition-colors">
                Edit
              </button>
              <button
                onClick={() => handleDelete(pack?.id)}
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

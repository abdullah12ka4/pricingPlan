import Modal from "@/app/components/Reusable/Modal";
import { useAddPricingTiersMutation, useEditPricingTiersMutation } from "@/Redux/services/tiersApi";
import { toast } from "sonner";
import { TABLETYPE } from "../../Types/AdminType";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function PricingTiersForm({ setShowCreateModal, tier }: { setShowCreateModal: (show: boolean) => void, tier: TABLETYPE | null }) {
  const [addPricingTiers] = useAddPricingTiersMutation();
  const [editPricingTiers] = useEditPricingTiersMutation()


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {

      const form = e.currentTarget;
      const formData = new FormData(form)
      const data = Object.fromEntries(formData.entries())
      const processedData = {
        ...data,
        minStudents: Number(data['minStudents']),
        maxStudents: Number(data['maxStudents']),
        annualPrice: Number(data['annualPrice']),
        storageGb: Number(data['storageGb']),
      }
      if (tier) {
        const editPayload: TABLETYPE = {
          description: data['description'] as TABLETYPE['description'],
          organisationType: data['organisationType'] as TABLETYPE['organisationType'],
          planType: data['planType'] as TABLETYPE['planType'],
          minStudents: Number(data['minStudents']),
          maxStudents: Number(data['maxStudents']),
          annualPrice: Number(data['annualPrice']),
          storageGb: Number(data['storageGb']),
        }
        const res = await editPricingTiers({
          id: tier.id,
          editPayload
        }).unwrap()
        if (res?.success) {
          toast.success("Successfully Edited")
          setShowCreateModal(false)
        }
      }
      else {
        const res = await addPricingTiers(processedData).unwrap()
        if (res?.id) {
          toast.success('Successfully Added New Tiers')
          form.reset();
          setShowCreateModal(false)
        }
      }
    } catch (err) {
      console.error('Submitting Pricing Tier:', err);
      let message = 'Something went wrong';

      if (typeof err === 'object' && err !== null) {
        // RTK Query error
        if ('status' in err) {
          const apiError = err as FetchBaseQueryError;

          if (
            apiError.data &&
            typeof apiError.data === 'object' &&
            'message' in apiError.data
          ) {
            message = String(apiError.data.message);
          }
        }
      }

      toast.error(message);
    }
  }
  return (
    <Modal setModal={setShowCreateModal} title={tier ? 'Update Existing Tier' : 'Create New Tier'}>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Tier Name</label>
            <input
              type="text"
              name='description'
              defaultValue={tier?.description}
              required
              className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
              placeholder="e.g., 0-100 Students"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Organisation Type</label>
            <select
              required
              defaultValue={tier?.organisationType}
              name='organisationType'
              className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
            >
              <option value="">Select type...</option>
              <option value="SCHOOL">School</option>
              <option value="RTO">RTO</option>
              <option value="TAFE">TAFE</option>
              <option value="UNIVERSITY">University</option>
              <option value="CORPORATE">Corporate</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Plan Type</label>
            <select
              required
              defaultValue={tier?.planType}
              name='planType'
              className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
            >
              <option value="">Select plan...</option>
              <option value="BASIC">Basic</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Annual Price ($)</label>
            <input
              type="number"
              required
              defaultValue={tier?.annualPrice}
              min="0"
              step="100"
              name='annualPrice'
              className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
              placeholder="5000"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Min Students</label>
            <input
              type="number"
              required
              min="0"
              name='minStudents'
              defaultValue={tier?.minStudents}
              className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Max Students</label>
            <input
              type="number"
              required
              min="1"
              name='maxStudents'
              defaultValue={tier?.maxStudents}
              className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
              placeholder="100"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Storage (GB)</label>
            <input
              type="number"
              required
              min="1"
              name='storageGb'
              defaultValue={tier?.storageGb}
              className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
              placeholder="10"
            />
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setShowCreateModal(false)

            }}
            className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#044866] to-[#0D5468] text-white rounded-xl hover:shadow-lg transition-all"
          >
            {tier ? 'Update Tier' : 'Create Tier'}
          </button>
        </div>
      </form>
    </Modal>

  )

}
// src/app/pages/AdminDashboard/Components/SalesAgentForm.tsx
'use client'

import Modal from '@/app/components/Reusable/Modal'
import {
  useAddSalesAgentMutation,
  useEditSalesAgentMutation,
} from '@/Redux/services/SalesAgent'
import { toast } from 'sonner'
import { SalesAgentType } from '../../Types/AdminType'

export default function SalesAgentForm({
  modal,
  selectedAgent,
}: {
  modal: (value: boolean) => void
  selectedAgent: SalesAgentType | null
}) {
  const [addSalesAgent, { isLoading: addLoading }] = useAddSalesAgentMutation()
  const [editSalesAgent, { isLoading: editLoading }] = useEditSalesAgentMutation()

  const isLoading = addLoading || editLoading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phoneNumber: formData.get('phone') as string,
      role: formData.get('role') as string,
      password: formData.get('password') as string,
    }
    try {
      if (selectedAgent?.id) {
        await editSalesAgent({
          id: selectedAgent.id,
          data,
        }).unwrap()
        toast.success('Sales Agent updated')
      } else {
       const res = await addSalesAgent(data).unwrap()       
        toast.success('Sales Agent added')
      }
      modal(false)
    } catch (error) {
      console.log('Failed to add Sales Agent:', error)
      toast.error('Failed to add Sales Agent')
    }
  }

  return (
    <Modal
      setModal={modal}
      title={selectedAgent ? 'Edit Sales Agent' : 'Add Sales Agent'}
    >
      <form
        key={selectedAgent?.id ?? 'create'}
        className="space-y-5"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              required
              name="name"
              defaultValue={selectedAgent?.name ?? ''}
              className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
              placeholder="John Smith"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              name="email"
              defaultValue={selectedAgent?.email ?? ''}
              className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
              placeholder="john@skiltrak.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              required
              name="phone"
              defaultValue={selectedAgent?.phoneNumber ?? ''}
              className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
              placeholder="+61 4XX XXX XXX"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Role</label>
            <select
              required
              name="role"
              defaultValue={selectedAgent?.role ?? ''}
              className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
            >
              <option value="">Select role...</option>
              <option value="SALES_AGENT">Sales Agent</option>
              <option value="FINANCE">Senior Sales</option>
              <option value="SALES_MANAGER">Sales Manager</option>
            </select>
          </div>
        </div>

        <div>
          <label className=" block text-sm text-gray-700 mb-2">
            Temporary Password
          </label>
          <input
            type="text"
            required
            name="password"
            className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
            placeholder="••••••••"
          />

          <p className="text-xs text-gray-500 mt-1">
            User will be required to change password on first login
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => modal(false)}
            className="cursor-pointer flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer flex-1 px-6 py-3 bg-gradient-to-r from-[#044866] to-[#0D5468] text-white rounded-xl hover:shadow-lg transition-all"
          >
            {isLoading ? 'Creating...' : selectedAgent ? 'Update Sales Agent' : 'Add Sales Agent'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
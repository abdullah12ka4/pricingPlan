import Modal from "@/app/components/Reusable/Modal";
import { useAddOnsMutation, useEditAddOnsMutation } from "@/Redux/services/AddOns";
import { toast } from "sonner";
import { addons } from "../../Types/AdminType";


export function AddOnsForm({ setModal , addData}: { setModal: (show: boolean) => void , addData: addons | null}) {
  const [ addOns, { isLoading: addLoading } ] =  useAddOnsMutation()
  const [editEddOns, { isLoading: editLoading } ] = useEditAddOnsMutation();


  const isLoading = addLoading || editLoading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    const selectedPlan = data['availablePlans'];
    const processedData = {
      ...data,
      price: Number(data['price']),
      availablePlans: selectedPlan === 'both' ? ['BASIC', 'PREMIUM']: [selectedPlan],
    }
    try {
      if(addData?.id){
        const res = await editEddOns({id: addData.id, Addpayload: processedData}).unwrap() 
        if(res?.id){
          setModal(false)
          toast.success('Successfully Edited Add Ons') 
        }
      }
      else{
      const res = await addOns(processedData).unwrap()
      if (res?.id) {
        setModal(false)
        toast.success('Successfully Added New Tiers')
        form.reset();
        
      }  
      }
    } catch (error) {
      console.error("Error submitting pricing tier:", error);
    }
  }
  return (    
    <Modal setModal = {setModal}>
       <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm text-gray-700 mb-2">Add-on Name</label>
        <input
          type="text"
          name='name' 
          defaultValue={addData?.name}         
          required
          className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
          placeholder="e.g., AI Assistant Support"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-2">Description</label>
        <textarea
          required
          rows={3}
          name='description'
          defaultValue={addData?.description}
          className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
          placeholder="Describe the add-on features and benefits..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">Category</label>
          <select
            required
            name='category'
            defaultValue={addData?.category}            
            className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
          >
            <option value="">Select category...</option>
            <option value="AI & Automation">AI & Automation</option>
            <option value="Storage & Infrastructure">Storage & Infrastructure</option>
            <option value="Support & Services">Support & Services</option>
            <option value="Users & Access">Users & Access</option>
            <option value="Compliance & Security">Compliance & Security</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">Pricing Model</label>
          <select
          name='pricingModel'
          defaultValue={addData?.pricingModel}
            required
            className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
          >
            <option value="">Select model...</option>
            <option value="RECURRING">Recurring</option>
            <option value="ONE_TIME">One-time</option>
            <option value="PACK_BASED">Pack-based</option>
            <option value="SEAT_BASED">Seat-based</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">Price ($)</label>
          <input
            type="number"
            required
            min="0"
            name='price'
            defaultValue={addData?.price}
            className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
            placeholder="1500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">Billing Frequency</label>
          <select
          name='billingFrequency'
          defaultValue={addData?.billingFrequency}
            required
            className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
          >
            <option value="Annual">Annual</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">Subscription</label>
          <select
            name='availablePlans'
            defaultValue={addData?.availablePlans[0]}
            required
            className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
          >
            <option value="both">Both</option>
            <option value="PREMIUM">Premium</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => setModal(false)}
          className="cursor-pointer flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="cursor-pointer flex-1 px-6 py-3 bg-gradient-to-r from-[#044866] to-[#0D5468] text-white rounded-xl hover:shadow-lg transition-all"
        >
          {isLoading ? 'Creating...': addData ? 'Update Add-on':'Create Add-on'}
        </button>
      </div>
    </form>    
    </Modal>
  )

} 
import Modal from "@/app/components/Reusable/Modal";
import { useAddNetworkMutation, useEditNetworkMutation } from "@/Redux/services/NetworkModal";
import { toast } from "sonner";
import { NetworkType } from "../../Types/AdminType";

export default function NetworkPackForm({ modal, selectedNetwork }: { modal: (value: boolean) => void, selectedNetwork: NetworkType | null }) {
    const [addNetwork] = useAddNetworkMutation();
    const [editNetwork] = useEditNetworkMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            credits: Number(formData.get('credits')),
            pricePerCredit: Number(formData.get('pricePerCredit')),
            description: formData.get('description') as string,
        }
        try {
            if(selectedNetwork?.id){
                await editNetwork({id: selectedNetwork.id, editPayload: data}).unwrap();
                modal(false);  
                toast.success('Network package edited successfully!');           
            }
            else{
            const res = await addNetwork(data).unwrap();
            modal(false);  
            toast.success('Network package added successfully!'); 
                
            }
                
        } catch (error) {
            console.error("Add Network Error:", error);            
        }

    }

    return (
        <Modal setModal={modal}>
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm text-gray-700 mb-2">Package Name</label>
                    <input
                        type="text"
                        name='name'
                        defaultValue={selectedNetwork ? selectedNetwork.name : ''}
                        required
                        className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
                        placeholder="e.g., Small, Medium, Large"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-gray-700 mb-2">Credits</label>
                        <input
                            type="number"
                            required
                            min="1"
                            name='credits'
                            defaultValue={selectedNetwork ? selectedNetwork.credits : ''}
                            className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
                            placeholder="100"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 mb-2">Price per Credit ($)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            defaultValue={selectedNetwork ? selectedNetwork.pricePerCredit : ''}
                            name='pricePerCredit'
                            className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
                            placeholder="0.80"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-gray-700 mb-2">Description</label>
                    <textarea
                        required
                        rows={3}
                        name='description'
                        defaultValue={selectedNetwork ? selectedNetwork.description : ''}
                        className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
                        placeholder="Describe the package benefits..."
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => modal(false)}
                        className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-[#044866] to-[#0D5468] text-white rounded-xl hover:shadow-lg transition-all"
                    >
                        {selectedNetwork ? 'Save Changes' : 'Create Package'}
                    </button>
                </div>
            </form>
        </Modal>

    )
}

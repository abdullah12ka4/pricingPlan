import { FeatureType } from "@/app/pages/AdminDashboard/Components/Features/FeatureEditor";
import { useAddFeaturesMutation, useEditFeaturesMutation } from "@/Redux/services/Features";
import { toast } from "sonner";
import { useState } from "react";

export default function FeaturesForm({ modal, features }: { modal: (value: boolean) => void, features: FeatureType | null }) {
    const [editFeature] = useEditFeaturesMutation();
    const [addFeature] = useAddFeaturesMutation();

    // Local state to handle showing/hiding custom text input
    const [basicPlanOption, setBasicPlanOption] = useState(features ? features.basicPlan : "Not Included");
    const [premiumPlanOption, setPremiumPlanOption] = useState(features ? features.premiumPlan : "Not Included");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        modal(false);

        const data = new FormData(e.currentTarget);
        const formData: FeatureType = {
            name: data.get('name') as string,
            category: data.get('category') as string,
            description: data.get('description') as string,
            basicPlan: data.get('basicPlan') as "Included" | "Not Included",
            basicPlanText: data.get('basicPlanText') as string,
            premiumPlan: data.get('premiumPlan') as "Included" | "Not Included",
            premiumPlanText: data.get('premiumPlanText') as string,
        };

        try {
            if (features && features.id) {
                const res = await editFeature({ id: features.id, editPayload: formData }).unwrap();              
                const originalString = JSON.stringify(features);
                const responseString = JSON.stringify(res);
                if (originalString !== responseString) {
                    toast.success(`${res.name} updated successfully`);
                } else {
                    toast.error("No changes detected");
                }
            } else {
                const res = await addFeature(formData).unwrap();               
                if (res && res.name) {
                    toast.success(`${res.name} added successfully`);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update feature");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Feature Name</label>
                        <input
                            type="text"
                            name='name'
                            defaultValue={features ? features.name : ''}
                            className="w-full px-2.5 py-1.5 border border-[#044866]/20 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Category</label>
                        <input
                            type="text"
                            name='category'
                            defaultValue={features ? features.category : ''}
                            className="w-full px-2.5 py-1.5 border border-[#044866]/20 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs text-gray-600 mb-1">Description</label>
                    <input
                        type="text"
                        name='description'
                        defaultValue={features ? features.description : ''}
                        className="w-full px-2.5 py-1.5 border border-[#044866]/20 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {/* Basic Plan */}
                    <div className="flex flex-col gap-2">
                        <label className="block text-xs text-gray-600">Basic Plan</label>
                        <div className="flex gap-2 items-center">
                            <select
                                name='basicPlan'
                                defaultValue={features ? features.basicPlan : 'Not Included'}
                                onChange={(e) => setBasicPlanOption(e.target.value as 'Custom Text')}
                                className="px-2.5 py-1.5 border border-[#044866]/20 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                            >
                                <option value="Included">Included</option>
                                <option value="Not Included">Not Included</option>
                                <option value="Custom Text">Custom Text</option>
                            </select>
                            {/* Show input only if Custom Text is selected */}
                            {basicPlanOption === "Custom Text" && (
                                <input
                                    type="text"
                                    name='basicPlanText'
                                    defaultValue={features ? features.basicPlanText : ''}
                                    className="flex-1 px-2.5 py-1.5 border border-[#044866]/20 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                                    placeholder="Custom Basic Plan Text"
                                />
                            )}
                        </div>
                    </div>

                    {/* Premium Plan */}
                    <div className="flex flex-col gap-2">
                        <label className="block text-xs text-gray-600">Premium Plan</label>
                        <div className="flex gap-2 items-center">
                            <select
                                name='premiumPlan'
                                defaultValue={features ? features.premiumPlan : 'Not Included'}
                                onChange={(e) => setPremiumPlanOption(e.target.value as "Custom Text")}
                                className="px-2.5 py-1.5 border border-[#044866]/20 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                            >
                                <option value="Included">Included</option>
                                <option value="Not Included">Not Included</option>
                                <option value="Custom Text">Custom Text</option>
                            </select>
                            {/* Show input only if Custom Text is selected */}
                            {premiumPlanOption === "Custom Text" && (
                                <input
                                    type="text"
                                    name='premiumPlanText'
                                    defaultValue={features ? features.premiumPlanText : ''}
                                    className="flex-1 px-2.5 py-1.5 border border-[#044866]/20 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
                                    placeholder="Custom Premium Plan Text"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-8 justify-end items-center">
                    <button
                        type='submit'
                        className="px-3 py-1 text-sm border border-[#044866]/20 rounded hover:bg-[#044866]/5 text-[#044866] transition-colors"
                    >
                        Done
                    </button>
                    <button
                        type='button'
                        onClick={() => modal(false)}
                        className="px-3 py-1 text-sm border border-[#044866]/20 rounded hover:bg-[#044866]/5 text-[#044866] transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
}

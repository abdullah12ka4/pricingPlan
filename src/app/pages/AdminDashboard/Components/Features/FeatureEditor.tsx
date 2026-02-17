'use client'

import { useEffect, useState } from 'react';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import { useDeleteFeaturesMutation, useGetFeaturesQuery } from '@/Redux/services/Features';
import { Spinner } from '../../../../components/ui/spinner';
import FeaturesForm from '@/app/pages/AdminDashboard/Components/Features/FeaturesForm';
import { toast } from 'sonner';

export interface FeatureType {
  id?: string;
  name: string;
  category: string;
  description: string;
  basicPlan: "Included" | "Not Included" | "Custom Text";
  basicPlanText: string;
  premiumPlan: "Included" | "Not Included" | "Custom Text";
  premiumPlanText: string;
}

export function FeatureEditor() {
  const { data = [], isLoading, error } = useGetFeaturesQuery();
  const [deleteFeature] = useDeleteFeaturesMutation();

  const [editingFeatures, setEditingFeatures] = useState<FeatureType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentFeature, setCurrentFeature] = useState<FeatureType | null>(null);

  // Sync server data
  useEffect(() => {
    if (!data) return;

    setEditingFeatures(prev => {
      // prevent unnecessary updates
      if (JSON.stringify(prev) === JSON.stringify(data)) {
        return prev;
      }
      return data;
    });
  }, [data]);


  if (isLoading) return <div className="flex h-screen items-center justify-center"><Spinner /></div>;
  if (error && "status" in error) return <div className="text-red-500 h-screen flex items-center justify-center">Error {error.status}</div>;

  const categories = Array.from(new Set(editingFeatures.map(f => f.category || 'Other')));

  // Open modal for adding new feature
  const handleAddFeature = () => {
    setCurrentFeature(null); // null indicates new feature
    setShowModal(true);
  };

  // Open modal for editing existing feature
  const handleEdit = (feature: FeatureType) => {
    setCurrentFeature(feature);
    setShowModal(true);
  };

  // Delete feature
  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await deleteFeature(id).unwrap();
      setEditingFeatures(prev => prev.filter(f => f.id !== id));
      toast.success("Feature deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete feature");
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl text-[#044866]">Feature Matrix</h2>

      {showModal && <FeaturesForm modal={setShowModal} features={currentFeature} />}

{categories.length < 1 && <div className='h-[40vh] flex items-center justify-center '>
  No Features Added Yet
</div> }
      <div className="space-y-3.5">        
        {categories.map(category => (
          <div key={category} className="space-y-2">
            <h3 className="text-sm text-[#044866] border-b border-[#044866]/10 pb-2">{category}</h3>
            {editingFeatures
              .filter(f => (f.category || 'Other') === category)
              .map(f => (
                <div key={f.id} className="bg-white border border-[#044866]/10 rounded-lg p-3.5 flex justify-between items-start">
                  <div>
                    <div className="text-sm text-[#044866]">{f.name}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{f.description}</div>
                    <div className="flex gap-3.5 mt-1.5 text-xs">
                      <span>Basic: <span>{f.basicPlan === "Included" ? '✓' : f.basicPlan === 'Not Included' ? '✗' : ''} </span>{f.basicPlan === "Custom Text" ? f.basicPlanText : ''}</span>
                      <span>Premium: <span>{f.premiumPlan === "Included" ? '✓' : f.premiumPlan === 'Not Included' ? '✗' : ''} </span>{f.premiumPlan === "Custom Text" ? f.premiumPlanText : ''}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => handleEdit(f)} className="p-1.5 text-[#044866] hover:bg-[#044866]/5 rounded"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(f.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      <button
        onClick={handleAddFeature}
        className="flex items-center gap-2 px-3.5 py-2.5 border-2 border-dashed border-[#044866]/20 rounded-lg hover:border-[#044866]/40 hover:bg-[#044866]/5 w-full justify-center text-sm text-[#044866] transition-all"
      >
        <Plus className="w-3.5 h-3.5" /> Add New Feature
      </button>
    </div>
  );
}

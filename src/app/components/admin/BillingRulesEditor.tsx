import { useState } from 'react';
import { SetupFee, OverageRule } from '../../types/pricing';
import { Save } from 'lucide-react';

interface BillingRulesEditorProps {
  setupFee: SetupFee;
  overageRule: OverageRule;
  onSave: (setupFee: SetupFee, overageRule: OverageRule) => void;
}

export function BillingRulesEditor({ setupFee, overageRule, onSave }: BillingRulesEditorProps) {
  const [editingSetupFee, setEditingSetupFee] = useState<SetupFee>(setupFee);
  const [editingOverageRule, setEditingOverageRule] = useState<OverageRule>(overageRule);

  const handleSave = () => {
    onSave(editingSetupFee, editingOverageRule);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl text-[#044866]">Billing Rules</h2>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-[#044866] to-[#0D5468] text-white rounded-lg hover:shadow-lg transition-all text-sm"
        >
          <Save className="w-3.5 h-3.5" />
          Save Changes
        </button>
      </div>

      {/* Setup Fee */}
      <div className="bg-white border border-[#044866]/10 rounded-lg p-4">
        <h3 className="text-base text-[#044866] mb-3">Setup Fee</h3>
        <div className="grid md:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Amount (AUD)</label>
            <input
              type="number"
              value={editingSetupFee.amount}
              onChange={(e) => setEditingSetupFee({ ...editingSetupFee, amount: parseInt(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 border border-[#044866]/20 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Policy</label>
            <select
              value={editingSetupFee.policy}
              onChange={(e) => setEditingSetupFee({ ...editingSetupFee, policy: e.target.value as any })}
              className="w-full px-2.5 py-1.5 border border-[#044866]/20 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
            >
              <option value="new-customers">New Customers Only</option>
              <option value="always">Always Charged</option>
              <option value="never">Never Charged</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overage Rule */}
      <div className="bg-white border border-[#044866]/10 rounded-lg p-4">
        <h3 className="text-base text-[#044866] mb-3">Overage Billing</h3>
        <div className="grid md:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Rate Per Student (AUD)</label>
            <input
              type="number"
              value={editingOverageRule.ratePerStudent}
              onChange={(e) => setEditingOverageRule({ ...editingOverageRule, ratePerStudent: parseInt(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 border border-[#044866]/20 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Enforcement</label>
            <select
              value={editingOverageRule.enforcement}
              onChange={(e) => setEditingOverageRule({ ...editingOverageRule, enforcement: e.target.value as any })}
              className="w-full px-2.5 py-1.5 border border-[#044866]/20 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
            >
              <option value="auto-bill">Auto Bill</option>
              <option value="hard-limit">Hard Limit</option>
              <option value="warn-only">Warn Only</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Grace Threshold</label>
            <input
              type="number"
              value={editingOverageRule.graceThreshold}
              onChange={(e) => setEditingOverageRule({ ...editingOverageRule, graceThreshold: parseInt(e.target.value) || 0 })}
              className="w-full px-2.5 py-1.5 border border-[#044866]/20 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 text-sm text-[#044866] cursor-pointer">
              <input
                type="checkbox"
                checked={editingOverageRule.enabled}
                onChange={(e) => setEditingOverageRule({ ...editingOverageRule, enabled: e.target.checked })}
                className="w-4 h-4 accent-[#044866]"
              />
              Enable Overage Billing
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

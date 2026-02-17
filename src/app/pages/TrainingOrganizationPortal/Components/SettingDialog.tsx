import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Building, Settings } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { CreditCard } from "lucide-react";
import { Bell } from "lucide-react";

export const SettingDialog = ({ mockPackageInfo, setShowSettingsDialog }: { mockPackageInfo: any, setShowSettingsDialog: (value: boolean) => void }) => {
    return (
        <DialogContent className="max-w-2xl max-h-[calc(100vh-1rem)] overflow-y-auto">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                    <Settings className="w-5 h-5 text-[#044866]" />
                    Organization Settings
                </DialogTitle>
                <DialogDescription>
                    Manage your organization profile, preferences, and notification settings.
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
                {/* Organization Profile */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <Building className="w-4 h-4 text-[#044866]" />
                        Organization Profile
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-slate-700 mb-1 block">Organization Name</label>
                            <Input
                                defaultValue={mockPackageInfo.orgName}
                                className="h-9 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-700 mb-1 block">Organization Type</label>
                            <Input
                                defaultValue={mockPackageInfo.orgType}
                                className="h-9 text-sm"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-700 mb-1 block">Contact Email</label>
                            <Input
                                type="email"
                                defaultValue="admin@melbournecollege.edu.au"
                                className="h-9 text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-700 mb-1 block">Contact Phone</label>
                            <Input
                                type="tel"
                                defaultValue="+61 3 9123 4567"
                                className="h-9 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#044866]" />
                        Notification Preferences
                    </h3>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-slate-900">Low Credit Alerts</p>
                                <p className="text-xs text-slate-600">Notify when credits fall below 20%</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-[#044866]" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-slate-900">Billing Reminders</p>
                                <p className="text-xs text-slate-600">Receive reminders before billing dates</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-[#044866]" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-slate-900">Student Placement Updates</p>
                                <p className="text-xs text-slate-600">Get notified of successful placements</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-[#044866]" />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-slate-900">System Updates</p>
                                <p className="text-xs text-slate-600">Important system announcements</p>
                            </div>
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-[#044866]" />
                        </div>
                    </div>
                </div>

                {/* Billing Settings */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#044866]" />
                        Billing Information
                    </h3>
                    <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <p className="text-sm font-medium text-slate-900">Current Payment Method</p>
                                <p className="text-xs text-slate-600">Visa ending in 4242</p>
                            </div>
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                                Update
                            </Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-900">Billing Address</p>
                                <p className="text-xs text-slate-600">123 Education St, Melbourne VIC 3000</p>
                            </div>
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                                Edit
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                    <Button
                        className="flex-1 bg-[#044866] hover:bg-[#0D5468] text-white"
                        onClick={() => {
                            setShowSettingsDialog(false);
                            // In a real app, save settings here
                        }}
                    >
                        Save Changes
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowSettingsDialog(false)}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </DialogContent>
    );
};
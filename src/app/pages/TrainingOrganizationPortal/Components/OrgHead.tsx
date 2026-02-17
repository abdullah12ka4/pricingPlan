import { Button } from "@/app/components/ui/button";
import { Award, Badge, Building, Calendar, CheckCircle, Clock, Package, Settings, Zap } from "lucide-react";


const OrgHead = ({ mockPackageInfo, credit, setShowCreditRefillDialog, setShowSettingsDialog }: { mockPackageInfo: any, credit: boolean, setShowCreditRefillDialog: (value: boolean) => void, setShowSettingsDialog: (value: boolean) => void }) => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#044866] via-[#0D5468] to-[#044866] rounded-xl shadow-xl border border-white/10">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#F7A619]/15 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 p-4">
                {/* Top Section: Organization Info */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-lg flex-shrink-0">
                            <Building className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-white mb-1.5">{mockPackageInfo.orgName}</h1>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-[10px] px-2 py-0.5 h-5 font-medium">
                                    <Building className="w-2.5 h-2.5 mr-1" />
                                    {mockPackageInfo.orgType}
                                </Badge>
                                <Badge className="bg-[#F7A619] text-white border-0 text-[10px] px-2 py-0.5 h-5 font-medium shadow-md">
                                    <Award className="w-2.5 h-2.5 mr-1" />
                                    {mockPackageInfo.tier}
                                </Badge>
                                <Badge className="bg-emerald-500/90 text-white border-0 text-[10px] px-2 py-0.5 h-5 font-medium">
                                    <CheckCircle className="w-2.5 h-2.5 mr-1" />
                                    Verified
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm h-8 text-xs"
                           onClick={() => setShowCreditRefillDialog(true)}
                        >
                            <Zap className="w-3.5 h-3.5 mr-1.5" />
                            Buy Credits
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white hover:bg-white/95 text-[#044866] border-white h-8 text-xs font-medium shadow-lg"
                           onClick={() => setShowSettingsDialog(true)}
                        >
                            <Settings className="w-3.5 h-3.5 mr-1.5" />
                            Settings
                        </Button>
                    </div>
                </div>

                {/* Bottom Section: Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Package Info */}
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                                <Package className="w-3.5 h-3.5 text-white" />
                            </div>
                            <p className="text-white/70 text-[10px] font-medium uppercase tracking-wide">Current Package</p>
                        </div>
                        <p className="text-base font-bold text-white mb-1">{mockPackageInfo.name}</p>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                            <span className="text-[10px] text-white/80">Active • Renews {mockPackageInfo.renewalDate}</span>
                        </div>
                    </div>

                    {/* Credits Status */}
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                                <Zap className="w-3.5 h-3.5 text-[#F7A619]" />
                            </div>
                            <p className="text-white/70 text-[10px] font-medium uppercase tracking-wide">Network Credits</p>
                        </div>
                        <div className="flex items-baseline gap-2 mb-1">
                            <p className="text-base font-bold text-white">{mockPackageInfo.remainingCredits}</p>
                            <span className="text-[10px] text-white/60">of {mockPackageInfo.totalCredits} remaining</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${credit ? 'bg-red-400' : 'bg-emerald-400'}`}
                                style={{ width: `${((mockPackageInfo.remainingCredits / mockPackageInfo.totalCredits) * 100).toFixed(0)}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Billing Cycle */}
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                                <Calendar className="w-3.5 h-3.5 text-white" />
                            </div>
                            <p className="text-white/70 text-[10px] font-medium uppercase tracking-wide">Billing Cycle</p>
                        </div>
                        <p className="text-base font-bold text-white mb-1 capitalize">{mockPackageInfo.billingCycle}</p>
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-white/60" />
                            <span className="text-[10px] text-white/80">Next billing: {mockPackageInfo.renewalDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrgHead;
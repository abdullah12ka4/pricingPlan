import { motion } from "motion/react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Sparkles, Zap, Clock, CheckCircle } from "lucide-react";

export function OverView() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-3"
        >
            <Card className="border border-[#044866]/20 bg-gradient-to-br from-[#044866]/5 via-white to-[#F7A619]/5 overflow-hidden">
                <CardContent className="p-2.5">
                    <div className="flex items-start gap-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-[#044866] mb-0">
                                How SkilTrak Network Credits Work
                            </h3>
                            <p className="text-[10px] text-slate-700 mb-1 leading-tight">
                                SkilTrak uses a simple, transparent credit system. <strong className="text-[#044866]">1 credit = 1 student matched to an industry placement.</strong> No complex pricing tiers or hidden fees—just predictable, per-match pricing that scales with your needs.
                            </p>

                            <div className="grid md:grid-cols-2 gap-2">
                                <div>
                                    <div className="flex items-center gap-1 mb-0.5">
                                        <div className="w-3.5 h-3.5 bg-[#F7A619]/10 rounded flex items-center justify-center">
                                            <Zap className="w-2 h-2 text-[#F7A619]" />
                                        </div>
                                        <p className="text-[10px] font-semibold text-[#044866]">What You Get Per Credit</p>
                                    </div>
                                    <ul className="space-y-0 ml-4">
                                        <li className="text-[10px] text-slate-700 flex items-start gap-0.5 leading-[1.3]">
                                            <CheckCircle className="w-2 h-2 text-emerald-600 mt-[3px] flex-shrink-0" />
                                            <span>AI-powered student-to-industry matching</span>
                                        </li>
                                        <li className="text-[10px] text-slate-700 flex items-start gap-0.5 leading-[1.3]">
                                            <CheckCircle className="w-2 h-2 text-emerald-600 mt-[3px] flex-shrink-0" />
                                            <span>Unlimited placement opportunity searches</span>
                                        </li>
                                        <li className="text-[10px] text-slate-700 flex items-start gap-0.5 leading-[1.3]">
                                            <CheckCircle className="w-2 h-2 text-emerald-600 mt-[3px] flex-shrink-0" />
                                            <span>Automated placement notifications</span>
                                        </li>
                                        <li className="text-[10px] text-slate-700 flex items-start gap-0.5 leading-[1.3]">
                                            <CheckCircle className="w-2 h-2 text-emerald-600 mt-[3px] flex-shrink-0" />
                                            <span>Comprehensive tracking and reporting</span>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <div className="flex items-center gap-1 mb-0.5">
                                        <div className="w-3.5 h-3.5 bg-[#044866]/10 rounded flex items-center justify-center">
                                            <Clock className="w-2 h-2 text-[#044866]" />
                                        </div>
                                        <p className="text-[10px] font-semibold text-[#044866]">Billing & Credit Details</p>
                                    </div>
                                    <ul className="space-y-0 ml-4">
                                        <li className="text-[10px] text-slate-700 flex items-start gap-0.5 leading-[1.3]">
                                            <CheckCircle className="w-2 h-2 text-emerald-600 mt-[3px] flex-shrink-0" />
                                            <span>Quarterly billing cycle (every 3 months)</span>
                                        </li>
                                        <li className="text-[10px] text-slate-700 flex items-start gap-0.5 leading-[1.3]">
                                            <CheckCircle className="w-2 h-2 text-emerald-600 mt-[3px] flex-shrink-0" />
                                            <span>Credits expire at end of each quarter</span>
                                        </li>
                                        <li className="text-[10px] text-slate-700 flex items-start gap-0.5 leading-[1.3]">
                                            <CheckCircle className="w-2 h-2 text-emerald-600 mt-[3px] flex-shrink-0" />
                                            <span>Volume discounts available (save up to 19%)</span>
                                        </li>
                                        <li className="text-[10px] text-slate-700 flex items-start gap-0.5 leading-[1.3]">
                                            <CheckCircle className="w-2 h-2 text-emerald-600 mt-[3px] flex-shrink-0" />
                                            <span>Low balance alerts at 20 credits remaining</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
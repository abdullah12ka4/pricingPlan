import { AnimatePresence, motion } from "motion/react";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { TrendingDown, Zap } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export function LowAlert({ mockPackageInfo, setShowCreditRefillDialog, setShowTierExpiryDialog }: { mockPackageInfo: any, setShowCreditRefillDialog: (value: boolean) => void, setShowTierExpiryDialog: (value: boolean) => void }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Alert className="border border-red-300 bg-gradient-to-r from-red-50 to-orange-50 shadow-md">
                    <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <TrendingDown className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <AlertTitle className="text-red-900 font-semibold text-sm mb-1">
                                ⚠️ Low Credit Balance Alert
                            </AlertTitle>
                            <AlertDescription className="text-red-700 mb-2 text-xs leading-tight">
                                You have only <strong>{mockPackageInfo.remainingCredits} credits</strong> remaining. Purchase a top-up now to avoid service interruption and continue matching students to industry placements.
                            </AlertDescription>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    className="bg-[#F7A619] hover:bg-[#F7A619]/90 text-white shadow-md h-7 text-xs"
                                onClick={() => setShowCreditRefillDialog(true)}
                                >
                                    <Zap className="w-3 h-3 mr-1.5" />
                                    Purchase Credits Now
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-red-300 text-red-700 hover:bg-red-50 h-7 text-xs"
                                onClick={() => setShowTierExpiryDialog(true)}
                                >
                                    View Pricing Options
                                </Button>
                            </div>
                        </div>
                    </div>
                </Alert>
            </motion.div>
        </AnimatePresence>
    );
}
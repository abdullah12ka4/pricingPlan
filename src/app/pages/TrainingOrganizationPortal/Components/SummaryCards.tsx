import { motion } from "motion/react";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { AlertCircle, CheckCircle, Clock, Users, Zap } from "lucide-react";
import { Progress } from "@/app/components/ui/progress";


export function SummaryCards({ mockPackageInfo, credit }: { mockPackageInfo: any , credit:boolean}) {
    const usagePercentage = (mockPackageInfo.usedCredits / mockPackageInfo.totalCredits) * 100;
    const uniqueStudents = new Set(mockPackageInfo.studentIds).size;
    const totalPaid = mockPackageInfo.paidAmount;
    const totalPending = mockPackageInfo.pendingAmount;
    const totalOverdue = mockPackageInfo.overdueAmount;
    return (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Credits Remaining */}
          <Card className={`relative overflow-hidden border transition-all hover:shadow-md ${
            credit 
              ? 'border-red-200 bg-gradient-to-br from-red-50 to-white' 
              : 'border-[#044866]/20 bg-gradient-to-br from-blue-50/50 to-white hover:border-[#044866]/40'
          }`}>
            <CardContent className="p-2.5">
              <div className="flex items-start justify-between mb-1.5">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
                  credit ? 'bg-red-100' : 'bg-[#044866]/10'
                }`}>
                  <Zap className={`w-4 h-4 ${credit ? 'text-red-600' : 'text-[#044866]'}`} />
                </div>
                {credit && (
                  <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 text-[10px] px-1 py-0 h-4">
                    <AlertCircle className="w-2 h-2 mr-0.5" />
                    Low
                  </Badge>
                )}
              </div>
              <p className="text-[10px] text-slate-600 mb-0.5">Credits Remaining</p>
              <p className={`text-2xl font-bold mb-1 ${credit ? 'text-red-600' : 'text-[#044866]'}`}>
                {mockPackageInfo.remainingCredits}
              </p>
              <div className="space-y-1">
                <Progress value={usagePercentage} className="h-1" />
                <p className="text-[10px] text-slate-500 leading-tight">
                  {mockPackageInfo.usedCredits} of {mockPackageInfo.totalCredits} used ({usagePercentage.toFixed(0)}%)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Total Paid */}
          <Card className="relative overflow-hidden border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-white hover:shadow-md transition-all hover:border-emerald-300">
            <CardContent className="p-2.5">
              <div className="flex items-start justify-between mb-1.5">
                <div className="w-7 h-7 bg-emerald-100 rounded-md flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
              <p className="text-[10px] text-slate-600 mb-0.5">Total Paid</p>
              <p className="text-2xl font-bold text-emerald-600">
                ${totalPaid}
              </p>
            </CardContent>
          </Card>

          {/* Outstanding */}
          <Card className="relative overflow-hidden border border-amber-200/60 bg-gradient-to-br from-amber-50/50 to-white hover:shadow-md transition-all hover:border-amber-300">
            <CardContent className="p-2.5">
              <div className="flex items-start justify-between mb-1.5">
                <div className="w-7 h-7 bg-amber-100 rounded-md flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                {totalOverdue > 0 && (
                  <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 text-[10px] px-1 py-0 h-4">
                    Overdue
                  </Badge>
                )}
              </div>
              <p className="text-[10px] text-slate-600 mb-0.5">Outstanding</p>
              <p className="text-2xl font-bold text-amber-600 mb-1">
                ${(totalPending + totalOverdue).toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                {totalOverdue > 0 ? `$${totalOverdue} overdue` : 'All payments current'}
              </p>
            </CardContent>
          </Card>

          {/* Active Students */}
          <Card className="relative overflow-hidden border border-purple-200/60 bg-gradient-to-br from-purple-50/50 to-white hover:shadow-md transition-all hover:border-purple-300">
            <CardContent className="p-2.5">
              <div className="flex items-start justify-between mb-1.5">
                <div className="w-7 h-7 bg-purple-100 rounded-md flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300 text-[10px] px-1 py-0 h-4">
                  Active
                </Badge>
              </div>
              <p className="text-[10px] text-slate-600 mb-0.5">Active Students</p>
              <p className="text-2xl font-bold text-purple-600 mb-1">
                {uniqueStudents}
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                Last 7 days
              </p>
            </CardContent>
          </Card>
        </motion.div>
    )
    
}
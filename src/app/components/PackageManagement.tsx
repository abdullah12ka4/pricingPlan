import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings, ChevronDown, Building, Award, Sparkles, Users, Zap, Package,
  Info, CheckCircle, Clock, Calendar, TrendingUp, AlertCircle, ExternalLink,
  FileText, History, CreditCard, ShieldCheck, ChevronRight, DollarSign, User
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { useGetNetworkQuery } from '@/Redux/services/NetworkModal';
import { Spinner } from './ui/spinner';
import { CardNumberElementComponent } from '@stripe/react-stripe-js';

interface PackageManagementProps {
  mockPackageInfo: any;
  mockPackageHistory: any[];
  subscription: any[];
  selectedAddOns: any;
  setSelectedAddOns: (addOns: any) => void;
  setShowCreditRefillDialog: (show: boolean) => void;
  setShowTierExpiryDialog: (show: boolean) => void;
}

export function PackageManagement({
  mockPackageInfo,
  subscription,
  mockPackageHistory,
  selectedAddOns,
  setSelectedAddOns,
  setShowCreditRefillDialog,
  setShowTierExpiryDialog
}: PackageManagementProps) {
  const [showPackageManagement, setShowPackageManagement] = useState(false);
  console.log("SUBSCRIPTION IN PACKAGe", subscription)
  const [activePackageTab, setActivePackageTab] = useState<'overview' | 'addons' | 'history'>('overview');

  const studentCapacityPercentage = (mockPackageInfo.annualLicense.currentStudents / mockPackageInfo.annualLicense.studentCapacity.max) * 100;
  const isNearCapacity = studentCapacityPercentage > 80;
  // console.log("mockPackgage", mockPackageInfo)

  const { data: networkData, isLoading: networkLoading } = useGetNetworkQuery()
  if (networkLoading) {
    return <div className="flex h-screen items-center justify-center"><Spinner /></div>;
  }

  console.log(networkData)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="mb-3"
    >
      <Card className="border border-slate-200/60 bg-white shadow-md overflow-hidden">
        <button
          onClick={() => setShowPackageManagement(!showPackageManagement)}
          className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-lg flex items-center justify-center">
              <Settings className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-[#044866]">Package & Plan Management</h3>
              <p className="text-[10px] text-slate-600">Manage subscription, licensing, pricing tier, and add-ons</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 text-[10px] px-1.5 py-0.5">
              {mockPackageInfo.status === 'active' ? 'Active' : mockPackageInfo.status}
            </Badge>
            <motion.div
              animate={{ rotate: showPackageManagement ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </motion.div>
          </div>
        </button>

        <AnimatePresence>
          {showPackageManagement && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="p-3 border-t border-slate-100 bg-slate-50/30">
                {/* Tab Navigation */}
                <Tabs value={activePackageTab} onValueChange={(value: any) => setActivePackageTab(value)} className="w-full">
                  <TabsList className="bg-slate-100/80 p-0.5 h-auto w-full grid grid-cols-3 mb-3">
                    <TabsTrigger
                      value="overview"
                      className="data-[state=active]:bg-[#044866] data-[state=active]:text-white px-2 py-1.5 rounded-md font-medium transition-all text-xs"
                    >
                      <Package className="w-3 h-3 mr-1" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      value="addons"
                      className="data-[state=active]:bg-[#044866] data-[state=active]:text-white px-2 py-1.5 rounded-md font-medium transition-all text-xs"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Add-ons
                    </TabsTrigger>
                    <TabsTrigger
                      value="history"
                      className="data-[state=active]:bg-[#044866] data-[state=active]:text-white px-2 py-1.5 rounded-md font-medium transition-all text-xs"
                    >
                      <History className="w-3 h-3 mr-1" />
                      History
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-3 mt-0">
                    {/* Annual License & Subscription Info */}
                    <div className="grid md:grid-cols-2 gap-2.5">
                      {/* Annual License Card */}
                      <div className="bg-gradient-to-br from-[#044866]/5 via-white to-[#F7A619]/5 rounded-lg border border-[#044866]/20 p-2.5">
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-md flex items-center justify-center">
                            <ShieldCheck className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-[#044866]">Annual License</h4>
                            <p className="text-[9px] text-slate-600">{mockPackageInfo.annualLicense.type} Tier</p>
                          </div>
                        </div>

                        <div className="space-y-1.5 mb-2">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-600">License Period</span>
                            <span className="font-medium text-slate-900">
                              {new Date(mockPackageInfo.annualLicense.startDate).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })} - {new Date(mockPackageInfo.annualLicense.endDate).toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-600">Annual Fee</span>
                            <span className="font-semibold text-[#044866]">${mockPackageInfo.annualLicense.price.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-600">Setup Fee</span>
                            <div className="flex items-center gap-1">
                              <span className={mockPackageInfo.annualLicense.setupFeePaid ? 'text-slate-400 line-through' : 'font-medium text-slate-900'}>
                                ${mockPackageInfo.annualLicense.setupFee}
                              </span>
                              {mockPackageInfo.annualLicense.setupFeePaid && (
                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 text-[9px] px-1 py-0 h-3.5">
                                  Paid
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200">
                          <p className="text-[9px] text-slate-600 mb-1">Student Capacity</p>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-[#044866]">
                              {mockPackageInfo.annualLicense.currentStudents} / {mockPackageInfo.annualLicense.studentCapacity.max}
                            </span>
                            <span className="text-[9px] text-slate-600">
                              {studentCapacityPercentage.toFixed(0)}% utilized
                            </span>
                          </div>
                          <Progress value={studentCapacityPercentage} className="h-1.5 mb-1" />
                          {isNearCapacity && (
                            <div className="flex items-center gap-1 text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                              <AlertCircle className="w-2.5 h-2.5" />
                              <span>Near capacity - consider upgrading</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Subscription Details Card */}
                      <div className="bg-white rounded-lg border border-slate-200 p-2.5">
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                            <Calendar className="w-3 h-3 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-[#044866]">Subscription Details</h4>
                            <p className="text-[9px] text-slate-600">{mockPackageInfo.subscription.contractLength} contract</p>
                          </div>
                        </div>

                        <div className="space-y-1.5 mb-2">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-600">Contract Start</span>
                            <span className="font-medium text-slate-900">
                              {new Date(mockPackageInfo.subscription.startDate).toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-600">Next Billing</span>
                            <span className="font-semibold text-[#044866]">
                              {new Date(mockPackageInfo.subscription.nextBillingDate).toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-600">Auto-Renewal</span>
                            <Badge className={`text-[9px] px-1 py-0 h-3.5 ${mockPackageInfo.subscription.autoRenew ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                              {mockPackageInfo.subscription.autoRenew ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-600">Cancel Deadline</span>
                            <span className="font-medium text-slate-900">
                              {new Date(mockPackageInfo.subscription.cancellationDeadline).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-[10px] h-6 mt-1"
                        >
                          Manage Subscription
                        </Button>
                      </div>
                    </div>

                    {/* Organization & Tier */}
                    <div className="grid md:grid-cols-2 gap-2.5">
                      {/* Organization Type */}
                      <div className="bg-white rounded-lg border border-slate-200 p-2.5">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Building className="w-3.5 h-3.5 text-[#044866]" />
                          <h4 className="text-xs font-semibold text-[#044866]">Organization Type</h4>
                        </div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <p className="text-xs font-medium text-slate-900">{mockPackageInfo.orgType}</p>
                            <p className="text-[10px] text-slate-600">Registered Training Organisation</p>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 text-[10px] px-1.5 py-0.5">
                            <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
                            Verified
                          </Badge>
                        </div>

                        {/* Compliance Status */}
                        <div className="mt-2 pt-2 border-t border-slate-100">
                          <div className="flex items-center gap-1 mb-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <p className="text-[9px] font-medium text-slate-700">Compliance Status</p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {mockPackageInfo.complianceStatus.certifications.map((cert: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="bg-emerald-50/50 text-emerald-700 border-emerald-200 text-[9px] px-1 py-0">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-[9px] text-slate-500 mt-1">
                            Last audit: {new Date(mockPackageInfo.complianceStatus.lastAudit).toLocaleDateString('en-AU')}
                          </p>
                        </div>
                      </div>

                      {/* Current Pricing Tier */}
                      <div className="bg-white rounded-lg border border-slate-200 p-2.5">
                        <div className="flex items-center gap-1.5 mb-2">
                          <Award className="w-3.5 h-3.5 text-[#F7A619]" />
                          <h4 className="text-xs font-semibold text-[#044866]">Current Pricing Tier</h4>
                        </div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div>
                            <p className="text-xs font-medium text-slate-900">{mockPackageInfo.tier}</p>
                            <p className="text-[10px] text-slate-600">Based on student volume</p>
                          </div>
                          <Badge className="bg-[#F7A619]/10 text-[#F7A619] border-[#F7A619]/30 text-[10px] px-1.5 py-0.5">
                            Active
                          </Badge>
                        </div>

                        {/* Tier Benefits */}
                        <div className="mt-2 pt-2 border-t border-slate-100">
                          <p className="text-[9px] font-medium text-slate-700 mb-1">Tier Benefits</p>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-[9px] text-slate-600">
                              <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                              <span>Volume discount: 10% off credits</span>
                            </div>
                            <div className="flex items-center gap-1 text-[9px] text-slate-600">
                              <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                              <span>Priority email support</span>
                            </div>
                            <div className="flex items-center gap-1 text-[9px] text-slate-600">
                              <CheckCircle className="w-2.5 h-2.5 text-emerald-600" />
                              <span>Quarterly business reviews</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-[10px] h-6 mt-2 border-[#044866]/20 text-[#044866] hover:bg-[#044866]/5"
                          onClick={() => setShowTierExpiryDialog(true)}
                        >
                          Change Tier
                        </Button>
                      </div>
                    </div>

                    {/* Overage Billing Summary */}
                    {/* {mockPackageInfo.overages.totalYTD.credits > 0 && (
                      <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-lg border border-amber-200/60 p-2.5">
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 bg-amber-100 rounded-md flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-3 h-3 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-semibold text-amber-900 mb-1">Overage Billing Summary</h4>
                            <p className="text-[10px] text-amber-800 leading-tight mb-2">
                              You used <strong>{mockPackageInfo.overages.totalYTD.credits} additional credits</strong> this year beyond your quarterly allocation.
                            </p>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <div className="bg-white/60 rounded px-2 py-1">
                                <p className="text-[9px] text-slate-600">Q4 2023 Overage</p>
                                <p className="text-xs font-semibold text-amber-900">
                                  {mockPackageInfo.overages.q4_2023.credits} credits
                                </p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <span className="text-[9px] text-slate-600">${mockPackageInfo.overages.q4_2023.cost}</span>
                                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 text-[8px] px-1 py-0">
                                    Paid
                                  </Badge>
                                </div>
                              </div>
                              <div className="bg-white/60 rounded px-2 py-1">
                                <p className="text-[9px] text-slate-600">YTD Total</p>
                                <p className="text-xs font-semibold text-amber-900">
                                  {mockPackageInfo.overages.totalYTD.credits} credits
                                </p>
                                <p className="text-[9px] text-slate-600 mt-0.5">${mockPackageInfo.overages.totalYTD.cost}</p>
                              </div>
                            </div>
                            <p className="text-[9px] text-amber-700 flex items-center gap-1">
                              <Info className="w-2.5 h-2.5" />
                              Overage credits are billed at $19/credit at end of quarter
                            </p>
                          </div>
                        </div>
                      </div>
                    )} */}

                    {/* Network Credit Packages */}
                    <div className="bg-white rounded-lg border border-slate-200 p-2.5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-[#044866]" />
                          <h4 className="text-xs font-semibold text-[#044866]">Network Credit Packages</h4>
                        </div>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-[9px] px-1.5 py-0.5">
                          Quarterly Billing
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">

                        {networkData.map((network: any, index: number) => (
                          <div key={index} className="relative p-2 rounded-lg border-2 border-slate-200 bg-gradient-to-br from-purple-50/50 to-white hover:border-purple-300 transition-all group">
                            {network?.isBestValue && <Badge className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-[9px] px-1.5 py-0.5">
                              Best Value
                            </Badge>}
                            <div className="text-center mb-1.5 mt-1">
                              <p className={`text-xs font-semibold ${index === 0 ? 'text-black-700': index === 1 ? 'text-blue-900':'text-purple-900'} `}>{network?.name}</p>
                              <p className="text-[10px] text-slate-600">{network?.description}</p>
                            </div>
                            <div className="text-center mb-1.5">
                              <p className={`text-xl font-bold  ${index === 0 ? 'text-black-700': index === 1 ? 'text-blue-900':'text-purple-900'}`}>{network?.credits}</p>
                              <p className="text-[10px] text-slate-600">credits/quarter</p>
                            </div>
                            <div className="text-center mb-1.5">
                              <p className="text-sm font-semibold text-slate-900">${network?.totalPrice}</p>
                              <p className={`text-[9px] ${network?.savingsPercent ? "text-emerald-600" : "text-slate-600"}`}>${network?.pricePerCredit} per credit {network?.savingsPercent}</p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-[10px] h-6 border-purple-300 text-purple-700 hover:bg-purple-50 group-hover:border-purple-400"
                            >
                              Upgrade Now
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-2 p-2 bg-blue-50/50 rounded-md border border-blue-200/60">
                        <div className="flex items-start gap-1.5">
                          <Info className="w-3 h-3 text-blue-600 mt-[1px] flex-shrink-0" />
                          <div>
                            <p className="text-[10px] text-blue-900 leading-tight">
                              <strong>Package Changes:</strong> Upgrades are effective immediately with prorated billing. Downgrades take effect at the start of your next billing quarter.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Add-ons Tab */}
                  <TabsContent value="addons" className="space-y-2.5 mt-0">
                    <div className="bg-white rounded-lg border border-slate-200 p-2.5">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-[#044866]">Available Add-ons & Enhancements</h4>
                        <Badge className="bg-purple-100 text-purple-700 border-purple-300 text-[9px] px-1.5 py-0.5">
                          {Object.values(selectedAddOns).filter((a: any) => a.enabled).length} Active
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {/* AI Calls Add-on */}
                        <div className="flex items-start gap-2 p-2 rounded-md border border-slate-200 bg-gradient-to-r from-blue-50/50 to-white">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <Sparkles className="w-3 h-3 text-blue-600" />
                              <p className="text-xs font-medium text-slate-900">AI-Powered Matching API Credits</p>
                              <Badge className={`text-[9px] px-1 py-0 h-3.5 ${selectedAddOns.aiCalls.enabled ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                                {selectedAddOns.aiCalls.enabled ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-[10px] text-slate-600 leading-tight mb-1">
                              Enhanced AI matching algorithms for better placement outcomes and student satisfaction
                            </p>
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="text-[10px]">
                                <span className="font-semibold text-[#044866]">{selectedAddOns.aiCalls.quantity} calls/month</span>
                                <span className="text-slate-600"> • $4.50 per call</span>
                              </div>
                              <div className="text-[10px] text-emerald-600 font-medium">
                                Save 15% vs. pay-as-you-go
                              </div>
                            </div>
                          </div>
                          <Button
                            variant={selectedAddOns.aiCalls.enabled ? "outline" : "default"}
                            size="sm"
                            className={`text-[10px] h-6 px-2 ${selectedAddOns.aiCalls.enabled ? 'border-red-300 text-red-700 hover:bg-red-50' : 'bg-[#044866] hover:bg-[#0D5468] text-white'}`}
                            onClick={() => setSelectedAddOns({
                              ...selectedAddOns,
                              aiCalls: { ...selectedAddOns.aiCalls, enabled: !selectedAddOns.aiCalls.enabled }
                            })}
                          >
                            {selectedAddOns.aiCalls.enabled ? 'Remove' : 'Add'}
                          </Button>
                        </div>

                        {/* Admin Support Add-on */}
                        <div className="flex items-start gap-2 p-2 rounded-md border border-slate-200 bg-gradient-to-r from-purple-50/50 to-white">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <Users className="w-3 h-3 text-purple-600" />
                              <p className="text-xs font-medium text-slate-900">Premium Admin Support to Students</p>
                              <Badge className={`text-[9px] px-1 py-0 h-3.5 ${selectedAddOns.adminSupport.enabled ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
                                {selectedAddOns.adminSupport.enabled ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                            <p className="text-[10px] text-slate-600 leading-tight mb-1">
                              Dedicated support team to assist your students with placement applications and onboarding
                            </p>
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="text-[10px]">
                                <span className="font-semibold text-[#044866]">Priority support</span>
                                <span className="text-slate-600"> • $249/month</span>
                              </div>
                              <div className="text-[10px] text-slate-600">
                                Includes: Email, chat & phone support
                              </div>
                            </div>
                          </div>
                          <Button
                            variant={selectedAddOns.adminSupport.enabled ? "outline" : "default"}
                            size="sm"
                            className={`text-[10px] h-6 px-2 ${selectedAddOns.adminSupport.enabled ? 'border-red-300 text-red-700 hover:bg-red-50' : 'bg-[#044866] hover:bg-[#0D5468] text-white'}`}
                            onClick={() => setSelectedAddOns({
                              ...selectedAddOns,
                              adminSupport: { ...selectedAddOns.adminSupport, enabled: !selectedAddOns.adminSupport.enabled }
                            })}
                          >
                            {selectedAddOns.adminSupport.enabled ? 'Remove' : 'Add'}
                          </Button>
                        </div>

                        {/* Network Credits Top-up */}
                        <div className="flex items-start gap-2 p-2 rounded-md border border-slate-200 bg-gradient-to-r from-amber-50/50 to-white">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <Zap className="w-3 h-3 text-[#F7A619]" />
                              <p className="text-xs font-medium text-slate-900">Network Credits Top-up</p>
                              <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-[9px] px-1 py-0 h-3.5">
                                On-Demand
                              </Badge>
                            </div>
                            <p className="text-[10px] text-slate-600 leading-tight mb-1">
                              Purchase additional credits mid-quarter as needed - no minimum purchase required
                            </p>
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="text-[10px]">
                                <span className="font-semibold text-[#044866]">Flexible pricing</span>
                                <span className="text-slate-600"> • From $15/credit</span>
                              </div>
                              <div className="text-[10px] text-slate-600">
                                Volume discounts: 50+ credits save 10%
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="default"
                            size="sm"
                            className="text-[10px] h-6 px-2 bg-gradient-to-r from-[#F7A619] to-orange-500 hover:from-[#F7A619]/90 hover:to-orange-500/90 text-white"
                            onClick={() => setShowCreditRefillDialog(true)}
                          >
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Add-ons Summary */}
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 rounded-lg border border-slate-200 p-2.5">
                      <h4 className="text-xs font-semibold text-slate-900 mb-2">Current Add-ons Summary</h4>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-600">AI Matching Credits</span>
                          <span className="font-medium text-slate-900">
                            {selectedAddOns.aiCalls.enabled ? `$${(selectedAddOns.aiCalls.quantity * 4.5).toFixed(2)}/mo` : '--'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-600">Premium Support</span>
                          <span className="font-medium text-slate-900">
                            {selectedAddOns.adminSupport.enabled ? '$249.00/mo' : '--'}
                          </span>
                        </div>
                        <div className="pt-1.5 border-t border-slate-300 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-900">Monthly Total</span>
                          <span className="font-bold text-[#044866]">
                            ${(
                              (selectedAddOns.aiCalls.enabled ? selectedAddOns.aiCalls.quantity * 4.5 : 0) +
                              (selectedAddOns.adminSupport.enabled ? 249 : 0)
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* History Tab */}
                  <TabsContent value="history" className="space-y-2.5 mt-0">
                    <div className="bg-white rounded-lg border border-slate-200 p-2.5">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-[#044866]">Package Change History & Audit Trail</h4>
                        <Button variant="outline" size="sm" className="text-[10px] h-6 px-2">
                          <FileText className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {mockPackageHistory.map((item) => (
                          <div key={item.id} className="flex gap-2 pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                            <div className="flex flex-col items-center">
                              <div className="w-6 h-6 bg-gradient-to-br from-[#044866]/10 to-[#F7A619]/10 rounded-full flex items-center justify-center border border-[#044866]/20">
                                <div className="w-2 h-2 bg-[#044866] rounded-full"></div>
                              </div>
                              {item.id !== mockPackageHistory[mockPackageHistory.length - 1].id && (
                                <div className="w-0.5 h-full bg-slate-200 my-1"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-0.5">
                                <p className="text-xs font-medium text-slate-900">{item.action}</p>
                                <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-[9px] px-1 py-0">
                                  v{item.version}
                                </Badge>
                              </div>
                              <p className="text-[10px] text-slate-600 leading-tight mb-1">{item.details}</p>
                              <div className="flex items-center gap-2 text-[9px] text-slate-500">
                                <div className="flex items-center gap-0.5">
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>{new Date(item.date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-0.5">
                                  <User className="w-2.5 h-2.5" />
                                  <span>{item.performedBy}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50/50 rounded-lg border border-blue-200/60 p-2.5">
                      <div className="flex items-start gap-1.5">
                        <Info className="w-3 h-3 text-blue-600 mt-[1px] flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-medium text-blue-900 mb-0.5">Version Control & Audit Trail</p>
                          <p className="text-[9px] text-blue-800 leading-tight">
                            All package modifications are logged and versioned. Contact support to revert to a previous configuration or view detailed change logs.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
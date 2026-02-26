import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Users, Zap, TrendingDown, Download, Filter, Calendar, Search, User, Clock, MapPin, FileText, BookOpen, Info, DollarSign, CheckCircle, XCircle, AlertCircle, Send, Eye, TrendingUp, Package, CreditCard, Bell, Settings, RefreshCw, BarChart3, Award, Building, Phone, Mail, ExternalLink, ChevronRight, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { PackageManagement } from '@/app/components/PackageManagement';
import Header from './Components/OrgHead';
import { SummaryCards } from './Components/SummaryCards';
import { LowAlert } from './Components/LowAlert';
import { OverView } from './Components/OverView';
import { InvoiceTable } from './Components/InvoiceTable';
import { SettingDialog } from './Components/SettingDialog';
import { InvoiceViewModal } from './Components/InvoiceViewModal';
import { useGetOrganizationQuery } from '@/Redux/services/Organization';
import { useGetOrgBalanceQuery, useUsageCreditQuery } from '@/Redux/services/NetworkModal';
import { Spinner } from '@/app/components/ui/spinner';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetInvoiceByOrgIdQuery } from '@/Redux/services/Invoice';
import { useGetSubscriptionQuery } from '@/Redux/services/Subscription';
import { buildPackageInfo } from './Data/PackageInfo';

interface TrainingOrgPortalProps {
    onBack: () => void;
    org: any;
    subscription: any;
}

const transformUsageData = (usageData: any) => {
    if (!usageData?.usage || usageData.usage.length === 0) return [];

    return usageData.usage.map((item: any, index: number) => {
        const date = new Date(item.timestamp);
        const dateStr = date.toISOString().split('T')[0];
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        const month = date.getMonth();
        const year = date.getFullYear();
        let quarter = '';
        if (month < 3) quarter = `Q1 ${year}`;
        else if (month < 6) quarter = `Q2 ${year}`;
        else if (month < 9) quarter = `Q3 ${year}`;
        else quarter = `Q4 ${year}`;

        return {
            id: item.id || String(index + 1),
            studentName: `Student ${item.studentId}`,
            studentId: item.studentId,
            course: item.course,
            activity: 'Placement Matching',
            creditsUsed: item.creditsUsed,
            industry: item.industry,
            date: dateStr,
            time: timeStr,
            placement: item.placementOrg,
            status: 'completed',
            quarter: quarter
        };
    }).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const generateQuarterlyData = (balanceData: any, usageData: any) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    let currentQuarter = '';
    let currentPeriod = '';
    if (currentMonth < 3) {
        currentQuarter = `Q1 ${currentYear}`;
        currentPeriod = `Jan - Mar ${currentYear}`;
    } else if (currentMonth < 6) {
        currentQuarter = `Q2 ${currentYear}`;
        currentPeriod = `Apr - Jun ${currentYear}`;
    } else if (currentMonth < 9) {
        currentQuarter = `Q3 ${currentYear}`;
        currentPeriod = `Jul - Sep ${currentYear}`;
    } else {
        currentQuarter = `Q4 ${currentYear}`;
        currentPeriod = `Oct - Dec ${currentYear}`;
    }

    const totalCredits = balanceData?.totalCredits || 100;
    const remainingCredits = balanceData?.remainingCredits || 0;
    const creditsUsed = totalCredits - remainingCredits;

    return [
        {
            quarter: currentQuarter,
            period: currentPeriod,
            creditsBought: totalCredits,
            creditsUsed: creditsUsed,
            extraUsed: creditsUsed > totalCredits ? creditsUsed - totalCredits : 0,
            remaining: remainingCredits,
            status: 'current'
        }
    ];
};

const mockPackageHistory = [
    { id: 1, date: '2024-01-01', action: 'Package Activated', details: 'Growth Package (100 credits/quarter) activated', performedBy: 'Admin User', version: '1.0' },
    { id: 2, date: '2023-10-15', action: 'Add-on Added', details: 'AI-Powered Matching API Credits (100 calls/month)', performedBy: 'Admin User', version: '1.1' },
    { id: 3, date: '2023-07-01', action: 'Tier Upgraded', details: 'Upgraded from Tier 1 to Tier 2 (Student volume: 342)', performedBy: 'System Auto-Upgrade', version: '2.0' }
];

export const getStatusBadge = (status: string) => {
    switch (status) {
        case 'paid':
            return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>;
        case 'sent':
            return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium"><Send className="w-3 h-3 mr-1" />Sent</Badge>;
        case 'pending':
            return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-medium"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
        case 'overdue':
            return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-medium"><XCircle className="w-3 h-3 mr-1" />Overdue</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export function TrainingOrgPortal({ onBack, org, subscription }: TrainingOrgPortalProps) {
    const { data: invoiceData, isLoading: isLoadingInvoice } = useGetInvoiceByOrgIdQuery(org?.id);
    const { data: organizationData, isLoading: isLoadingOrganization } = useGetOrganizationQuery({ id: org?.id });
    const { data: subscriptionData, isLoading: isLoadingSubscription } = useGetSubscriptionQuery({ id: subscription?.id });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterActivity, setFilterActivity] = useState('all');
    const [filterIndustry, setFilterIndustry] = useState('all');
    const [filterDateRange, setFilterDateRange] = useState('all');
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    // ✅ FIX: start with empty array, populate via useEffect (not useState callback)
    const [expandedQuarters, setExpandedQuarters] = useState<string[]>([]);

    const [invoiceSearch, setInvoiceSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const mapInvoices = (apiInvoices: any[]) => {
        if (!apiInvoices) return [];
        return apiInvoices.map((inv: any) => ({
            id: inv.invoiceNumber,
            description: inv.items?.[0]?.description || '',
            lineItems: inv.items.map((item: any) => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: Number(item.unitPrice),
                amount: Number(item.totalPrice),
            })),
            subtotal: Number(inv.subtotal),
            tax: Number(inv.gstAmount),
            taxRate: Number(inv.gstRate),
            amount: Number(inv.totalAmount),
            issueDate: inv.issuedDate,
            dueDate: inv.dueDate,
            paidDate: inv.paidDate,
            status: inv.status?.toLowerCase(),
            paymentMethod: inv.paymentMethod || '',
            paymentReference: inv.paymentReference || '',
            notes: inv.notes || '',
        }));
    };

    const mockInvoices = mapInvoices(invoiceData);

    const [selectedInvoice, setSelectedInvoice] = useState<typeof mockInvoices[0] | null>(null);
    const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
    const [showCreditRefillDialog, setShowCreditRefillDialog] = useState(false);
    const [showTierExpiryDialog, setShowTierExpiryDialog] = useState(false);
    const [selectedCreditPack, setSelectedCreditPack] = useState<string | null>(null);
    const [showPackageManagement, setShowPackageManagement] = useState(false);
    const [selectedAddOns, setSelectedAddOns] = useState({
        aiCalls: { enabled: true, quantity: 100 },
        adminSupport: { enabled: false, quantity: 0 },
        creditTopup: { enabled: false, quantity: 0 }
    });
    const [activePackageTab, setActivePackageTab] = useState<'overview' | 'addons' | 'history'>('overview');
    const [showSettingsDialog, setShowSettingsDialog] = useState(false);

    const { data: balanceData, isLoading: isLoadingBalance } = useGetOrgBalanceQuery(org?.id);
    const { data: usageData, isLoading: isLoadingUsage } = useUsageCreditQuery(
        org?.id ? { orgId: org.id, limit: 100, page: 1, fromDate: '', toDate: '' } : skipToken
    );

    const isLoading = isLoadingOrganization || isLoadingBalance || isLoadingUsage || isLoadingInvoice || isLoadingSubscription;

    const mockCreditUsage = transformUsageData(usageData);
    const mockQuarterlyData = generateQuarterlyData(balanceData, usageData);

    const mockPackageInfo = buildPackageInfo(subscriptionData, organizationData?.data, balanceData);

    // ✅ FIX: use useEffect (not useState) to auto-expand the first quarter once data loads
    useEffect(() => {
        if (mockQuarterlyData.length > 0 && expandedQuarters.length === 0) {
            setExpandedQuarters([mockQuarterlyData[0].quarter]);
        }
    // Only run when quarterly data first populates
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mockQuarterlyData.length]);

    const industries = ['all', ...Array.from(new Set(mockCreditUsage.map((u: any) => u.industry)))];

    const isWithinDateRange = (dateStr: string) => {
        if (filterDateRange === 'all') return true;
        const date = new Date(dateStr);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        switch (filterDateRange) {
            case '7days': return daysDiff <= 7;
            case '30days': return daysDiff <= 30;
            case 'quarter': return daysDiff <= 90;
            default: return true;
        }
    };

    const filteredUsage = mockCreditUsage.filter((usage: any) => {
        const matchesSearch = usage.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usage.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usage.placement.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usage.course.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesActivity = filterActivity === 'all' || usage.activity === filterActivity;
        const matchesIndustry = filterIndustry === 'all' || usage.industry === filterIndustry;
        const matchesDateRange = isWithinDateRange(usage.date);
        return matchesSearch && matchesActivity && matchesIndustry && matchesDateRange;
    });

    const groupedByQuarter = filteredUsage.reduce((acc: any, usage: any) => {
        if (!acc[usage.quarter]) acc[usage.quarter] = [];
        acc[usage.quarter].push(usage);
        return acc;
    }, {} as Record<string, typeof filteredUsage>);

    const activeFiltersCount = [filterActivity, filterIndustry, filterDateRange].filter(f => f !== 'all').length + (searchTerm ? 1 : 0);
    const hasActiveFilters = activeFiltersCount > 0;

    const clearAllFilters = () => {
        setSearchTerm('');
        setFilterActivity('all');
        setFilterIndustry('all');
        setFilterDateRange('all');
    };

    const toggleQuarter = (quarter: string) => {
        setExpandedQuarters(prev =>
            prev.includes(quarter) ? prev.filter(q => q !== quarter) : [...prev, quarter]
        );
    };

    const totalCreditsUsed = filteredUsage.reduce((sum: any, usage: any) => sum + usage.creditsUsed, 0);
    const uniqueStudents = new Set(filteredUsage.map((u: any) => u.studentId)).size;

    const usagePercentage = mockPackageInfo.totalCredits > 0
        ? (mockPackageInfo.usedCredits / mockPackageInfo.totalCredits) * 100
        : 0;
    const isLowCredit = mockPackageInfo.remainingCredits <= 20;

    const exportCreditCSV = () => {
        const headers = ['Date', 'Time', 'Student Name', 'Student ID', 'Course', 'Activity', 'Industry', 'Placement', 'Credits Used', 'Status', 'Quarter'];
        const rows = filteredUsage.map((u: any) => [
            u.date, u.time, u.studentName, u.studentId, u.course, u.activity,
            u.industry, u.placement, u.creditsUsed.toString(), u.status, u.quarter
        ]);
        const csvContent = [headers.join(','), ...rows.map((row: any) => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `credit-usage-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center"><Spinner /></div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-2">
                    <div className="flex items-center justify-between">
                        <motion.button
                            onClick={onBack}
                            className="flex items-center gap-1.5 text-slate-600 hover:text-[#044866] transition-colors group text-sm"
                            whileHover={{ x: -4 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:text-[#044866]" />
                            <span className="font-medium">Back to Dashboard</span>
                        </motion.button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-3">
                {organizationData?.success && <>
                    <motion.div className="mb-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Header setShowCreditRefillDialog={setShowCreditRefillDialog} setShowSettingsDialog={setShowSettingsDialog} credit={isLowCredit} mockPackageInfo={mockPackageInfo} />
                    </motion.div>

                    <SummaryCards invoices={mockInvoices} credit={isLowCredit} mockPackageInfo={mockPackageInfo} />

                    {isLowCredit && (
                        <LowAlert setShowCreditRefillDialog={setShowCreditRefillDialog} setShowTierExpiryDialog={setShowTierExpiryDialog} mockPackageInfo={mockPackageInfo} />
                    )}

                    <OverView />
                </>}

                <PackageManagement
                    mockPackageInfo={mockPackageInfo}
                    mockPackageHistory={mockPackageHistory}
                    selectedAddOns={selectedAddOns}
                    setSelectedAddOns={setSelectedAddOns}
                    setShowCreditRefillDialog={setShowCreditRefillDialog}
                    setShowTierExpiryDialog={setShowTierExpiryDialog}
                />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                    <Tabs defaultValue="credits" className="w-full">
                        <div className="mb-3">
                            <TabsList className="bg-slate-100/80 p-0.5 h-auto w-full grid grid-cols-2">
                                <TabsTrigger value="credits" className="data-[state=active]:bg-[#044866] data-[state=active]:text-white px-3 py-1.5 rounded-md font-medium transition-all text-xs">
                                    <Zap className="w-3 h-3 mr-1.5" />Credit Usage
                                </TabsTrigger>
                                <TabsTrigger value="invoices" className="data-[state=active]:bg-[#044866] data-[state=active]:text-white px-3 py-1.5 rounded-md font-medium transition-all text-xs">
                                    <DollarSign className="w-3 h-3 mr-1.5" />Invoices & Payments
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="credits">
                            <Card className="border border-slate-200/60 shadow-md bg-white">
                                <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-3 pt-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg text-[#044866] mb-1">Credit Usage History</CardTitle>
                                            <CardDescription className="text-xs">
                                                Track all student placement matchings grouped by quarter with {mockCreditUsage.length} total entries
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <Button variant="outline" size="sm" onClick={exportCreditCSV} className="gap-1.5 border-[#044866]/20 text-[#044866] hover:bg-[#044866]/5 h-7 text-xs px-2">
                                                <Download className="w-3 h-3" />Export CSV
                                            </Button>
                                            <Button size="sm" onClick={() => setShowCreditRefillDialog(true)} className="gap-1.5 bg-gradient-to-r from-[#F7A619] to-orange-500 hover:from-[#F7A619]/90 hover:to-orange-500/90 text-white h-7 text-xs px-2">
                                                <Zap className="w-3 h-3" />Buy Credits
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3">
                                    <div className="mb-3">
                                        <div className="flex flex-col lg:flex-row gap-2 mb-2">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                                <Input
                                                    placeholder="Search students, courses, placements, or industries..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-9 h-8 border-slate-200 focus:border-[#044866] focus:ring-[#044866]/20 text-xs"
                                                />
                                                {searchTerm && (
                                                    <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <Select value={filterDateRange} onValueChange={setFilterDateRange}>
                                                <SelectTrigger className="w-full lg:w-[180px] h-8 border-slate-200 text-xs">
                                                    <Calendar className="w-3.5 h-3.5 mr-2" />
                                                    <SelectValue placeholder="Date range" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Time</SelectItem>
                                                    <SelectItem value="7days">Last 7 Days</SelectItem>
                                                    <SelectItem value="30days">Last 30 Days</SelectItem>
                                                    <SelectItem value="quarter">This Quarter</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                                                <SelectTrigger className="w-full lg:w-[180px] h-8 border-slate-200 text-xs">
                                                    <Building className="w-3.5 h-3.5 mr-2" />
                                                    <SelectValue placeholder="Industry" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">All Sectors</SelectItem>
                                                    {industries.filter((i: any) => i !== 'all').map((industry: any) => (
                                                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-full lg:w-auto">
                                                <button onClick={() => setViewMode('table')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-xs ${viewMode === 'table' ? 'bg-white shadow-sm text-[#044866]' : 'text-slate-600 hover:text-slate-900'}`}>
                                                    <FileText className="w-3.5 h-3.5" />
                                                    <span className="hidden sm:inline font-medium">Table</span>
                                                </button>
                                                <button onClick={() => setViewMode('cards')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-all text-xs ${viewMode === 'cards' ? 'bg-white shadow-sm text-[#044866]' : 'text-slate-600 hover:text-slate-900'}`}>
                                                    <Package className="w-3.5 h-3.5" />
                                                    <span className="hidden sm:inline font-medium">Cards</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between flex-wrap gap-3">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {hasActiveFilters && (
                                                    <>
                                                        <span className="text-sm text-slate-600 font-medium">{filteredUsage.length} result{filteredUsage.length !== 1 ? 's' : ''}</span>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            {searchTerm && (
                                                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1.5">
                                                                    Search: "{searchTerm.substring(0, 20)}{searchTerm.length > 20 ? '...' : ''}"
                                                                    <button onClick={() => setSearchTerm('')} className="hover:text-blue-900"><XCircle className="w-3 h-3" /></button>
                                                                </Badge>
                                                            )}
                                                            {filterDateRange !== 'all' && (
                                                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 gap-1.5">
                                                                    {filterDateRange === '7days' ? 'Last 7 Days' : filterDateRange === '30days' ? 'Last 30 Days' : 'This Quarter'}
                                                                    <button onClick={() => setFilterDateRange('all')} className="hover:text-purple-900"><XCircle className="w-3 h-3" /></button>
                                                                </Badge>
                                                            )}
                                                            {filterIndustry !== 'all' && (
                                                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5">
                                                                    {filterIndustry}
                                                                    <button onClick={() => setFilterIndustry('all')} className="hover:text-emerald-900"><XCircle className="w-3 h-3" /></button>
                                                                </Badge>
                                                            )}
                                                            {filterActivity !== 'all' && (
                                                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1.5">
                                                                    {filterActivity}
                                                                    <button onClick={() => setFilterActivity('all')} className="hover:text-amber-900"><XCircle className="w-3 h-3" /></button>
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-slate-600 hover:text-slate-900 h-7 px-2">Clear all</Button>
                                                    </>
                                                )}
                                                {!hasActiveFilters && (
                                                    <span className="text-sm text-slate-600">Showing all {mockCreditUsage.length} credit usage entries</span>
                                                )}
                                            </div>

                                            {filteredUsage.length > 0 && (
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1.5">
                                                        <Users className="w-4 h-4 text-purple-600" />
                                                        <span className="font-semibold text-purple-600">{uniqueStudents}</span>
                                                        <span className="text-slate-600">students</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Zap className="w-4 h-4 text-[#F7A619]" />
                                                        <span className="font-semibold text-[#F7A619]">{totalCreditsUsed}</span>
                                                        <span className="text-slate-600">credits</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {filteredUsage.length === 0 ? (
                                        <div className="text-center py-16">
                                            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
                                                {hasActiveFilters ? <Search className="w-10 h-10 text-slate-400" /> : <Zap className="w-10 h-10 text-slate-400" />}
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                                {hasActiveFilters ? 'No matching results' : 'No credit usage yet'}
                                            </h3>
                                            <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                                {hasActiveFilters
                                                    ? "Try adjusting your filters or search terms to find what you're looking for."
                                                    : 'Credit usage will appear here once students are matched to industry placements.'}
                                            </p>
                                            {hasActiveFilters && (
                                                <Button variant="outline" onClick={clearAllFilters} className="gap-2">
                                                    <RefreshCw className="w-4 h-4" />Clear all filters
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {mockQuarterlyData.map((quarter, qIndex) => {
                                                const quarterEntries = groupedByQuarter[quarter.quarter] || [];
                                                const isExpanded = expandedQuarters.includes(quarter.quarter);
                                                const hasEntries = quarterEntries.length > 0;

                                                return (
                                                    <motion.div
                                                        key={quarter.quarter}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.3, delay: qIndex * 0.1 }}
                                                        className={`relative overflow-hidden rounded-2xl border-2 ${quarter.status === 'current' ? 'border-[#F7A619] bg-gradient-to-br from-[#F7A619]/5 via-orange-50/30 to-white' : 'border-slate-200 bg-white'}`}
                                                    >
                                                        <div className="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${quarter.status === 'current' ? 'bg-gradient-to-br from-[#F7A619] to-orange-500' : 'bg-gradient-to-br from-[#044866] to-[#0D5468]'}`}>
                                                                        <BarChart3 className="w-5 h-5 text-white" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="flex items-center gap-2">
                                                                            <h3 className="text-lg font-bold text-[#044866]">{quarter.quarter}</h3>
                                                                            {quarter.status === 'current' && (
                                                                                <Badge className="bg-[#F7A619] text-white">
                                                                                    <Sparkles className="w-3 h-3 mr-1" />Current
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-sm text-slate-600">{quarter.period}</p>
                                                                    </div>
                                                                </div>

                                                                {hasEntries && (
                                                                    <Button variant="ghost" size="sm" onClick={() => toggleQuarter(quarter.quarter)} className="gap-2">
                                                                        {isExpanded ? (
                                                                            <><ChevronUp className="w-4 h-4" />Hide {quarterEntries.length} Entries</>
                                                                        ) : (
                                                                            <><ChevronDown className="w-4 h-4" />Show {quarterEntries.length} Entries</>
                                                                        )}
                                                                    </Button>
                                                                )}
                                                            </div>

                                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                                <div className="p-3 bg-blue-50 rounded-lg">
                                                                    <div className="flex items-center gap-2 mb-1"><Package className="w-4 h-4 text-blue-600" /><span className="text-xs font-medium text-slate-700">Bought</span></div>
                                                                    <span className="text-2xl font-bold text-blue-600">{quarter.creditsBought}</span>
                                                                </div>
                                                                <div className="p-3 bg-emerald-50 rounded-lg">
                                                                    <div className="flex items-center gap-2 mb-1"><Zap className="w-4 h-4 text-emerald-600" /><span className="text-xs font-medium text-slate-700">Used</span></div>
                                                                    <span className="text-2xl font-bold text-emerald-600">{quarter.creditsUsed}</span>
                                                                </div>
                                                                <div className={`p-3 rounded-lg ${quarter.extraUsed > 0 ? 'bg-red-50 border border-red-200' : 'bg-slate-50'}`}>
                                                                    <div className="flex items-center gap-2 mb-1"><AlertCircle className={`w-4 h-4 ${quarter.extraUsed > 0 ? 'text-red-600' : 'text-slate-400'}`} /><span className="text-xs font-medium text-slate-700">Overage</span></div>
                                                                    <span className={`text-2xl font-bold ${quarter.extraUsed > 0 ? 'text-red-600' : 'text-slate-400'}`}>{quarter.extraUsed > 0 ? `+${quarter.extraUsed}` : quarter.extraUsed}</span>
                                                                </div>
                                                                <div className={`p-3 rounded-lg ${quarter.status === 'current' && quarter.remaining <= 20 ? 'bg-amber-50 border border-amber-200' : 'bg-slate-100'}`}>
                                                                    <div className="flex items-center gap-2 mb-1"><TrendingUp className={`w-4 h-4 ${quarter.status === 'current' && quarter.remaining <= 20 ? 'text-amber-600' : 'text-slate-600'}`} /><span className="text-xs font-medium text-slate-700">Remaining</span></div>
                                                                    <span className={`text-2xl font-bold ${quarter.status === 'current' && quarter.remaining <= 20 ? 'text-amber-600' : 'text-slate-600'}`}>{quarter.remaining}</span>
                                                                </div>
                                                                <div className="p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                                                                    <div className="flex items-center gap-2 mb-1"><BarChart3 className="w-4 h-4 text-purple-600" /><span className="text-xs font-medium text-slate-700">Usage Rate</span></div>
                                                                    <span className="text-2xl font-bold text-purple-600">
                                                                        {quarter.creditsBought > 0 ? ((quarter.creditsUsed / quarter.creditsBought) * 100).toFixed(0) : 0}%
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="mt-4">
                                                                <div className="relative w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        className={`absolute top-0 left-0 h-full rounded-full ${quarter.extraUsed > 0 ? 'bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'}`}
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${Math.min(quarter.creditsBought > 0 ? (quarter.creditsUsed / quarter.creditsBought) * 100 : 0, 100)}%` }}
                                                                        transition={{ duration: 1, delay: qIndex * 0.1 + 0.3 }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <AnimatePresence>
                                                            {isExpanded && hasEntries && (
                                                                <motion.div
                                                                    initial={{ height: 0, opacity: 0 }}
                                                                    animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }}
                                                                    transition={{ duration: 0.3 }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    {viewMode === 'table' ? (
                                                                        <div className="overflow-x-auto">
                                                                            <Table>
                                                                                <TableHeader>
                                                                                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-200">
                                                                                        <TableHead className="text-[#044866] font-semibold text-xs"><div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" />Date & Time</div></TableHead>
                                                                                        <TableHead className="text-[#044866] font-semibold text-xs"><div className="flex items-center gap-2"><User className="w-3.5 h-3.5" />Student</div></TableHead>
                                                                                        <TableHead className="text-[#044866] font-semibold text-xs"><div className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" />Course</div></TableHead>
                                                                                        <TableHead className="text-[#044866] font-semibold text-xs"><div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" />Industry & Placement</div></TableHead>
                                                                                        <TableHead className="text-[#044866] font-semibold text-xs text-right"><div className="flex items-center justify-end gap-2"><Zap className="w-3.5 h-3.5" />Credits</div></TableHead>
                                                                                    </TableRow>
                                                                                </TableHeader>
                                                                                <TableBody>
                                                                                    {quarterEntries.map((usage: any, index: any) => (
                                                                                        <motion.tr
                                                                                            key={usage.id}
                                                                                            initial={{ opacity: 0, y: 10 }}
                                                                                            animate={{ opacity: 1, y: 0 }}
                                                                                            transition={{ duration: 0.2, delay: index * 0.02 }}
                                                                                            className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors"
                                                                                        >
                                                                                            <TableCell>
                                                                                                <div className="flex flex-col gap-0.5">
                                                                                                    <span className="font-medium text-[#044866] text-sm">{usage.date}</span>
                                                                                                    <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{usage.time}</span>
                                                                                                </div>
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <div className="flex flex-col gap-0.5">
                                                                                                    <span className="font-medium text-slate-900 text-sm">{usage.studentName}</span>
                                                                                                    <span className="text-xs text-slate-500">{usage.studentId}</span>
                                                                                                </div>
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <div className="flex items-start gap-2 max-w-xs">
                                                                                                    <BookOpen className="w-3.5 h-3.5 text-[#F7A619] mt-0.5 flex-shrink-0" />
                                                                                                    <span className="text-sm text-slate-700">{usage.course}</span>
                                                                                                </div>
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <div className="flex flex-col gap-1.5">
                                                                                                    <Badge className="bg-[#F7A619]/10 text-[#F7A619] border-[#F7A619]/30 w-fit text-xs">{usage.industry}</Badge>
                                                                                                    <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-slate-400" /><span className="text-sm text-slate-600">{usage.placement}</span></div>
                                                                                                </div>
                                                                                            </TableCell>
                                                                                            <TableCell className="text-right">
                                                                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#F7A619]/10 to-orange-100/50 rounded-full border border-[#F7A619]/20">
                                                                                                    <Zap className="w-3.5 h-3.5 text-[#F7A619]" />
                                                                                                    <span className="font-bold text-[#F7A619] text-sm">{usage.creditsUsed}</span>
                                                                                                </div>
                                                                                            </TableCell>
                                                                                        </motion.tr>
                                                                                    ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="p-4 grid md:grid-cols-2 gap-4">
                                                                            {quarterEntries.map((usage: any, index: any) => (
                                                                                <motion.div
                                                                                    key={usage.id}
                                                                                    initial={{ opacity: 0, y: 20 }}
                                                                                    animate={{ opacity: 1, y: 0 }}
                                                                                    transition={{ duration: 0.3, delay: index * 0.03 }}
                                                                                    className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-[#044866]/20 transition-all"
                                                                                >
                                                                                    <div className="flex items-start justify-between mb-3 pb-3 border-b border-slate-100">
                                                                                        <div className="flex items-start gap-2.5">
                                                                                            <div className="w-9 h-9 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                                                <User className="w-4 h-4 text-purple-600" />
                                                                                            </div>
                                                                                            <div>
                                                                                                <p className="font-semibold text-slate-900 text-sm mb-0.5">{usage.studentName}</p>
                                                                                                <p className="text-xs text-slate-500">{usage.studentId}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-[#F7A619]/10 to-orange-100/50 rounded-full border border-[#F7A619]/20">
                                                                                            <Zap className="w-3 h-3 text-[#F7A619]" />
                                                                                            <span className="font-bold text-[#F7A619] text-sm">{usage.creditsUsed}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="space-y-2.5">
                                                                                        <div className="flex items-start gap-2">
                                                                                            <Calendar className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                                                                                            <div>
                                                                                                <p className="text-sm font-medium text-[#044866]">{usage.date}</p>
                                                                                                <p className="text-xs text-slate-500">{usage.time}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="flex items-start gap-2">
                                                                                            <BookOpen className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                                                                                            <p className="text-sm text-slate-700">{usage.course}</p>
                                                                                        </div>
                                                                                        <div className="flex items-start gap-2">
                                                                                            <Building className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                                                                                            <div className="flex-1">
                                                                                                <Badge className="bg-[#F7A619]/10 text-[#F7A619] border-[#F7A619]/30 mb-1.5 text-xs">{usage.industry}</Badge>
                                                                                                <div className="flex items-center gap-1">
                                                                                                    <MapPin className="w-3 h-3 text-slate-400" />
                                                                                                    <p className="text-sm text-slate-600">{usage.placement}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </motion.div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>

                                                        {!hasEntries && (
                                                            <div className="p-8 text-center border-t border-slate-200">
                                                                <p className="text-sm text-slate-500">No credit usage entries found for this quarter with current filters</p>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="invoices">
                            <InvoiceTable setSelectedInvoice={setSelectedInvoice} setShowInvoiceDialog={setShowInvoiceDialog} mockInvoices={mockInvoices} />
                        </TabsContent>
                    </Tabs>
                </motion.div>

                <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
                    <InvoiceViewModal selectedInvoice={selectedInvoice} />
                </Dialog>

                {/* ✅ FIX: removed broken h-screen overflow-scroll wrapper around dialog */}
                <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
                    <SettingDialog mockPackageInfo={mockPackageInfo} setShowSettingsDialog={setShowSettingsDialog} />
                </Dialog>
            </div>
        </div>
    );
}
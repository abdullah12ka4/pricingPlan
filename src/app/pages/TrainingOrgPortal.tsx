import { useState } from 'react';
import { ArrowLeft, Users, Zap, TrendingDown, Download, Filter, Calendar, Search, User, Clock, MapPin, FileText, BookOpen, Info, DollarSign, CheckCircle, XCircle, AlertCircle, Send, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

interface TrainingOrgPortalProps {
  onBack: () => void;
}

// Mock data for credit usage
const mockCreditUsage = [
  {
    id: '1',
    studentName: 'Emily Chen',
    studentId: 'STU-2024-001',
    course: 'Certificate IV in Business',
    activity: 'Placement Matching',
    creditsUsed: 1,
    industry: 'Retail',
    date: '2024-01-05',
    time: '10:30 AM',
    placement: 'ABC Corporation',
    status: 'completed'
  },
  {
    id: '2',
    studentName: 'James Wilson',
    studentId: 'STU-2024-002',
    course: 'Diploma of Information Technology',
    activity: 'Placement Matching',
    creditsUsed: 1,
    industry: 'Technology',
    date: '2024-01-05',
    time: '11:15 AM',
    placement: 'Tech Solutions Ltd',
    status: 'completed'
  },
  {
    id: '3',
    studentName: 'Sarah Johnson',
    studentId: 'STU-2024-003',
    course: 'Certificate III in Health Services',
    activity: 'Placement Matching',
    creditsUsed: 1,
    industry: 'Healthcare',
    date: '2024-01-05',
    time: '02:45 PM',
    placement: 'Healthcare Plus',
    status: 'completed'
  },
  {
    id: '4',
    studentName: 'Michael Brown',
    studentId: 'STU-2024-004',
    course: 'Diploma of Renewable Energy',
    activity: 'Placement Matching',
    creditsUsed: 1,
    industry: 'Energy',
    date: '2024-01-04',
    time: '09:20 AM',
    placement: 'Green Energy Co',
    status: 'completed'
  },
  {
    id: '5',
    studentName: 'Emma Davis',
    studentId: 'STU-2024-005',
    course: 'Certificate IV in Marketing',
    activity: 'Placement Matching',
    creditsUsed: 1,
    industry: 'Marketing',
    date: '2024-01-04',
    time: '03:30 PM',
    placement: 'Digital Marketing Hub',
    status: 'completed'
  },
  {
    id: '6',
    studentName: 'Daniel Martinez',
    studentId: 'STU-2024-006',
    course: 'Diploma of Accounting',
    activity: 'Placement Matching',
    creditsUsed: 1,
    industry: 'Finance',
    date: '2024-01-03',
    time: '10:00 AM',
    placement: 'Finance Corp',
    status: 'completed'
  },
  {
    id: '7',
    studentName: 'Olivia Taylor',
    studentId: 'STU-2024-007',
    course: 'Certificate IV in Training & Assessment',
    activity: 'Placement Matching',
    creditsUsed: 1,
    industry: 'Education',
    date: '2024-01-03',
    time: '01:15 PM',
    placement: 'Education Services',
    status: 'completed'
  },
  {
    id: '8',
    studentName: 'William Anderson',
    studentId: 'STU-2024-008',
    course: 'Diploma of Retail Management',
    activity: 'Placement Matching',
    creditsUsed: 1,
    industry: 'Retail',
    date: '2024-01-02',
    time: '11:45 AM',
    placement: 'Retail Solutions',
    status: 'completed'
  },
  {
    id: '9',
    studentName: 'Sophia Thomas',
    studentId: 'STU-2024-009',
    course: 'Certificate III in Engineering',
    activity: 'Placement Matching',
    creditsUsed: 1,
    industry: 'Manufacturing',
    date: '2024-01-02',
    time: '02:30 PM',
    placement: 'Manufacturing Inc',
    status: 'completed'
  },
  {
    id: '10',
    studentName: 'Liam Jackson',
    studentId: 'STU-2024-010',
    course: 'Certificate III in Hospitality',
    activity: 'Placement Matching',
    creditsUsed: 1,
    industry: 'Hospitality',
    date: '2024-01-01',
    time: '09:00 AM',
    placement: 'Hospitality Group',
    status: 'completed'
  }
];

const mockPackageInfo = {
  name: 'Growth Package',
  totalCredits: 100,
  usedCredits: 85,
  remainingCredits: 15,
  renewalDate: '2024-03-31',
  status: 'active',
  billingCycle: 'quarterly'
};

// Mock data for invoices
const mockInvoices = [
  {
    id: 'INV-2024-001',
    description: 'Growth Package - Q1 2024',
    amount: 2850.00,
    issueDate: '2024-01-01',
    dueDate: '2024-01-15',
    paidDate: '2024-01-12',
    status: 'paid',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'BT-20240112-001',
  },
  {
    id: 'INV-2024-002',
    description: 'Credit Top-up - 50 Credits',
    amount: 750.00,
    issueDate: '2024-01-20',
    dueDate: '2024-02-03',
    paidDate: '2024-01-28',
    status: 'paid',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'BT-20240128-002',
  },
  {
    id: 'INV-2024-003',
    description: 'Premium Support - Monthly',
    amount: 299.00,
    issueDate: '2024-02-01',
    dueDate: '2024-02-15',
    paidDate: null,
    status: 'sent',
    paymentMethod: 'Bank Transfer',
    paymentReference: null,
  },
  {
    id: 'INV-2024-004',
    description: 'Additional Storage - 100GB',
    amount: 149.00,
    issueDate: '2024-01-15',
    dueDate: '2024-01-29',
    paidDate: '2024-01-27',
    status: 'paid',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'BT-20240127-003',
  },
  {
    id: 'INV-2024-005',
    description: 'AI Matching Credits - 100 calls',
    amount: 450.00,
    issueDate: '2023-12-28',
    dueDate: '2024-01-11',
    paidDate: '2024-01-08',
    status: 'paid',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'BT-20240108-004',
  },
  {
    id: 'INV-2024-006',
    description: 'Setup Fee - New Account',
    amount: 1200.00,
    issueDate: '2023-12-15',
    dueDate: '2023-12-29',
    paidDate: '2023-12-20',
    status: 'paid',
    paymentMethod: 'Bank Transfer',
    paymentReference: 'BT-20231220-005',
  },
  {
    id: 'INV-2024-007',
    description: 'Growth Package - Q2 2024',
    amount: 2850.00,
    issueDate: '2024-02-05',
    dueDate: '2024-02-19',
    paidDate: null,
    status: 'pending',
    paymentMethod: 'Bank Transfer',
    paymentReference: null,
  },
  {
    id: 'INV-2023-012',
    description: 'Credit Top-up - 25 Credits',
    amount: 375.00,
    issueDate: '2023-12-10',
    dueDate: '2023-12-24',
    paidDate: null,
    status: 'overdue',
    paymentMethod: 'Bank Transfer',
    paymentReference: null,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Paid
        </Badge>
      );
    case 'sent':
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Send className="w-3 h-3 mr-1" />
          Sent
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case 'overdue':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Overdue
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function TrainingOrgPortal({ onBack }: TrainingOrgPortalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActivity, setFilterActivity] = useState('all');
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredUsage = mockCreditUsage.filter(usage => {
    const matchesSearch = usage.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          usage.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          usage.placement.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActivity = filterActivity === 'all' || usage.activity === filterActivity;
    
    return matchesSearch && matchesActivity;
  });

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = invoice.id.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
                          invoice.description.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
                          (invoice.paymentReference && invoice.paymentReference.toLowerCase().includes(invoiceSearch.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const totalCreditsUsed = filteredUsage.reduce((sum, usage) => sum + usage.creditsUsed, 0);
  const uniqueStudents = new Set(filteredUsage.map(u => u.studentId)).size;

  const usagePercentage = (mockPackageInfo.usedCredits / mockPackageInfo.totalCredits) * 100;
  const isLowCredit = mockPackageInfo.remainingCredits <= 20;

  const totalPaid = mockInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = mockInvoices.filter(inv => inv.status === 'pending' || inv.status === 'sent').reduce((sum, inv) => sum + inv.amount, 0);
  const totalOverdue = mockInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  const exportCreditCSV = () => {
    const headers = ['Date', 'Time', 'Student Name', 'Student ID', 'Course', 'Activity', 'Industry', 'Placement', 'Credits Used', 'Status'];
    const rows = filteredUsage.map(u => [
      u.date,
      u.time,
      u.studentName,
      u.studentId,
      u.course,
      u.activity,
      u.industry,
      u.placement,
      u.creditsUsed.toString(),
      u.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `credit-usage-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportInvoiceCSV = () => {
    const headers = ['Invoice ID', 'Description', 'Amount', 'Issue Date', 'Due Date', 'Paid Date', 'Status', 'Payment Method', 'Payment Reference'];
    const rows = filteredInvoices.map(inv => [
      inv.id,
      inv.description,
      inv.amount.toFixed(2),
      inv.issueDate,
      inv.dueDate,
      inv.paidDate || '-',
      inv.status,
      inv.paymentMethod,
      inv.paymentReference || '-'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoices-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#044866]/5 via-white to-[#F7A619]/5">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-[#044866]/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 py-3.5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#044866] hover:text-[#0D5468] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-7">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl text-[#044866]">Training Organisation Portal</h1>
              <p className="text-sm text-gray-600">Credits, invoices, and billing management</p>
            </div>
          </div>
        </div>

        {/* Credit Overview Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-[#044866]/20">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Current Package</CardDescription>
              <CardTitle className="text-2xl text-[#044866]">{mockPackageInfo.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
                <span className="text-xs text-gray-500">Quarterly</span>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-2 ${isLowCredit ? 'border-red-300 bg-red-50/50' : 'border-[#044866]/20'}`}>
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Remaining Credits</CardDescription>
              <CardTitle className={`text-3xl ${isLowCredit ? 'text-red-600' : 'text-[#044866]'}`}>
                {mockPackageInfo.remainingCredits}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={usagePercentage} className="h-2" />
              <p className="text-xs text-gray-600 mt-2">
                {mockPackageInfo.usedCredits} of {mockPackageInfo.totalCredits} used ({usagePercentage.toFixed(0)}%)
              </p>
              {isLowCredit && (
                <p className="text-xs text-red-600 mt-2 font-medium">⚠️ Low credit warning</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#044866]/20">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Total Paid</CardDescription>
              <CardTitle className="text-3xl text-green-600">${totalPaid.toFixed(0)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                <span>{mockInvoices.filter(inv => inv.status === 'paid').length} invoices</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#044866]/20">
            <CardHeader className="pb-3">
              <CardDescription className="text-xs">Outstanding</CardDescription>
              <CardTitle className="text-lg text-[#F7A619]">${(totalPending + totalOverdue).toFixed(0)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                {totalOverdue > 0 && <XCircle className="w-3.5 h-3.5 text-red-600" />}
                <span>{totalOverdue > 0 ? `$${totalOverdue.toFixed(0)} overdue` : 'All current'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SkilTrak Credit Model Info */}
        <Alert className="mb-6 border-[#044866]/30 bg-gradient-to-r from-[#044866]/5 to-[#F7A619]/5">
          <Info className="h-4 w-4 text-[#044866]" />
          <AlertTitle className="text-[#044866] font-semibold mb-3">SkilTrak Network Credit System</AlertTitle>
          <AlertDescription className="text-gray-700">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-[#044866] mb-2">
                  How Network Credits Work:
                </p>
                <p className="text-sm leading-relaxed">
                  SkilTrak uses a simple, transparent credit system for industry placement matching. 
                  <strong className="text-[#044866]"> 1 credit = 1 student matched to an industry placement opportunity.</strong> 
                  {' '}No complex pricing tiers or hidden fees - just predictable, per-match pricing.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#044866] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#F7A619]" />
                    What You Get Per Credit:
                  </p>
                  <ul className="text-xs space-y-1 ml-5 text-gray-700">
                    <li>• AI-powered student-to-industry matching</li>
                    <li>• Unlimited placement opportunity searches</li>
                    <li>• Automated placement notifications</li>
                    <li>• Placement tracking and reporting</li>
                    <li>• Industry partner network access</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#044866] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#F7A619]" />
                    Billing & Credit Details:
                  </p>
                  <ul className="text-xs space-y-1 ml-5 text-gray-700">
                    <li>• Billed quarterly (every 3 months)</li>
                    <li>• Credits expire at end of each quarter</li>
                    <li>• No rollover to next billing period</li>
                    <li>• Volume discounts available (save up to 19%)</li>
                    <li>• Low balance alerts at 20 credits remaining</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline" className="bg-white text-[#044866] border-[#044866]/20">
                  <Zap className="w-3 h-3 mr-1" />
                  Simple & Transparent
                </Badge>
                <Badge variant="outline" className="bg-white text-[#044866] border-[#044866]/20">
                  <Users className="w-3 h-3 mr-1" />
                  Per Student Matching
                </Badge>
                <Badge variant="outline" className="bg-white text-[#F7A619] border-[#F7A619]/30">
                  <MapPin className="w-3 h-3 mr-1" />
                  Industry Partner Network
                </Badge>
                <Badge variant="outline" className="bg-white text-green-700 border-green-200">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  Volume Discounts Available
                </Badge>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Tabs for Credits & Invoices */}
        <Tabs defaultValue="credits" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-6">
            <TabsTrigger value="credits" className="data-[state=active]:bg-[#044866] data-[state=active]:text-white">
              <Zap className="w-4 h-4 mr-2" />
              Credit Usage
            </TabsTrigger>
            <TabsTrigger value="invoices" className="data-[state=active]:bg-[#044866] data-[state=active]:text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Invoices & Payments
            </TabsTrigger>
          </TabsList>

          {/* Credit Usage Tab */}
          <TabsContent value="credits">
            <Card className="border-[#044866]/20">
              <CardHeader>
                <CardTitle className="text-lg text-[#044866]">Credit Usage Log</CardTitle>
                <CardDescription>Detailed breakdown of network credit consumption by student</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by student name, ID, or placement..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-[#044866]/20"
                    />
                  </div>
                  
                  <Select value={filterActivity} onValueChange={setFilterActivity}>
                    <SelectTrigger className="w-full md:w-[220px] border-[#044866]/20">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by activity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Activities</SelectItem>
                      <SelectItem value="Placement Matching">Placement Matching</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={exportCreditCSV}
                    className="border-[#044866]/20 text-[#044866] hover:bg-[#044866]/5"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>

                {/* Usage Table */}
                <div className="rounded-lg border border-[#044866]/20 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#044866]/5 hover:bg-[#044866]/5">
                        <TableHead className="text-[#044866]">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Date & Time
                          </div>
                        </TableHead>
                        <TableHead className="text-[#044866]">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Student
                          </div>
                        </TableHead>
                        <TableHead className="text-[#044866]">
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            Course
                          </div>
                        </TableHead>
                        <TableHead className="text-[#044866]">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Activity
                          </div>
                        </TableHead>
                        <TableHead className="text-[#044866]">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Industry & Placement
                          </div>
                        </TableHead>
                        <TableHead className="text-[#044866] text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Zap className="w-4 h-4" />
                            Credits
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsage.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                            No credit usage found matching your filters
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsage.map((usage) => (
                          <TableRow key={usage.id} className="hover:bg-[#044866]/5">
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm text-[#044866]">{usage.date}</span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {usage.time}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-[#044866]">{usage.studentName}</span>
                                <span className="text-xs text-gray-500">{usage.studentId}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-3.5 h-3.5 text-[#F7A619]" />
                                <span className="text-xs text-gray-700">{usage.course}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-[#044866]/5 text-[#044866] border-[#044866]/20">
                                {usage.activity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5">
                                  <Badge variant="outline" className="bg-[#F7A619]/10 text-[#F7A619] border-[#F7A619]/30 text-xs">
                                    {usage.industry}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-700">{usage.placement}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F7A619]/10 rounded-full">
                                <Zap className="w-3.5 h-3.5 text-[#F7A619]" />
                                <span className="text-sm font-semibold text-[#F7A619]">{usage.creditsUsed}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Summary Footer */}
                {filteredUsage.length > 0 && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-[#044866]/5 to-[#F7A619]/5 rounded-lg border border-[#044866]/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Total Entries</p>
                          <p className="text-lg font-semibold text-[#044866]">{filteredUsage.length}</p>
                        </div>
                        <div className="w-px h-10 bg-[#044866]/20"></div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Unique Students</p>
                          <p className="text-lg font-semibold text-[#044866]">{uniqueStudents}</p>
                        </div>
                        <div className="w-px h-10 bg-[#044866]/20"></div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">Total Credits Used</p>
                          <p className="text-lg font-semibold text-[#F7A619]">{totalCreditsUsed}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 mb-1">Average per Student</p>
                        <p className="text-lg font-semibold text-[#044866]">
                          {(totalCreditsUsed / uniqueStudents).toFixed(1)} credits
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices & Payments Tab */}
          <TabsContent value="invoices">
            <Card className="border-[#044866]/20">
              <CardHeader>
                <CardTitle className="text-lg text-[#044866]">Invoices & Payment History</CardTitle>
                <CardDescription>View all invoices, payment statuses, and bank transfer details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by invoice ID, description, or reference..."
                      value={invoiceSearch}
                      onChange={(e) => setInvoiceSearch(e.target.value)}
                      className="pl-10 border-[#044866]/20"
                    />
                  </div>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full md:w-[200px] border-[#044866]/20">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={exportInvoiceCSV}
                    className="border-[#044866]/20 text-[#044866] hover:bg-[#044866]/5"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>

                {/* Invoice Table */}
                <div className="rounded-lg border border-[#044866]/20 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#044866]/5 hover:bg-[#044866]/5">
                        <TableHead className="text-[#044866]">Invoice ID</TableHead>
                        <TableHead className="text-[#044866]">Description</TableHead>
                        <TableHead className="text-[#044866]">Amount</TableHead>
                        <TableHead className="text-[#044866]">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Dates
                          </div>
                        </TableHead>
                        <TableHead className="text-[#044866]">Payment Method</TableHead>
                        <TableHead className="text-[#044866]">Status</TableHead>
                        <TableHead className="text-[#044866] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                            No invoices found matching your filters
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredInvoices.map((invoice) => (
                          <TableRow key={invoice.id} className="hover:bg-[#044866]/5">
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-[#044866]">{invoice.id}</span>
                                {invoice.paymentReference && (
                                  <span className="text-xs text-gray-500">Ref: {invoice.paymentReference}</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-gray-700">{invoice.description}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-semibold text-[#044866]">${invoice.amount.toFixed(2)}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col text-xs">
                                <span className="text-gray-600">Issued: {invoice.issueDate}</span>
                                <span className="text-gray-600">Due: {invoice.dueDate}</span>
                                {invoice.paidDate && (
                                  <span className="text-green-600">Paid: {invoice.paidDate}</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-3.5 h-3.5 text-[#044866]" />
                                <span className="text-sm text-gray-700">{invoice.paymentMethod}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(invoice.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="text-[#044866] hover:bg-[#044866]/10">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Invoice Summary Footer */}
                {filteredInvoices.length > 0 && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-[#044866]/5 to-[#F7A619]/5 rounded-lg border border-[#044866]/10">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Total Invoices</p>
                        <p className="text-lg font-semibold text-[#044866]">{filteredInvoices.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Total Paid</p>
                        <p className="text-lg font-semibold text-green-600">${filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Pending Payment</p>
                        <p className="text-lg font-semibold text-yellow-600">${filteredInvoices.filter(inv => inv.status === 'pending' || inv.status === 'sent').reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Overdue</p>
                        <p className="text-lg font-semibold text-red-600">${filteredInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Low Credit Warning */}
        {isLowCredit && (
          <Card className="mt-6 border-2 border-red-300 bg-red-50/50">
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg text-red-900">Low Credit Balance</CardTitle>
                  <CardDescription className="text-red-700">
                    You have only {mockPackageInfo.remainingCredits} credits remaining. Consider topping up to avoid service interruption.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button className="bg-[#F7A619] hover:bg-[#F7A619]/90 text-white">
                  <Zap className="w-4 h-4 mr-2" />
                  Purchase Credit Top-up
                </Button>
                <Button variant="outline" className="border-[#044866]/20 text-[#044866]">
                  View Pricing
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Calendar, Download, Eye, FileText, Filter, Search } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { motion } from "motion/react";
import { getStatusBadge } from "../TrainingOrgPortal";
import { useState } from "react";





export const InvoiceTable = ({ mockInvoices , setSelectedInvoice, setShowInvoiceDialog}: { mockInvoices: any[] , setSelectedInvoice: (invoice: any) => void, setShowInvoiceDialog: (show: boolean) => void }) => {
    const [invoiceSearch, setInvoiceSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredInvoices = mockInvoices?.filter(invoice => {
        const matchesSearch = invoice.id.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
            invoice.description.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
            (invoice.paymentReference && invoice.paymentReference.toLowerCase().includes(invoiceSearch.toLowerCase()));

        const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;

        return matchesSearch && matchesStatus;
    });
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
        <Card className="border-2 border-slate-200/60 shadow-xl bg-white">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-6">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-2xl text-[#044866] mb-2">Invoices & Payment History</CardTitle>
                        <CardDescription className="text-base">
                            View all invoices, payment statuses, and transaction details
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={exportInvoiceCSV}
                            className="gap-2 border-[#044866]/20 text-[#044866] hover:bg-[#044866]/5"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                            placeholder="Search by invoice ID, description, or reference..."
                            value={invoiceSearch}
                            onChange={(e) => setInvoiceSearch(e.target.value)}
                            className="pl-12 h-12 border-slate-200 focus:border-[#044866] focus:ring-[#044866]/20"
                        />
                    </div>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-full md:w-[200px] h-12 border-slate-200">
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
                </div>

                {/* Invoice Table */}
                <div className="rounded-xl border-2 border-slate-200/60 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 hover:bg-slate-50 border-b-2 border-slate-200">
                                <TableHead className="text-[#044866] font-semibold">Invoice ID</TableHead>
                                <TableHead className="text-[#044866] font-semibold">Description</TableHead>
                                <TableHead className="text-[#044866] font-semibold">Amount</TableHead>
                                <TableHead className="text-[#044866] font-semibold">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Dates
                                    </div>
                                </TableHead>
                                <TableHead className="text-[#044866] font-semibold">Status</TableHead>
                                <TableHead className="text-[#044866] font-semibold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {!filteredInvoices ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-16">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                                <FileText className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <p className="text-slate-500 font-medium">No invoices found</p>
                                            <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredInvoices?.map((invoice, index) => (
                                    <motion.tr
                                        key={invoice.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.03 }}
                                        className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors"
                                    >
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-[#044866]">{invoice.id}</span>
                                                {invoice.paymentReference && (
                                                    <span className="text-xs text-slate-500">Ref: {invoice.paymentReference}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-xs">
                                                <p className="text-sm text-slate-900 font-medium mb-1">{invoice.description}</p>
                                                <p className="text-xs text-slate-500">
                                                    {invoice.lineItems.length} line item{invoice.lineItems.length !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-lg font-bold text-[#044866]">
                                                ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1 text-xs">
                                                <span className="text-slate-600">Issued: {invoice.issueDate}</span>
                                                <span className="text-slate-600">Due: {invoice.dueDate}</span>
                                                {invoice.paidDate && (
                                                    <span className="text-emerald-600 font-medium">Paid: {invoice.paidDate}</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(invoice.status)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-[#044866] hover:bg-[#044866]/10 gap-2"
                                            onClick={() => {
                                                setSelectedInvoice(invoice);
                                                setShowInvoiceDialog(true);
                                            }}
                                            >
                                                <Eye className="w-4 h-4" />
                                                View
                                            </Button>
                                        </TableCell>
                                    </motion.tr>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Invoice Summary */}
                {filteredInvoices?.length > 0 && (
                    <div className="mt-6 p-6 bg-gradient-to-r from-[#044866]/5 via-blue-50/50 to-emerald-50/50 rounded-xl border-2 border-slate-200/60">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-xs text-slate-600 mb-2 font-medium">Total Invoices</p>
                                <p className="text-2xl font-bold text-[#044866]">{filteredInvoices.length}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 mb-2 font-medium">Total Paid</p>
                                <p className="text-2xl font-bold text-emerald-600">
                                    ${filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 mb-2 font-medium">Pending</p>
                                <p className="text-2xl font-bold text-amber-600">
                                    ${filteredInvoices.filter(inv => inv.status === 'pending' || inv.status === 'sent').reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-600 mb-2 font-medium">Overdue</p>
                                <p className="text-2xl font-bold text-red-600">
                                    ${filteredInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
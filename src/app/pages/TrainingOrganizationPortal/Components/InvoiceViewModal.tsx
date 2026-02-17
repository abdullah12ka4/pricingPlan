import { DialogContent } from "@/app/components/ui/dialog";
import { getStatusBadge } from "../TrainingOrgPortal";
import { CheckCircle, Download, FileText, Info, Mail, Phone } from "lucide-react";
import { Button } from "@/app/components/ui/button";



export function InvoiceViewModal({selectedInvoice}:{selectedInvoice: any}) {
    return (
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedInvoice && (
                <div className="bg-white">
                    {/* Invoice Header - Company Info */}
                    <div className="border-b-2 border-slate-200 pb-6 mb-6">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">ST</span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-[#044866]">SkilTrak</h1>
                                    <p className="text-sm text-slate-600">Industry Placement Network</p>
                                    <p className="text-xs text-slate-500 mt-1">ABN: 12 345 678 901</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <h2 className="text-3xl font-bold text-[#044866] mb-2">INVOICE</h2>
                                <div className="inline-flex px-4 py-2 bg-slate-100 rounded-lg">
                                    {getStatusBadge(selectedInvoice.status)}
                                </div>
                            </div>
                        </div>

                        {/* From and Bill To */}
                        <div className="grid grid-cols-2 gap-8 mt-6">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">From</p>
                                <div className="text-sm text-slate-900">
                                    <p className="font-semibold">SkilTrak Pty Ltd</p>
                                    <p>Level 12, 123 Collins Street</p>
                                    <p>Melbourne VIC 3000</p>
                                    <p>Australia</p>
                                    <p className="mt-2 flex items-center gap-2">
                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                        billing@skiltrak.com
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                        +61 3 9000 0000
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Bill To</p>
                                <div className="text-sm text-slate-900">
                                    <p className="font-semibold">{selectedInvoice.orgName}</p>
                                    <p>Attention: Accounts Payable</p>
                                    <p>Melbourne VIC 3000</p>
                                    <p>Australia</p>
                                    <p className="mt-2 text-slate-600">Customer ID: CUST-2024-001</p>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="grid grid-cols-4 gap-4 mt-6 p-4 bg-slate-50 rounded-lg">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Invoice Number</p>
                                <p className="text-sm font-bold text-slate-900">{selectedInvoice.id}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Invoice Date</p>
                                <p className="text-sm font-semibold text-slate-900">{selectedInvoice.issueDate}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Due Date</p>
                                <p className="text-sm font-semibold text-slate-900">{selectedInvoice.dueDate}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Payment Terms</p>
                                <p className="text-sm font-semibold text-slate-900">Net 14</p>
                            </div>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="mb-6">
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-slate-100 border-b-2 border-slate-200">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700 uppercase">Description</th>
                                        <th className="text-center py-3 px-4 text-xs font-semibold text-slate-700 uppercase w-24">Qty</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700 uppercase w-32">Unit Price</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-slate-700 uppercase w-32">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedInvoice.lineItems.map((item:any, index:number) => (
                                        <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4 text-sm text-slate-900">{item.description}</td>
                                            <td className="py-3 px-4 text-sm text-slate-700 text-center">{item.quantity}</td>
                                            <td className="py-3 px-4 text-sm text-slate-700 text-right font-mono">
                                                ${item.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-slate-900 text-right font-semibold font-mono">
                                                ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Totals Section */}
                    <div className="flex justify-end mb-6">
                        <div className="w-80">
                            <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                                    <span className="text-sm font-medium text-slate-700">Subtotal</span>
                                    <span className="text-sm font-semibold text-slate-900 font-mono">
                                        ${selectedInvoice.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                                    <span className="text-sm font-medium text-slate-700">Tax ({selectedInvoice.taxRate}% GST)</span>
                                    <span className="text-sm font-semibold text-slate-900 font-mono">
                                        ${selectedInvoice.tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-base font-bold text-[#044866]">Amount Due (AUD)</span>
                                    <span className="text-2xl font-bold text-[#044866] font-mono">
                                        ${selectedInvoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            {/* Payment Status */}
                            {selectedInvoice.paidDate && (
                                <div className="mt-4 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                                        <span className="font-semibold text-emerald-900">Payment Received</span>
                                    </div>
                                    <div className="text-sm text-emerald-800 space-y-1">
                                        <p>Paid on: {selectedInvoice.paidDate}</p>
                                        <p>Method: {selectedInvoice.paymentMethod}</p>
                                        {selectedInvoice.paymentReference && (
                                            <p className="font-mono text-xs">Ref: {selectedInvoice.paymentReference}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Instructions */}
                    {!selectedInvoice.paidDate && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-blue-900 mb-2">Payment Instructions</h3>
                                    <div className="text-sm text-blue-800 space-y-1">
                                        <p className="font-medium">Bank Transfer Details:</p>
                                        <p>Account Name: SkilTrak Pty Ltd</p>
                                        <p>BSB: 123-456</p>
                                        <p>Account Number: 12345678</p>
                                        <p className="font-semibold mt-2">Reference: {selectedInvoice.id}</p>
                                        <p className="text-xs mt-2 text-blue-700">Please include the invoice number as the payment reference.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {selectedInvoice.notes && (
                        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Notes</p>
                            <p className="text-sm text-slate-700">{selectedInvoice.notes}</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="pt-6 border-t-2 border-slate-200">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="text-xs text-slate-500">
                                <p>Questions about your invoice? Contact us at billing@skiltrak.com or +61 3 9000 0000</p>
                                <p className="mt-1">SkilTrak Pty Ltd | ABN 12 345 678 901 | www.skiltrak.com</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => {
                                        // Download PDF functionality would go here
                                        alert('PDF download functionality would be implemented here');
                                    }}
                                >
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => {
                                        window.print();
                                    }}
                                >
                                    <FileText className="w-4 h-4" />
                                    Print
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DialogContent>
    )

} 
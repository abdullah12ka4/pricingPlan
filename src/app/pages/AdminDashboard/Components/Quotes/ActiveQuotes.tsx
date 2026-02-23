'use state'

import { Spinner } from '@/app/components/ui/spinner'
import { useApproveQuotesMutation, useGetQuotesQuery } from '@/Redux/services/ActiveQuotes'
import { AlertCircle, Calendar, CheckCircle, Clock, Download, Eye, Send, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'


export default function ActiveQuotes() {
  const [showModal, setshowModal] = useState(false)
  const [exporting, setExporting] = useState(false)

  const { data, isLoading, error } = useGetQuotesQuery()
  const [approveQuotes] = useApproveQuotesMutation()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error && "status" in error) {
    return (
      <div className="text-red-500 h-screen flex items-center justify-center">
        Error {error.status}: {"error" in error ? error.error : "Something went wrong"}
      </div>
    );
  }


  const activeQuotes = data?.data.quotes
  const totalQuotes = activeQuotes.length;

  const pendingApproval = activeQuotes.filter(
    (q: any) => q.status === 'PENDING_APPROVAL'
  ).length;

  const sentQuotes = activeQuotes.filter(
    (q: any) => q.status === 'SENT'
  ).length;

  const totalValue = activeQuotes.reduce(
    (sum: number, q: any) => sum + Number(q.total_amount || 0),
    0
  );

  const onDelete = async (id: string) => {
    if (!id) return null;
    try {
      const res = await approveQuotes({
        id,
        body: {
          approved: false,
          notes: 'Not Allowed'
        }
      })

      if (res && 'success' in res) {
        toast.success('Quote Rejected')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleExportCSV = () => {
    if (!activeQuotes?.length) return;

    setExporting(true);

    const headers = [
      "Quote Number",
      "Client",
      "Organization Type",
      "Sales Agent",
      "Plan",
      "Value",
      "Discount",
      "Status",
      "Expires"
    ];

    const rows = activeQuotes.map((q: any) => [
      q.quote_number,
      q.client_organization,
      q.organization_type,
      q.sales_agent?.name || "",
      q.plan_type,
      q.total_amount,
      q.discountPercent || 0,
      q.status,
      q.valid_until
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any) =>
        row.map((v: any) => `"${String(v).replace(/"/g, '""')}"`).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `active-quotes-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExporting(false);
  };




  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-[#044866] mb-1">Active Quotes & Payment Links</h2>
          <p className="text-sm text-gray-600">Monitor and manage all sales quotes</p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2.5 border border-[#044866]/20 text-[#044866] rounded-lg hover:bg-[#044866]/5 transition-all">
          <Download className="w-4 h-4" />
          {exporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Quotes', value: totalQuotes, color: '#044866' },
          { label: 'Pending Approval', value: pendingApproval, color: '#F7A619' },
          { label: 'Sent to Clients', value: sentQuotes, color: '#0D5468' },
          {
            label: 'Total Value',
            value: `$${(totalValue / 1000).toFixed(0)}k`,
            color: '#044866',
          },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border border-[#044866]/10 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
            <div className="text-2xl" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>


      {/* Quotes Table */}
      <div className="bg-white border border-[#044866]/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#044866]/5 border-b border-[#044866]/10">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-[#044866]">Quote ID</th>
                <th className="text-left px-5 py-3 text-xs text-[#044866]">Client</th>
                <th className="text-left px-5 py-3 text-xs text-[#044866]">Sales Agent</th>
                <th className="text-left px-5 py-3 text-xs text-[#044866]">Plan</th>
                <th className="text-left px-5 py-3 text-xs text-[#044866]">Value</th>
                <th className="text-left px-5 py-3 text-xs text-[#044866]">Discount</th>
                <th className="text-left px-5 py-3 text-xs text-[#044866]">Status</th>
                <th className="text-left px-5 py-3 text-xs text-[#044866]">Expires</th>
                <th className="text-right px-5 py-3 text-xs text-[#044866]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.quotes?.map((quote: any) => {
                const daysLeft = Math.ceil(
                  (new Date(quote.valid_until).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
                );

                return (
                  <tr key={quote.id} className="border-b border-gray-100 hover:bg-[#044866]/5 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-sm text-[#044866]">{quote.quote_number}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm text-gray-700">{quote.client_organization}</div>
                      <div className="text-xs text-gray-500">{quote.organization_type}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-700">{quote.sales_agent.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${quote.plan_type === 'PREMIUM'
                        ? 'bg-gradient-to-r from-[#044866] to-[#0D5468] text-white'
                        : 'bg-gray-100 text-gray-700'
                        }`}>
                        {quote.plan_type === 'PREMIUM' && <Star className="w-3 h-3" />}
                        {quote.plan_type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-[#044866] flex">${quote.total_amount}</span>
                    </td>
                    <td className="px-5 py-4">
                      {quote.discountPercent > 0 ? (
                        <span className="text-sm text-[#F7A619]">{quote.discountPercent}%</span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${quote.status === 'needs-approval'
                        ? 'bg-[#F7A619]/10 text-[#F7A619]'
                        : quote.status === 'APPROVED'
                          ? 'bg-green-50 text-green-700'
                          : quote.status === 'SENT'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                        {quote.status === 'needs-approval' && <AlertCircle className="w-3 h-3" />}
                        {quote.status === 'APPROVED' && <CheckCircle className="w-3 h-3" />}
                        {quote.status === 'SENT' && <Send className="w-3 h-3" />}
                        {quote.status === 'PENDING_APPROVAL' && <Clock className="w-3 h-3" />}
                        {quote.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {daysLeft > 0 ? `${daysLeft}d` : 'Expired'}
                        </span>

                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {/* <button className="p-1.5 hover:bg-[#044866]/10 rounded transition-colors" title="View">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button> */}
                        {quote.status === 'PENDING_APPROVAL' && (
                          <>
                            <button
                              onClick={async () => {
                                try {
                                  const res = await approveQuotes({
                                    id: quote.id,
                                    body: {
                                      approved: true,
                                      notes: 'Approved by Admin'
                                    }
                                  })
                                  if (res?.data?.success) {
                                    toast.success('Quote Approved Successfully')
                                  }
                                } catch (error) {

                                }
                              }}
                              className="p-1.5 hover:bg-green-50 rounded transition-colors" title="Approve">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  const res = await approveQuotes({
                                    id: quote.id,
                                    body: {
                                      approved: false,
                                      notes: 'Not Allowed'
                                    }
                                  })
                                  if (res?.data?.success) {
                                    toast.success('Quote Rejected')
                                  }
                                } catch (error) {
                                  console.log(error)
                                }
                              }}
                              className="p-1.5 hover:bg-red-50 rounded transition-colors" title="Reject">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

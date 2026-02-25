import { useGetAgentAnalyticsQuery, useGetDashboardQuery } from '@/Redux/services/SalesAgent'
import { Activity, AlertCircle, BarChart3, DollarSign, FileText, Package, Plus, TrendingUp, Users } from 'lucide-react';

import { AdminView } from './Types/AdminType';
import { Spinner } from '@/app/components/ui/spinner';
import { useApproveQuotesMutation, useGetQuotesQuery } from '@/Redux/services/ActiveQuotes';
import { toast } from 'sonner';
import { useGetAuditQuery } from '@/Redux/services/Audit';


export default function Dashboard({ setView }: { view: string, setView: (value: AdminView) => void }) {
  const { data, isLoading: analyticsLoading, error: analyticError } = useGetDashboardQuery()
  const { data: agentAnalytics, isLoading: agentLoading, error: agentError } = useGetAgentAnalyticsQuery()
  const { data: quoteData, isLoading: quoteLoading, error: quoteError } = useGetQuotesQuery();
  const { data: auditData, isLoading: auditLoading, error: auditError } = useGetAuditQuery()

  const loading = analyticsLoading || agentLoading || quoteLoading || auditLoading;
  const error = analyticError || agentError || quoteError || auditError;
  const [approveQuotes] = useApproveQuotesMutation();

  if (loading) {
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

  const dashboardStats = data?.data
  const activeQuotes = quoteData.data.quotes
  const pendingQuotes = activeQuotes.filter(
    (q: any) => q.status === 'PENDING_APPROVAL'
  );


  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-5">
        {[
          {
            label: 'Active Customers',
            value: dashboardStats?.customers?.active,
            change: `${dashboardStats?.customers?.trend}`,
            icon: Users,
            color: '#044866',
            trend: 'up'
          },
          {
            label: 'Monthly Revenue',
            value: `$${(dashboardStats.revenue.total / 1000).toFixed(0)}k`,
            change: `${dashboardStats.revenue.trend}`,
            icon: DollarSign,
            color: '#F7A619',
            trend: 'up'
          },
          {
            label: 'Active Quotes',
            value: dashboardStats.active_quotes,
            // change: dashboardStats.quotes.paidQuotes > 0 ? `${dashboardStats.quotes.padiQuotes} pending` : 'All approved',
            icon: FileText,
            color: '#0D5468',
            trend: 'neutral'
          },
          {
            label: 'Conversion Rate',
            value: `${dashboardStats.conversion_rate.current}%`,
            change: `${dashboardStats.conversion_rate.trend}`,
            icon: TrendingUp,
            color: '#044866',
            trend: 'up'
          }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-[#044866]/10 rounded-xl p-5 hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${stat.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                {stat.trend === 'up' && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="text-2xl text-[#044866] mb-1">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
              {stat.trend === 'neutral' && stat.change && (
                <div className="text-xs text-gray-500 mt-1">{stat.change}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-[#044866]/10 rounded-xl p-5">
        <h3 className="text-base text-[#044866] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'New Pricing Tier', icon: Plus, view: 'pricing-tiers' },
            { label: 'Create Add-on', icon: Package, view: 'add-ons' },
            { label: 'Add Sales Agent', icon: Users, view: 'sales-agents' },
          ].map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                onClick={() => setView(action.view as AdminView)}
                className="flex flex-col items-center gap-2 p-4 border-2 border-[#044866]/10 rounded-lg hover:border-[#044866] hover:bg-[#044866]/5 transition-all group"
              >
                <Icon className="w-5 h-5 text-[#044866] group-hover:scale-110 transition-transform" />
                <span className="text-xs text-[#044866] text-center">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Quotes Requiring Approval */}
      {pendingQuotes.length > 0 && (
        <div className="bg-gradient-to-br from-[#F7A619]/10 to-[#F7A619]/5 border-2 border-[#F7A619]/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#F7A619]" />

              <h3 className="text-base text-[#044866]">
                Quotes Requiring Approval
              </h3>

              <span className="px-2 py-0.5 bg-[#F7A619] text-white text-xs rounded-full">
                {dashboardStats.pendingApprovals}
              </span>
            </div>

            <button
              onClick={() => setView("active-quotes")}
              className="text-sm text-[#044866] hover:text-[#0D5468] underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-2">
            {pendingQuotes.map((quote: any) => (
              <div
                key={quote.id}
                className="bg-white rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="text-sm text-[#044866] mb-0.5">
                    {quote.client_name}
                  </div>

                  <div className="text-xs text-gray-600">
                    {quote.discountPercent}% discount • $
                    {quote.total_amount.toLocaleString()} • by{" "}
                    {quote.client_name}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type='button'
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
                    className="px-3 py-1.5 bg-[#044866] text-white rounded-lg text-xs hover:bg-[#0D5468] transition-colors">
                    Approve
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
                    type='button'

                    className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs hover:border-gray-300 transition-colors">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Recent Activity */}
      <div className="grid grid-cols-2 gap-5">

        {auditData?.length > 0 && (
          <div className="bg-white border border-[#044866]/10 rounded-xl p-5">
            <h3 className="text-base text-[#044866] mb-4 flex items-center gap-2">
              <Activity className='h-4 w-4' />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {auditData?.map((entry: any) => {
                // Pick icon based on entity type
                const iconMap: Record<string, any> = {
                  Quote: FileText,
                  Subscription: DollarSign,
                  Customer: Users,
                };
                const actionColorMap: Record<string, string> = {
                  CREATE: 'text-green-600',
                  UPDATE: 'text-blue-600',
                  EMAIL_SENT: 'text-purple-600',
                  DELETE: 'text-red-600',
                };
                const Icon = iconMap[entry.entityType] ?? BarChart3;
                const actor = entry.performedBy?.name ?? 'System';
                const actionLabel =
                  entry.action === 'EMAIL_SENT'
                    ? 'sent an email for'
                    : entry.action === 'CREATE'
                      ? 'created a new'
                      : entry.action === 'UPDATE'
                        ? 'updated'
                        : entry.action.toLowerCase();
                const detail =
                  entry.newValue?.quoteNumber
                    ? ` (${entry.newValue.quoteNumber})`
                    : entry.newValue?.totalAmount
                      ? ` • $${entry.newValue.totalAmount}`
                      : '';

                const timeAgo = (() => {
                  const diff = Date.now() - new Date(entry.createdAt).getTime();
                  const mins = Math.floor(diff / 60000);
                  if (mins < 60) return `${mins} min ago`;
                  const hrs = Math.floor(mins / 60);
                  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
                  return `${Math.floor(hrs / 24)} day(s) ago`;
                })();

                return (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-8 h-8 bg-[#044866]/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#044866]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-700">
                        <span className="font-medium text-[#044866]">{actor}</span>{' '}
                        <span className={actionColorMap[entry.action] ?? 'text-gray-600'}>
                          {actionLabel}
                        </span>{' '}
                        {entry.entityType}
                        {detail}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{timeAgo}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {agentAnalytics?.leaderboard?.length > 0 && (
          <div className="bg-white border border-[#044866]/10 rounded-xl p-5">
            <h3 className="text-base text-[#044866] mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Top Performing Agents
            </h3>
            <div className="space-y-3">
              {agentAnalytics?.leaderboard
                ?.slice(0, 4)
                .sort((a: any, b: any) => b.revenue - a.revenue)
                .map((item: any, idx: number) => (
                  <div key={item.agent.id} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-full flex items-center justify-center text-white text-xs">
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[#044866]">
                        {item.agent.name}
                      </div>

                      <div className="text-xs text-gray-600">
                        ${(item.revenue / 1000).toFixed(0)}k sales
                      </div>
                    </div>

                    <div className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      {item.conversion_rate}%
                    </div>
                  </div>
                ))}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

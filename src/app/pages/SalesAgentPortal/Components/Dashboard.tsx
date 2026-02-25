import { ArrowUpRight, Award, BarChart3, CheckCircle, ChevronRight, Clock, DollarSign, Eye, FileText, PersonStanding, Plus, Send, Target, TrendingUp, Users } from 'lucide-react'
import { Step } from '../SalesAgentPortal';
import { useGetAgentAnalyticsQuery } from '@/Redux/services/SalesAgent';
import { Spinner } from '@/app/components/ui/spinner';
import { useGetQuotesQuery, useGetSpecificQuotesQuery } from '@/Redux/services/ActiveQuotes';
import { useEffect, useState } from 'react';
import { timeAgo } from '@/app/components/Reusable/TimeAgo';


export default function Dashboard({ setView, setCurrentStep, id, setSelectedQuotes }: { setView: (value: boolean) => void, setCurrentStep: (value: Step) => void, id: string | null, setSelectedQuotes: (value: string | null) => void }) {

  const [showAllQuotes, setShowAllQuotes] = useState(false);
  if (!id) return null;

  const { data: agentAnalytics, isLoading: loadingAnalytics, error: analyticsError } = useGetAgentAnalyticsQuery();
  const { data: quotes, isLoading: loadQuotes, error: quoteError } = useGetQuotesQuery()

  const loading = loadingAnalytics || loadQuotes;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }


  const allQuotes = quotes?.data?.quotes ?? [];
  const sortedQuotes = [...allQuotes].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );

  const displayedQuotes = showAllQuotes
    ? sortedQuotes
    : sortedQuotes.slice(0, 5);

  const analytics = agentAnalytics?.leaderboard[0]

  const handleviewQuote = (id: string) => {
    if (id) {
      setSelectedQuotes(id)
      setCurrentStep('review')
      setView(true)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Welcome back, Sales Agent!</h1>
        <p className="text-sm text-gray-600">Here's your sales performance overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#044866]/10 to-[#0D5468]/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6 text-[#044866]" />
            </div>
            {/* <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-50 text-green-700">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {analytics?.revenue}%
            </div> */}
          </div>
          <div className="text-sm text-gray-600 mb-1">Monthly Revenue</div>
          {analytics?.revenue ? <div className="text-2xl text-gray-900">${(analytics?.revenue / 1000).toFixed(0)}k</div> : 0}
          <div className="mt-2 text-xs text-gray-500">vs last month</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#0D5468]/10 to-[#0D5468]/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-[#0D5468]" />
            </div>
            {/* <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-50 text-green-700">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {myStats.quotesChange}%
            </div> */}
          </div>
          <div className="text-sm text-gray-600 mb-1">Quotes Created</div>
          <div className="text-2xl text-gray-900">{analytics?.quotes_created}</div>
          <div className="mt-2 text-xs text-gray-500">this month</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F7A619]/10 to-[#F7A619]/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-[#F7A619]" />
            </div>
            {/* <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-50 text-green-700">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {myStats.conversionChange}%
            </div> */}
          </div>
          <div className="text-sm text-gray-600 mb-1">Conversion Rate</div>
          <div className="text-2xl text-gray-900">{analytics?.conversion_rate}%</div>
          <div className="mt-2 text-xs text-gray-500">quotes to deals</div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#10b981]/10 to-[#10b981]/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-[#10b981]" />
            </div>
            {/* <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-green-50 text-green-700">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {myStats.dealChange}%
            </div> */}
          </div>
          <div className="text-sm text-gray-600 mb-1">Avg Deal Size</div>
          {analytics?.average_deal_size ? <div className="text-2xl text-gray-900">${(analytics?.average_deal_size / 100).toFixed(0)}k</div> : 0}
          <div className="mt-2 text-xs text-gray-500">per closed deal</div>
        </div>
      </div>

      {/* Main Action Card */}
      <div className="bg-gradient-to-r from-[#044866] to-[#0D5468] rounded-2xl p-10 mb-8 text-center shadow-xl">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl text-white mb-3">Create New Quote</h2>
          <p className="text-base text-white/80 mb-8">
            Configure a custom package for your client and generate a secure payment link in minutes
          </p>
          <button
            onClick={() => {
              setCurrentStep('client-info')
              setView(false)
            }}
            className="cursor-pointer px-10 py-4 bg-white text-[#044866] rounded-xl hover:bg-gray-50 transition-all shadow-lg text-base flex items-center gap-3 mx-auto group"
          >
            <Plus className="w-5 h-5" />
            Generate New Quote
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Recent Quotes */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg text-gray-900">Recent Quotes</h3>
          {displayedQuotes.length > 5 && <button
            type="button"
            onClick={() => setShowAllQuotes((prev) => !prev)}
            className="text-sm text-[#044866] hover:text-[#0D5468] flex items-center gap-1"
          >
            {showAllQuotes ? 'Show less' : 'View all'}
            <ChevronRight className="w-4 h-4" />
          </button>}

        </div>

        <div className="space-y-3">
          {displayedQuotes.length <= 0 ? <div>No quotes found</div> : displayedQuotes.map((quote) => (
            <div
              onClick={() => handleviewQuote(quote.id)}
              key={quote.id} className="cursor-pointer w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm text-gray-900">{quote.client_organization}</span>
                  <span className="px-2 py-0.5 bg-[#044866]/10 text-[#044866] rounded-full text-xs">
                    {quote.organization_type}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {quote.quote_number}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeAgo(quote.created_at)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-base text-gray-900">${quote.total_amount.toLocaleString()}</div>
                  <div className={`text-xs flex items-center justify-end gap-1 ${quote.status === 'PAID'
                    ? 'text-green-600'
                    : quote.status === 'VIEWED'
                      ? 'text-blue-600' : quote.status === "PENDING_APPROVAL" ? 'text-red-600' : quote.status === 'SENT' ? 'text-blue-700' : 'text-yellow-400'
                    }`}>
                    {quote.status === 'PAID' && <CheckCircle className="w-3 h-3" />}
                    {quote.status === 'VIEWED' && <Eye className="w-3 h-3" />}
                    {quote.status === 'SENT' && <Send className="w-3 h-3" />}
                    {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                  </div>
                </div>

                <button type='button' className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))
          }
        </div>
      </div>

      {/* Quick Actions */}
      {/* <div className="grid grid-cols-3 gap-5 mt-8">
        <button type='button' className="p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-lg transition-all text-left group">
          <div className="w-12 h-12 bg-gradient-to-br from-[#044866]/10 to-[#0D5468]/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-6 h-6 text-[#044866]" />
          </div>
          <h4 className="text-base text-gray-900 mb-1">My Performance</h4>
          <p className="text-sm text-gray-600">View detailed analytics</p>
        </button>

        <button type='button' className="p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-lg transition-all text-left group">
          <div className="w-12 h-12 bg-gradient-to-br from-[#0D5468]/10 to-[#0D5468]/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6 text-[#0D5468]" />
          </div>
          <h4 className="text-base text-gray-900 mb-1">My Clients</h4>
          <p className="text-sm text-gray-600">Manage client relationships</p>
        </button>

        <button type='button' className="p-f6 bg-white border border-gray-100 rounded-2xl hover:shadow-lg transition-all text-left group">
          <div className="w-12 h-12 bg-gradient-to-br from-[#F7A619]/10 to-[#F7A619]/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Award className="w-6 h-6 text-[#F7A619]" />
          </div>
          <h4 className="text-base text-gray-900 mb-1">Leaderboard</h4>
          <p className="text-sm text-gray-600">See how you rank</p>
        </button>
      </div> */}
    </div>
  )
}

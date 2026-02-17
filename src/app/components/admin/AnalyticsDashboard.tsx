import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Users, DollarSign, Package, Star, Calendar, Download,
  Filter, RefreshCw, ArrowUpRight, ArrowDownRight, Zap, Target, Award, BarChart3,
  PieChart, Activity, Clock, CheckCircle, AlertCircle, Eye, ChevronDown, Sparkles,
  FileText,
  Send,
  Shield
} from 'lucide-react';

type TimeRange = 'today' | '7days' | '30days' | '90days' | '12months' | 'all';
type ChartView = 'revenue' | 'customers' | 'quotes' | 'conversion';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: any;
  color: string;
  prefix?: string;
  suffix?: string;
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  const [chartView, setChartView] = useState<ChartView>('revenue');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - would come from API
  const metrics = {
    totalRevenue: 842500,
    revenueChange: 18.5,
    activeCustomers: 187,
    customersChange: 12.3,
    avgDealSize: 8750,
    dealSizeChange: -3.2,
    conversionRate: 72.4,
    conversionChange: 5.8,
    activeQuotes: 34,
    quotesChange: 22.0,
    churnRate: 1.8,
    churnChange: -15.4,
    mrr: 65200,
    mrrChange: 14.2,
    ltv: 24800,
    ltvChange: 8.9
  };

  const monthlyData = [
    { month: 'Jan', revenue: 58000, customers: 98, quotes: 45, closed: 32, target: 60000 },
    { month: 'Feb', revenue: 67000, customers: 105, quotes: 52, closed: 38, target: 65000 },
    { month: 'Mar', revenue: 73000, customers: 112, quotes: 58, closed: 42, target: 70000 },
    { month: 'Apr', revenue: 79000, customers: 127, quotes: 61, closed: 48, target: 75000 },
    { month: 'May', revenue: 85000, customers: 134, quotes: 67, closed: 52, target: 80000 },
    { month: 'Jun', revenue: 92000, customers: 142, quotes: 73, closed: 58, target: 85000 },
    { month: 'Jul', revenue: 98000, customers: 156, quotes: 78, closed: 63, target: 90000 },
    { month: 'Aug', revenue: 104000, customers: 163, quotes: 82, closed: 67, target: 95000 },
    { month: 'Sep', revenue: 112000, customers: 171, quotes: 89, closed: 72, target: 100000 },
    { month: 'Oct', revenue: 118000, customers: 179, quotes: 94, closed: 76, target: 110000 },
    { month: 'Nov', revenue: 125000, customers: 187, quotes: 98, closed: 81, target: 115000 },
    { month: 'Dec', revenue: 135000, customers: 195, quotes: 105, closed: 87, target: 120000 }
  ];

  const revenueByPlan = [
    { plan: 'Basic', customers: 78, revenue: 156000, percentage: 42, color: '#94a3b8' },
    { plan: 'Premium', customers: 109, revenue: 327000, percentage: 58, color: '#044866' }
  ];

  const revenueByOrgType = [
    { type: 'School', customers: 58, revenue: 192000, percentage: 31, color: '#044866' },
    { type: 'RTO', customers: 52, revenue: 218000, percentage: 35, color: '#0D5468' },
    { type: 'TAFE', customers: 38, revenue: 134000, percentage: 22, color: '#F7A619' },
    { type: 'University', customers: 24, revenue: 68000, percentage: 11, color: '#64748b' },
    { type: 'Corporate', customers: 15, revenue: 78000, percentage: 13, color: '#475569' }
  ];

  const topAddOns = [
    { name: 'AI Assistant Support', sales: 67, revenue: 83750, growth: 24, color: '#044866' },
    { name: 'Extra Storage (500GB)', sales: 54, revenue: 32400, growth: 18, color: '#0D5468' },
    { name: 'AI Calls Package', sales: 48, revenue: 72000, growth: 31, color: '#F7A619' },
    { name: 'Premium Support', sales: 42, revenue: 63000, growth: 12, color: '#64748b' },
    { name: 'Extra Admin Seats', sales: 38, revenue: 22800, growth: 8, color: '#475569' }
  ];

  const salesAgents = [
    { id: 1, name: 'Sarah Johnson', avatar: 'SJ', revenue: 187000, deals: 24, conversion: 78, growth: 22, rank: 1, status: 'overperforming' },
    { id: 2, name: 'David Lee', avatar: 'DL', revenue: 165000, deals: 21, conversion: 75, growth: 18, rank: 2, status: 'overperforming' },
    { id: 3, name: 'Emma Wilson', avatar: 'EW', revenue: 142000, deals: 19, conversion: 71, growth: 15, rank: 3, status: 'on-target' },
    { id: 4, name: 'Mike Chen', avatar: 'MC', revenue: 128000, deals: 17, conversion: 68, growth: 12, rank: 4, status: 'on-target' },
    { id: 5, name: 'Lisa Anderson', avatar: 'LA', revenue: 98000, deals: 13, conversion: 62, growth: 8, rank: 5, status: 'needs-attention' }
  ];

  const conversionFunnel = [
    { stage: 'Leads Generated', count: 245, percentage: 100, color: '#044866', icon: Users },
    { stage: 'Quotes Created', count: 198, percentage: 81, color: '#0D5468', icon: FileText },
    { stage: 'Quotes Sent', count: 176, percentage: 72, color: '#F7A619', icon: Send },
    { stage: 'Viewed by Client', count: 154, percentage: 63, color: '#64748b', icon: Eye },
    { stage: 'Payment Started', count: 132, percentage: 54, color: '#475569', icon: DollarSign },
    { stage: 'Deals Closed', count: 119, percentage: 49, color: '#10b981', icon: CheckCircle }
  ];

  const recentActivity = [
    { type: 'deal', message: 'New deal closed - Melbourne Training Institute', amount: 24500, time: '5 min ago', agent: 'Sarah Johnson' },
    { type: 'quote', message: 'Quote sent to Sydney Business School', amount: 12800, time: '12 min ago', agent: 'Mike Chen' },
    { type: 'approval', message: 'Discount approved for Brisbane TAFE', amount: 3200, time: '28 min ago', agent: 'Emma Wilson' },
    { type: 'milestone', message: 'Revenue target achieved for November', amount: 125000, time: '1 hour ago', agent: 'System' },
    { type: 'deal', message: 'New deal closed - Corporate Learning Hub', amount: 18900, time: '2 hours ago', agent: 'David Lee' }
  ];

  const MetricCard = ({ title, value, change, trend, icon: Icon, color, prefix = '', suffix = '' }: MetricCardProps) => {
    const isPositive = trend === 'up';
    const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;
    
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}
               style={{ backgroundColor: `${color}15` }}>
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${
            isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {Math.abs(change)}%
          </div>
        </div>
        <div className="text-sm text-gray-600 mb-1">{title}</div>
        <div className="text-2xl text-gray-900">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
        <div className="mt-2 text-xs text-gray-500">
          vs previous period
        </div>
      </div>
    );
  };

  const maxRevenue = Math.max(...monthlyData.map(d => Math.max(d.revenue, d.target)));

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl text-gray-900">Analytics Dashboard</h1>
            <div className="px-3 py-1 bg-gradient-to-r from-[#044866] to-[#0D5468] text-white text-xs rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Live Data
            </div>
          </div>
          <p className="text-sm text-gray-600">Real-time insights into your business performance</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
            {[
              { value: 'today', label: 'Today' },
              { value: '7days', label: '7D' },
              { value: '30days', label: '30D' },
              { value: '90days', label: '90D' },
              { value: '12months', label: '12M' },
              { value: 'all', label: 'All' }
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value as TimeRange)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                  timeRange === range.value
                    ? 'bg-gradient-to-r from-[#044866] to-[#0D5468] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 text-sm text-gray-700"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <button className="px-4 py-2 bg-gradient-to-r from-[#044866] to-[#0D5468] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>

          <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
            <RefreshCw className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={metrics.totalRevenue}
          change={metrics.revenueChange}
          trend="up"
          icon={DollarSign}
          color="#044866"
          prefix="$"
        />
        <MetricCard
          title="Active Customers"
          value={metrics.activeCustomers}
          change={metrics.customersChange}
          trend="up"
          icon={Users}
          color="#0D5468"
        />
        <MetricCard
          title="Avg Deal Size"
          value={metrics.avgDealSize}
          change={Math.abs(metrics.dealSizeChange)}
          trend="down"
          icon={Target}
          color="#F7A619"
          prefix="$"
        />
        <MetricCard
          title="Conversion Rate"
          value={metrics.conversionRate}
          change={metrics.conversionChange}
          trend="up"
          icon={TrendingUp}
          color="#10b981"
          suffix="%"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">MRR</span>
            <Zap className="w-4 h-4 text-[#F7A619]" />
          </div>
          <div className="text-xl text-gray-900 mb-1">${(metrics.mrr / 1000).toFixed(0)}k</div>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <ArrowUpRight className="w-3 h-3" />
            {metrics.mrrChange}% growth
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Active Quotes</span>
            <Activity className="w-4 h-4 text-[#0D5468]" />
          </div>
          <div className="text-xl text-gray-900 mb-1">{metrics.activeQuotes}</div>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <ArrowUpRight className="w-3 h-3" />
            {metrics.quotesChange}% vs last period
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Customer LTV</span>
            <Award className="w-4 h-4 text-[#044866]" />
          </div>
          <div className="text-xl text-gray-900 mb-1">${(metrics.ltv / 1000).toFixed(1)}k</div>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <ArrowUpRight className="w-3 h-3" />
            {metrics.ltvChange}% increase
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">Churn Rate</span>
            <AlertCircle className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-xl text-gray-900 mb-1">{metrics.churnRate}%</div>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <ArrowDownRight className="w-3 h-3" />
            {Math.abs(metrics.churnChange)}% improvement
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg text-gray-900">Performance Trends</h2>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
              {[
                { value: 'revenue', label: 'Revenue', icon: DollarSign },
                { value: 'customers', label: 'Customers', icon: Users },
                { value: 'quotes', label: 'Quotes', icon: BarChart3 },
                { value: 'conversion', label: 'Deals', icon: CheckCircle }
              ].map((view) => {
                const Icon = view.icon;
                return (
                  <button
                    key={view.value}
                    onClick={() => setChartView(view.value as ChartView)}
                    className={`px-3 py-1.5 rounded-md text-xs transition-all flex items-center gap-1.5 ${
                      chartView === view.value
                        ? 'bg-white text-[#044866] shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {view.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#044866] to-[#0D5468]" />
              <span className="text-gray-600">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-dashed border-[#F7A619]" />
              <span className="text-gray-600">Target</span>
            </div>
          </div>
        </div>

        {/* Enhanced Chart */}
        <div className="space-y-3">
          {monthlyData.map((data, idx) => {
            const currentValue = chartView === 'revenue' ? data.revenue 
              : chartView === 'customers' ? data.customers 
              : chartView === 'quotes' ? data.quotes 
              : data.closed;
            const targetValue = data.target;
            const maxValue = chartView === 'revenue' ? maxRevenue 
              : chartView === 'customers' ? 200 
              : chartView === 'quotes' ? 110 
              : 90;
            
            const actualWidth = (currentValue / maxValue) * 100;
            const targetWidth = (targetValue / maxValue) * 100;
            const isAboveTarget = currentValue >= targetValue;
            
            return (
              <div key={idx} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-600 w-8">{data.month}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-900">
                      {chartView === 'revenue' && '$'}
                      {currentValue.toLocaleString()}
                    </span>
                    {isAboveTarget && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs">
                        <Target className="w-3 h-3" />
                        Target met
                      </div>
                    )}
                  </div>
                </div>
                <div className="relative h-10 bg-gray-50 rounded-xl overflow-hidden group-hover:shadow-md transition-all">
                  {/* Target line */}
                  <div 
                    className="absolute h-full border-r-2 border-dashed border-[#F7A619] z-10"
                    style={{ left: `${targetWidth}%` }}
                  />
                  
                  {/* Actual bar */}
                  <div 
                    className={`absolute h-full rounded-xl transition-all duration-700 ${
                      isAboveTarget 
                        ? 'bg-gradient-to-r from-[#10b981] to-[#059669]' 
                        : 'bg-gradient-to-r from-[#044866] to-[#0D5468]'
                    }`}
                    style={{ width: `${actualWidth}%` }}
                  >
                    <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
                  </div>
                  
                  {/* Value label inside bar */}
                  {actualWidth > 15 && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white text-xs font-medium z-20">
                      {chartView === 'revenue' && '$'}{currentValue.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Distribution & Org Types */}
      <div className="grid grid-cols-2 gap-6">
        {/* Plan Distribution with Circular Progress */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg text-gray-900 mb-6">Revenue by Plan</h3>
          
          <div className="space-y-6">
            {revenueByPlan.map((plan, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {plan.plan === 'Premium' && <Star className="w-4 h-4 text-[#F7A619]" />}
                    <span className="text-sm text-gray-900">{plan.plan}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-900">${(plan.revenue / 1000).toFixed(0)}k</div>
                    <div className="text-xs text-gray-500">{plan.customers} customers</div>
                  </div>
                </div>
                
                {/* Progress bar with gradient */}
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${plan.percentage}%`,
                      background: `linear-gradient(90deg, ${plan.color}, ${plan.color}dd)`
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
                
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>{plan.percentage}% of total revenue</span>
                  <span>${(plan.revenue / plan.customers).toFixed(0)} avg/customer</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Organization Type Distribution */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg text-gray-900 mb-6">Revenue by Organisation Type</h3>
          
          <div className="space-y-4">
            {revenueByOrgType.map((org, idx) => {
              const maxOrgRevenue = Math.max(...revenueByOrgType.map(o => o.revenue));
              const width = (org.revenue / maxOrgRevenue) * 100;
              
              return (
                <div key={idx} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-700 min-w-[80px]">{org.type}</span>
                    <div className="flex-1 mx-3">
                      <div className="relative h-8 bg-gray-50 rounded-lg overflow-hidden group-hover:shadow-md transition-all">
                        <div 
                          className="absolute h-full rounded-lg transition-all duration-700"
                          style={{ 
                            width: `${width}%`,
                            backgroundColor: org.color
                          }}
                        >
                          <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
                          {width > 20 && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-xs font-medium">
                              {org.customers}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-900 min-w-[60px] text-right">
                      ${(org.revenue / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Add-ons Performance */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg text-gray-900">Top Performing Add-ons</h3>
          <button className="text-sm text-[#044866] hover:text-[#0D5468] flex items-center gap-1">
            View all
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
          </button>
        </div>
        
        <div className="grid grid-cols-5 gap-4">
          {topAddOns.map((addon, idx) => (
            <div 
              key={idx} 
              className="relative p-5 border border-gray-100 rounded-xl hover:shadow-lg hover:scale-105 transition-all group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity"
                   style={{ background: `radial-gradient(circle, ${addon.color}, transparent)` }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                       style={{ backgroundColor: `${addon.color}15` }}>
                    <Package className="w-5 h-5" style={{ color: addon.color }} />
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                    <TrendingUp className="w-3 h-3" />
                    {addon.growth}%
                  </div>
                </div>
                
                <div className="text-xs text-gray-600 mb-2 line-clamp-2">{addon.name}</div>
                <div className="text-xl text-gray-900 mb-1">{addon.sales}</div>
                <div className="text-xs text-gray-500">sales</div>
                <div className="text-sm text-[#F7A619] mt-2">
                  ${(addon.revenue / 1000).toFixed(1)}k revenue
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Agent Performance & Conversion Funnel */}
      <div className="grid grid-cols-2 gap-6">
        {/* Sales Agents Leaderboard */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#F7A619]" />
            Sales Agent Leaderboard
          </h3>
          
          <div className="space-y-3">
            {salesAgents.map((agent, idx) => (
              <div 
                key={agent.id} 
                className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                  agent.status === 'overperforming' 
                    ? 'border-green-200 bg-green-50/30' 
                    : agent.status === 'needs-attention'
                    ? 'border-orange-200 bg-orange-50/30'
                    : 'border-gray-100 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    agent.rank === 1 
                      ? 'bg-gradient-to-br from-[#F7A619] to-[#f59e0b] text-white' 
                      : agent.rank === 2
                      ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                      : agent.rank === 3
                      ? 'bg-gradient-to-br from-[#d97706] to-[#b45309] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {agent.rank}
                  </div>
                  
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#044866] to-[#0D5468] flex items-center justify-center text-white text-sm">
                    {agent.avatar}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-sm text-gray-900 truncate">{agent.name}</div>
                      {agent.status === 'overperforming' && (
                        <div className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +{agent.growth}%
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>{agent.deals} deals</span>
                      <span>•</span>
                      <span>{agent.conversion}% conversion</span>
                    </div>
                  </div>
                  
                  {/* Revenue */}
                  <div className="text-right">
                    <div className="text-sm text-gray-900">${(agent.revenue / 1000).toFixed(0)}k</div>
                    <div className="text-xs text-gray-500">revenue</div>
                  </div>
                </div>
                
                {/* Performance bar */}
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      agent.status === 'overperforming'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : agent.status === 'needs-attention'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                        : 'bg-gradient-to-r from-[#044866] to-[#0D5468]'
                    }`}
                    style={{ width: `${agent.conversion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg text-gray-900 mb-6">Sales Conversion Funnel</h3>
          
          <div className="space-y-3">
            {conversionFunnel.map((stage, idx) => {
              const Icon = stage.icon;
              const dropoff = idx > 0 ? conversionFunnel[idx - 1].count - stage.count : 0;
              
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                           style={{ backgroundColor: `${stage.color}15` }}>
                        <Icon className="w-4 h-4" style={{ color: stage.color }} />
                      </div>
                      <span className="text-sm text-gray-700">{stage.stage}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-900">{stage.count}</span>
                      <span className="text-xs text-gray-500">{stage.percentage}%</span>
                    </div>
                  </div>
                  
                  <div className="relative h-12 rounded-xl overflow-hidden"
                       style={{ backgroundColor: `${stage.color}10` }}>
                    <div 
                      className="absolute h-full rounded-xl transition-all duration-1000"
                      style={{ 
                        width: `${stage.percentage}%`,
                        backgroundColor: stage.color
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                        {stage.count} conversions
                      </div>
                    </div>
                  </div>
                  
                  {dropoff > 0 && (
                    <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                      <TrendingDown className="w-3 h-3 text-orange-500" />
                      {dropoff} dropped ({((dropoff / conversionFunnel[idx - 1].count) * 100).toFixed(1)}%)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#044866]" />
            Recent Activity
          </h3>
          <button className="text-sm text-[#044866] hover:text-[#0D5468]">View all</button>
        </div>
        
        <div className="space-y-3">
          {recentActivity.map((activity, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors group">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'deal' 
                  ? 'bg-green-100' 
                  : activity.type === 'quote'
                  ? 'bg-blue-100'
                  : activity.type === 'approval'
                  ? 'bg-orange-100'
                  : 'bg-purple-100'
              }`}>
                {activity.type === 'deal' && <CheckCircle className="w-5 h-5 text-green-600" />}
                {activity.type === 'quote' && <FileText className="w-5 h-5 text-blue-600" />}
                {activity.type === 'approval' && <Shield className="w-5 h-5 text-orange-600" />}
                {activity.type === 'milestone' && <Target className="w-5 h-5 text-purple-600" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-900 mb-0.5">{activity.message}</div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{activity.time}</span>
                  <span>•</span>
                  <span>{activity.agent}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-900">${activity.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

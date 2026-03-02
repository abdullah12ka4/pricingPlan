import { useState } from 'react';
import {
  ArrowLeft,
  Settings,
  LayoutDashboard,
  Package,
  Layers,
  Users,
  FileText,
  AlertCircle,
  Zap,
  Star,
  BarChart3,
  Bell,
  Sparkles,
  Building2,

} from 'lucide-react';
import { AnalyticsDashboard } from '../../components/admin/AnalyticsDashboard';
import PricingTiers from './Components/PricingTiers/PricingTiers';
import OrgTypePricing from './Components/OrgTypePricing/OrgTypePricing';
import AddOns from './Components/AddOns/AddOns';
import NetworkPack from './Components/Network/NetworkPack';
import SalesAgent from './Components/SalesAgent/SalesAgent';
import ActiveQuotes from './Components/Quotes/ActiveQuotes';
import Features from './Components/Features/Features';
import { AdminDashboardProps, AdminView } from './Types/AdminType';
import Dashboard from './Dashboard';
import { useGetQuotesQuery } from '@/Redux/services/ActiveQuotes';



export function AdminDashboard({ onBack, data }: AdminDashboardProps) {
  const {data:quotes} = useGetQuotesQuery()
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  const renderNavigation = () => {
    const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'org-pricing', label: 'Org Type Pricing', icon: Building2 },
      { id: 'pricing-tiers', label: 'Pricing Tiers', icon: Layers },
      { id: 'add-ons', label: 'Add-ons', icon: Package },
      { id: 'network-packs', label: 'Network Packs', icon: Zap },
      { id: 'features', label: 'Features', icon: Star },
      { id: 'sales-agents', label: 'Sales Agents', icon: Users },
      { id: 'active-quotes', label: 'Active Quotes', icon: FileText },
      // { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      // { id: 'settings', label: 'Settings', icon: Settings }
    ];

    return (
      <div className="sm:w-64 bg-white border-r border-[#044866]/10 min-h-screen p-5">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className='hidden sm:block'>
              <div className="text-sm text-[#044866]">Admin Console</div>
              <div className="text-xs text-gray-500">Full Control</div>
            </div>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const pendingCount = item.id === 'active-quotes' ? quotes?.data?.quotes?.filter((quote: any) => quote.status === 'PENDING_APPROVAL').length : 0;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as AdminView)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${isActive
                    ? 'bg-gradient-to-r from-[#044866] to-[#0D5468] text-white shadow-md'
                    : 'text-gray-700 hover:bg-[#044866]/5'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#044866]'}`} />
                  <span className="text-sm hidden sm:block flex-1 text-left">{item.label}</span>
                  {pendingCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-[#F7A619] text-white text-xs rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
    <Dashboard view={currentView} setView={setCurrentView}/>
  );

  const renderPricingTiers = () => (
    <PricingTiers />
  );

  const renderAddOns = () => (
    <AddOns />
  );

  const renderNetworkPacks = () => (
    <NetworkPack />
  );
  const renderActiveQuotes = () => (
    <ActiveQuotes/>
  );

  const renderOrgPricing = () => (
    <div>
      <OrgTypePricing />
      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm text-blue-900 mb-1">About Organization Type Pricing</h4>
            <p className="text-sm text-blue-700">
              These are the starting prices displayed on the customer-facing pricing portal for each organization type.
              The actual tier pricing is configured in the <button onClick={() => setCurrentView('pricing-tiers')} className="underline hover:text-blue-900">Pricing Tiers</button> section.
            </p>
          </div>
        </div>
      </div>
    </div>

  );

  const renderSalesAgents = () => (
    <SalesAgent/>
  );

  // const renderAnalytics = () => {
  //   // Mock analytics data
  //   const monthlyData = [
  //     { month: 'Jan', revenue: 145000, customers: 98, quotes: 45 },
  //     { month: 'Feb', revenue: 162000, customers: 105, quotes: 52 },
  //     { month: 'Mar', revenue: 178000, customers: 112, quotes: 58 },
  //     { month: 'Apr', revenue: 184500, customers: 127, quotes: 61 },
  //     { month: 'May', revenue: 195000, customers: 134, quotes: 67 },
  //     { month: 'Jun', revenue: 210000, customers: 142, quotes: 73 }
  //   ];

  //   const planDistribution = [
  //     { plan: 'Basic', count: 58, revenue: 89000, percentage: 45.7 },
  //     { plan: 'Premium', count: 69, revenue: 121500, percentage: 54.3 }
  //   ];

  //   const orgTypeDistribution = [
  //     { type: 'School', count: 42, revenue: 68000, color: '#044866' },
  //     { type: 'RTO', count: 38, revenue: 72000, color: '#0D5468' },
  //     { type: 'TAFE', count: 24, revenue: 48000, color: '#F7A619' },
  //     { type: 'University', count: 15, revenue: 35000, color: '#044866' },
  //     { type: 'Corporate', count: 8, revenue: 21500, color: '#0D5468' }
  //   ];

  //   const topAddOns = [
  //     { name: 'AI Assistant Support', sales: 34, revenue: 42500 },
  //     { name: 'Extra Storage (500GB)', sales: 28, revenue: 16800 },
  //     { name: 'AI Calls Package', sales: 22, revenue: 33000 },
  //     { name: 'Premium Support', sales: 18, revenue: 27000 },
  //     { name: 'Extra Admin Seats', sales: 15, revenue: 9000 }
  //   ];

  //   return (
  //     <div className="space-y-6">
  //       {/* Time Period Selector */}
  //       <div className="flex items-center justify-between">
  //         <div>
  //           <h2 className="text-xl text-[#044866] mb-1">Revenue & Performance Analytics</h2>
  //           <p className="text-sm text-gray-600">Comprehensive insights into sales and customer metrics</p>
  //         </div>
  //         <select className="px-4 py-2.5 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20">
  //           <option>Last 6 Months</option>
  //           <option>Last 3 Months</option>
  //           <option>Last Year</option>
  //           <option>All Time</option>
  //         </select>
  //       </div>

  //       {/* Key Metrics */}
  //       <div className="grid grid-cols-5 gap-4">
  //         {[
  //           { label: 'Total Revenue', value: '$210k', change: '+14.2%', trend: 'up', color: '#044866' },
  //           { label: 'Active Customers', value: '142', change: '+44.9%', trend: 'up', color: '#0D5468' },
  //           { label: 'Avg Deal Size', value: '$8,750', change: '+2.3%', trend: 'up', color: '#F7A619' },
  //           { label: 'Churn Rate', value: '2.1%', change: '-0.8%', trend: 'down', color: '#044866' },
  //           { label: 'MRR Growth', value: '12.5%', change: '+3.1%', trend: 'up', color: '#0D5468' }
  //         ].map((metric, idx) => (
  //           <div key={idx} className="bg-white border border-[#044866]/10 rounded-xl p-4 hover:shadow-lg transition-all">
  //             <div className="text-xs text-gray-600 mb-2">{metric.label}</div>
  //             <div className="text-2xl mb-1" style={{ color: metric.color }}>{metric.value}</div>
  //             <div className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center gap-1`}>
  //               {metric.trend === 'up' ? '↑' : '↓'} {metric.change}
  //             </div>
  //           </div>
  //         ))}
  //       </div>

  //       {/* Revenue Trend */}
  //       <div className="bg-white border border-[#044866]/10 rounded-xl p-6">
  //         <div className="flex items-center justify-between mb-6">
  //           <h3 className="text-base text-[#044866]">Revenue Trend</h3>
  //           <div className="flex gap-4 text-xs">
  //             <div className="flex items-center gap-2">
  //               <div className="w-3 h-3 bg-[#044866] rounded-full" />
  //               <span className="text-gray-600">Revenue</span>
  //             </div>
  //             <div className="flex items-center gap-2">
  //               <div className="w-3 h-3 bg-[#F7A619] rounded-full" />
  //               <span className="text-gray-600">Customers</span>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Simple Bar Chart */}
  //         <div className="space-y-4">
  //           {monthlyData.map((data, idx) => {
  //             const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
  //             const revenueWidth = (data.revenue / maxRevenue) * 100;
  //             const customerWidth = (data.customers / 150) * 100;

  //             return (
  //               <div key={idx}>
  //                 <div className="flex items-center justify-between mb-1">
  //                   <span className="text-xs text-gray-600 w-10">{data.month}</span>
  //                   <span className="text-xs text-[#044866]">${(data.revenue / 1000).toFixed(0)}k</span>
  //                 </div>
  //                 <div className="relative h-8 bg-gray-50 rounded-lg overflow-hidden">
  //                   <div
  //                     className="absolute h-full bg-gradient-to-r from-[#044866] to-[#0D5468] rounded-lg transition-all duration-500"
  //                     style={{ width: `${revenueWidth}%` }}
  //                   />
  //                   <div
  //                     className="absolute h-2 bottom-1 bg-[#F7A619] rounded-full transition-all duration-500"
  //                     style={{ width: `${customerWidth}%` }}
  //                   />
  //                 </div>
  //               </div>
  //             );
  //           })}
  //         </div>
  //       </div>

  //       {/* Charts Grid */}
  //       <div className="grid grid-cols-2 gap-6">
  //         {/* Plan Distribution */}
  //         <div className="bg-white border border-[#044866]/10 rounded-xl p-6">
  //           <h3 className="text-base text-[#044866] mb-6">Plan Distribution</h3>
  //           <div className="space-y-4">
  //             {planDistribution.map((plan, idx) => (
  //               <div key={idx}>
  //                 <div className="flex items-center justify-between mb-2">
  //                   <div className="flex items-center gap-2">
  //                     {plan.plan === 'Premium' && <Star className="w-4 h-4 text-[#F7A619]" />}
  //                     <span className="text-sm text-[#044866]">{plan.plan}</span>
  //                   </div>
  //                   <div className="text-right">
  //                     <div className="text-sm text-[#044866]">{plan.count} customers</div>
  //                     <div className="text-xs text-gray-600">${(plan.revenue / 1000).toFixed(0)}k</div>
  //                   </div>
  //                 </div>
  //                 <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
  //                   <div
  //                     className={`absolute h-full rounded-full ${plan.plan === 'Premium'
  //                       ? 'bg-gradient-to-r from-[#044866] to-[#0D5468]'
  //                       : 'bg-gray-400'
  //                       }`}
  //                     style={{ width: `${plan.percentage}%` }}
  //                   />
  //                 </div>
  //                 <div className="text-xs text-gray-500 mt-1">{plan.percentage}% of total</div>
  //               </div>
  //             ))}
  //           </div>
  //         </div>

  //         {/* Organization Type Distribution */}
  //         <div className="bg-white border border-[#044866]/10 rounded-xl p-6">
  //           <h3 className="text-base text-[#044866] mb-6">Organization Types</h3>
  //           <div className="space-y-3">
  //             {orgTypeDistribution.map((org, idx) => {
  //               const maxCount = Math.max(...orgTypeDistribution.map(o => o.count));
  //               const width = (org.count / maxCount) * 100;

  //               return (
  //                 <div key={idx} className="flex items-center gap-3">
  //                   <div className="w-20 text-xs text-gray-600">{org.type}</div>
  //                   <div className="flex-1">
  //                     <div className="relative h-8 bg-gray-50 rounded-lg overflow-hidden">
  //                       <div
  //                         className="absolute h-full rounded-lg transition-all duration-500"
  //                         style={{
  //                           width: `${width}%`,
  //                           backgroundColor: org.color
  //                         }}
  //                       />
  //                       <div className="absolute inset-0 flex items-center justify-end pr-2">
  //                         <span className="text-xs text-white font-medium">{org.count}</span>
  //                       </div>
  //                     </div>
  //                   </div>
  //                   <div className="w-16 text-right text-xs text-gray-600">
  //                     ${(org.revenue / 1000).toFixed(0)}k
  //                   </div>
  //                 </div>
  //               );
  //             })}
  //           </div>
  //         </div>
  //       </div>

  //       {/* Top Add-ons */}
  //       <div className="bg-white border border-[#044866]/10 rounded-xl p-6">
  //         <div className="flex items-center justify-between mb-6">
  //           <h3 className="text-base text-[#044866]">Top Performing Add-ons</h3>
  //           <button className="text-sm text-[#044866] hover:text-[#0D5468] underline">
  //             View All Add-ons →
  //           </button>
  //         </div>
  //         <div className="grid grid-cols-5 gap-4">
  //           {topAddOns.map((addon, idx) => (
  //             <div key={idx} className="p-4 border border-gray-100 rounded-lg hover:border-[#044866]/30 hover:shadow-md transition-all">
  //               <div className="flex items-center justify-center w-10 h-10 bg-[#044866]/5 rounded-lg mx-auto mb-3">
  //                 <Package className="w-5 h-5 text-[#044866]" />
  //               </div>
  //               <div className="text-xs text-gray-600 mb-1 text-center">{addon.name}</div>
  //               <div className="text-lg text-[#044866] text-center mb-0.5">{addon.sales}</div>
  //               <div className="text-xs text-gray-500 text-center">sales</div>
  //               <div className="text-xs text-[#F7A619] text-center mt-2">
  //                 ${(addon.revenue / 1000).toFixed(1)}k
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>

  //       {/* Sales Agent Performance */}
  //       <div className="bg-white border border-[#044866]/10 rounded-xl p-6">
  //         <h3 className="text-base text-[#044866] mb-4">Sales Agent Performance</h3>
  //         <div className="overflow-x-auto">
  //           <table className="w-full">
  //             <thead className="bg-gray-50 border-b border-gray-100">
  //               <tr>
  //                 <th className="text-left px-4 py-3 text-xs text-gray-600">Agent</th>
  //                 <th className="text-left px-4 py-3 text-xs text-gray-600">Active Quotes</th>
  //                 <th className="text-left px-4 py-3 text-xs text-gray-600">Closed Deals</th>
  //                 <th className="text-left px-4 py-3 text-xs text-gray-600">Total Revenue</th>
  //                 <th className="text-left px-4 py-3 text-xs text-gray-600">Avg Deal Size</th>
  //                 <th className="text-left px-4 py-3 text-xs text-gray-600">Conversion Rate</th>
  //                 <th className="text-left px-4 py-3 text-xs text-gray-600">Performance</th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               {salesAgents.map((agent, idx) => {
  //                 const closedDeals = Math.floor(agent.activeQuotes * 2.5);
  //                 const avgDeal = agent.totalSales / closedDeals;

  //                 return (
  //                   <tr key={agent.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
  //                     <td className="px-4 py-3">
  //                       <div className="flex items-center gap-2">
  //                         <div className="w-8 h-8 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-full flex items-center justify-center text-white text-xs">
  //                           {agent.name.split(' ').map(n => n[0]).join('')}
  //                         </div>
  //                         <div>
  //                           <div className="text-sm text-[#044866]">{agent.name}</div>
  //                           <div className="text-xs text-gray-500">{agent.role}</div>
  //                         </div>
  //                       </div>
  //                     </td>
  //                     <td className="px-4 py-3">
  //                       <span className="text-sm text-gray-700">{agent.activeQuotes}</span>
  //                     </td>
  //                     <td className="px-4 py-3">
  //                       <span className="text-sm text-gray-700">{closedDeals}</span>
  //                     </td>
  //                     <td className="px-4 py-3">
  //                       <span className="text-sm text-[#044866]">${(agent.totalSales / 1000).toFixed(0)}k</span>
  //                     </td>
  //                     <td className="px-4 py-3">
  //                       <span className="text-sm text-gray-700">${(avgDeal / 1000).toFixed(1)}k</span>
  //                     </td>
  //                     <td className="px-4 py-3">
  //                       <span className="text-sm text-green-600">{agent.conversionRate}%</span>
  //                     </td>
  //                     <td className="px-4 py-3">
  //                       <div className="flex items-center gap-2">
  //                         <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
  //                           <div
  //                             className="h-full bg-gradient-to-r from-[#044866] to-[#0D5468] rounded-full"
  //                             style={{ width: `${agent.conversionRate}%` }}
  //                           />
  //                         </div>
  //                         <span className="text-xs text-gray-500">{agent.conversionRate}%</span>
  //                       </div>
  //                     </td>
  //                   </tr>
  //                 );
  //               })}
  //             </tbody>
  //           </table>
  //         </div>
  //       </div>

  //       {/* Conversion Funnel */}
  //       <div className="bg-white border border-[#044866]/10 rounded-xl p-6">
  //         <h3 className="text-base text-[#044866] mb-6">Sales Funnel</h3>
  //         <div className="space-y-4">
  //           {[
  //             { stage: 'Quotes Generated', count: 156, percentage: 100, color: '#044866' },
  //             { stage: 'Quotes Sent', count: 142, percentage: 91, color: '#0D5468' },
  //             { stage: 'Client Viewed', count: 128, percentage: 82, color: '#F7A619' },
  //             { stage: 'Payment Started', count: 112, percentage: 72, color: '#044866' },
  //             { stage: 'Deals Closed', count: 97, percentage: 62, color: '#0D5468' }
  //           ].map((stage, idx) => (
  //             <div key={idx}>
  //               <div className="flex items-center justify-between mb-2">
  //                 <span className="text-sm text-[#044866]">{stage.stage}</span>
  //                 <div className="flex items-center gap-3">
  //                   <span className="text-sm text-gray-700">{stage.count}</span>
  //                   <span className="text-xs text-gray-500">{stage.percentage}%</span>
  //                 </div>
  //               </div>
  //               <div className="relative h-10 bg-gray-50 rounded-lg overflow-hidden">
  //                 <div
  //                   className="absolute h-full rounded-lg transition-all duration-700"
  //                   style={{
  //                     width: `${stage.percentage}%`,
  //                     backgroundColor: stage.color
  //                   }}
  //                 >
  //                   <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
  //                     {stage.count} conversions
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'org-pricing':
        return renderOrgPricing();
      case 'pricing-tiers':
        return renderPricingTiers();
      case 'add-ons':
        return renderAddOns();
      case 'network-packs':
        return renderNetworkPacks();
      case 'active-quotes':
        return renderActiveQuotes();
      case 'sales-agents':
        return renderSalesAgents();
      // case 'analytics':
      //   return <AnalyticsDashboard />;
      case 'features':
        return <Features/>

      // case 'settings':
      //   return (
      //     <div className="text-center py-20">
      //       <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      //       <h3 className="text-lg text-[#044866] mb-2">System Settings</h3>
      //       <p className="text-sm text-gray-600">Configuration options coming soon</p>
      //     </div>
      //   );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="max-h-[92vh] bg-gradient-to-br from-[#044866]/5 via-white to-[#F7A619]/5 flex overflow-hidden">
      {/* Sidebar Navigation */}
      <div className='max-h-[88vh]'>
  {renderNavigation()}
      </div>
    

      {/* Main Content */}
      <div className="flex-1 p-8 max-h-screen overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl text-[#044866] mb-1">
                {currentView === 'dashboard' && 'Dashboard Overview'}
                {/* {currentView === 'org-pricing' && 'Organization Type Pricing'}
                {currentView === 'pricing-tiers' && 'Pricing Tiers'}
                {currentView === 'add-ons' && 'Add-ons'}
                {currentView === 'network-packs' && 'Network Packs'}
                {currentView === 'features' && 'Features'}
                {currentView === 'sales-agents' && 'Sales Agents'}
                {currentView === 'active-quotes' && 'Active Quotes'} */}
                {/* {currentView === 'analytics' && 'Analytics'}
                {currentView === 'settings' && 'Settings'} */}
              </h1>
              {/* <p className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p> */}
            </div>
            {/* <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-white rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                {dashboardStats.pendingApprovals > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F7A619] text-white text-xs rounded-full flex items-center justify-center">
                    {dashboardStats.pendingApprovals}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-[#044866]/10">
                <div className="w-8 h-8 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-full flex items-center justify-center text-white text-xs">
                  AD
                </div>
                <div>
                  <div className="text-sm text-[#044866]">{data?.role}</div>
                  <div className="text-xs text-gray-500">{data?.name}</div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* View Content */}
        {renderView()}
      </div>
    </div>
  );
}


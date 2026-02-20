'use client'

import { useState } from 'react';
import { Settings, ShoppingCart, Sparkles, TrendingUp, Shield, Zap, Users, Building2, ArrowRight, CheckCircle, Globe, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { GlobalNav } from '../components/GlobalNav';
import { TrainingOrgPortal } from '../pages/TrainingOrganizationPortal/TrainingOrgPortal';
import { AdminDashboard } from '../pages/AdminDashboard/AdminDashboard';
import { PaymentPage } from '../pages/PaymentPage';
import { useGetUserQuery } from '@/Redux/services/user';
import HeroSection from './Components/HeroSection';
import AdminCard from './Components/AdminCard';
import { Spinner } from '../components/ui/spinner';
import PlatformFeatures from './Components/PlatformFeatures';
import { CustomerPortal } from '../pages/CustomerPortal/CustomerPortal';
import { SalesAgentPortal } from '../pages/SalesAgentPortal/SalesAgentPortal';
import { CheckOutSummary } from './Types/homeTypes';
import PricingProvider from '../pages/SalesAgentPortal/Components/PricingContext';
import { useGetOrganizationQuery } from '@/Redux/services/Organization';
import { useGenerateLinkMutation } from '@/Redux/services/ActiveQuotes';

export type ViewType = 'home' | 'customer' | 'admin' | 'payment' | 'sales' | 'training-org';


export default function page() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [checkoutData, setCheckoutData] = useState<CheckOutSummary | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<any[]>([]);
  const [unselAddon, setUnselAddon] = useState<any[]>([]);
  const { data: agent, refetch: agentRefetch, isLoading: agentLoading, error: agentError } = useGetUserQuery();  
  
  const handleProceedToPayment = async (summary: CheckOutSummary) => {
    console.log("Summary received in handleProceedToPayment:", summary);
    setCheckoutData(summary);
    setCurrentView('payment');
  };

  const handlePaymentComplete = () => {
    setCheckoutData(null);
    setCurrentView('home');
    toast.success('Payment completed successfully! 🎉', {
      description: 'Your package has been activated.',
    });
  };

  const navigateTo = (view: ViewType) => {
    setCurrentView(view);
    if (view !== 'payment') {
      setCheckoutData(null);
    }
  };


  const isLoading = agentLoading
  const error = agentError 


  if (currentView === 'customer') {
    return (
      <>
        <GlobalNav agent={agent} currentView={currentView} onNavigate={navigateTo} />
        <PricingProvider><CustomerPortal setAddOns={setSelectedAddOns} unselAddon={setUnselAddon}  agent={agent} onBack={() => navigateTo('home')} onCheckout={handleProceedToPayment} /></PricingProvider>
      </>
    );
  }
  if (currentView === 'payment' && checkoutData) {
    return (
      <>
        <GlobalNav agent={agent} currentView={currentView} onNavigate={navigateTo} />
        <PaymentPage        
        selAddon={selectedAddOns}
          agent={agent}
          agentRefetch={agentRefetch}
          summary={checkoutData}
          onBack={() => navigateTo('customer')}
          onComplete={handlePaymentComplete}
        />

      </>
    );
  }

  if (currentView === 'admin') {
    return (
      <>
        <GlobalNav agent={agent} currentView={currentView} onNavigate={navigateTo} />
        <AdminDashboard onBack={() => navigateTo('home')} data={agent} />

      </>
    );
  }

  if (currentView === 'sales') {
    return (
      <>
        <GlobalNav agent={agent} currentView={currentView} onNavigate={navigateTo} />
        <PricingProvider><SalesAgentPortal user={agent} onBack={() => navigateTo('home')} /></PricingProvider>
      </>
    );
  }

  if (currentView === 'training-org') {
    return (
      <>
        <GlobalNav agent={agent} currentView={currentView} onNavigate={navigateTo} />
        <TrainingOrgPortal org={agent?.organization} onBack={() => navigateTo('home')} />

      </>
    );
  }

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

  if (agent?.role === "SUPER_ADMIN") {
    setCurrentView('admin')
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#044866]/5 via-white to-[#F7A619]/5">
      {/* Header */}
      <GlobalNav agent={agent} currentView={currentView} onNavigate={navigateTo} />

      <div className="max-w-7xl mx-auto px-5 py-12">
        {/* Hero Section */}
        <HeroSection />

        {/* Main Portal Cards */}
        <div className="mb-8 flex justify-center">
          <div className='w-[60vw]'>
            {/* Customer Portal Card */}
            {agent?.role === "CUSTOMER" && <Card
              className="group relative border-[#044866]/10 hover:border-[#044866]/30 hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
              onClick={() => navigateTo('customer')}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#044866]/5 to-transparent rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500" />

              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <ShoppingCart className="w-7 h-7 text-white" />
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Customer
                  </Badge>
                </div>

                <h2 className="text-2xl mb-2 text-[#044866]">Pricing Portal</h2>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                  Self-serve package selection with real-time pricing, plan comparison, and instant checkout
                </p>

                <ul className="space-y-2 mb-6">
                  {[
                    'Compare Basic vs Premium',
                    'Select volume tiers',
                    'Add network credits',
                    'Configure add-ons'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 bg-[#F7A619] rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-[#044866] group-hover:gap-3 transition-all font-medium">
                  <span className="text-sm">View Pricing</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>}

            {/* Sales Agent Portal Card */}
            {agent?.role === 'SALES_AGENT' && <Card
              className="group relative border-[#F7A619]/20 bg-gradient-to-br from-[#F7A619] to-[#F7A619]/90 hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
              onClick={() => navigateTo('sales')}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500" />

              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-white/30 shadow-lg">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                    Sales
                  </Badge>
                </div>

                <h2 className="text-2xl mb-2 text-white">Sales Portal</h2>
                <p className="text-sm text-white/90 mb-5 leading-relaxed">
                  8-step wizard to create custom packages, apply discounts, and generate secure payment links
                </p>

                <ul className="space-y-2 mb-6">
                  {[
                    'Configure packages',
                    'Apply custom discounts',
                    'Generate payment links',
                    'Track quote status'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-white/95">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all font-medium">
                  <span className="text-sm">Open Sales Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>}

            {/* Admin Dashboard Card */}
            {/* {agent?.role === 'SUPER_ADMIN' && <AdminCard currentView={setCurrentView} />} */}
          </div>

        </div>

        {agent?.organization && (
          <Card
            onClick={() => navigateTo('training-org')}
            className="group mb-10 border-2 border-[#044866]/10 hover:border-[#044866]/30 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
          >

            <CardContent className="p-8 relative">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#044866]/10 to-[#0D5468]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-[#044866]/20 shadow-md">
                  <Building2 className="w-8 h-8 text-[#044866]" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-3xl text-[#044866]">Training Organisation Portal</h2>
                    <Badge variant="outline" className="bg-[#F7A619]/10 text-[#F7A619] border-[#F7A619]/30">
                      Credit & Invoice Tracking
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-6 max-w-3xl">
                    Comprehensive credit usage tracking with student-by-student breakdowns, invoice management,
                    and payment history. Monitor your 1-credit-per-industry placement model in real-time.
                  </p>

                  <div className="grid md:grid-cols-4 gap-3">
                    {[
                      { icon: '📊', label: 'Detailed credit usage logs' },
                      { icon: '👥', label: 'Student-by-student tracking' },
                      { icon: '💳', label: 'Invoice & payment history' },
                      { icon: '📥', label: 'Export reports to CSV' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-700 bg-[#044866]/5 px-4 py-3 rounded-lg hover:bg-[#044866]/10 transition-colors">
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[#044866] group-hover:gap-3 transition-all font-medium">
                  <span className="text-sm whitespace-nowrap">View Portal</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>)}


        {/* Platform Features */}
        {/* <PlatformFeatures /> */}
      </div>
    </div>
  );
}
import { CheckCircle, Sparkles } from "lucide-react";


export default function HeroSection() {
  return (
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#044866]/10 to-[#F7A619]/10 rounded-full mb-6 border border-[#044866]/10">
                <Sparkles className="w-4 h-4 text-[#F7A619]" />
                <span className="text-sm text-[#044866] font-medium">Self-Serve Pricing Platform</span>
              </div>
              <h1 className="text-5xl mb-4 text-[#044866] tracking-tight">
                SkilTrak Pricing & Package
                <br />
                <span className="bg-gradient-to-r from-[#044866] to-[#F7A619] bg-clip-text text-transparent">
                  Management System
                </span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Complete solution for managing CRM plans, network credits, add-ons, and billing
                with powerful admin controls and sales tools
              </p>
    
              {/* Quick Stats */}
              <div className="flex items-center justify-center gap-8 mt-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">5 Organisation Types</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">6 Pricing Models</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">Full Admin Control</span>
                </div>
              </div>
            </div>
  )
}

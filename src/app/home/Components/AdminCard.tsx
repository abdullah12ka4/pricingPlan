import { Card, CardContent } from '@/app/components/ui/card'
import {  ArrowRight, Settings } from 'lucide-react'
import { Badge } from '@/app/components/ui/badge'
import { ViewType } from '../page'

export default function AdminCard({currentView}:{currentView: (show: ViewType)=>void}) {
  return (
              <Card
                className="group relative border-[#044866]/20 bg-gradient-to-br from-[#044866] to-[#0D5468] hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
                onClick={() => currentView('admin')}
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500" />
    
                <CardContent className="p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border-2 border-white/20 shadow-lg">
                      <Settings className="w-7 h-7 text-white" />
                    </div>
                    <Badge variant="outline" className="bg-white/10 text-white border-white/30">
                      Admin
                    </Badge>
                  </div>
    
                  <h2 className="text-2xl mb-2 text-white">Admin Console</h2>
                  <p className="text-sm text-white/80 mb-5 leading-relaxed">
                    Complete control over pricing tiers, features, add-ons, billing rules, and analytics
                  </p>
    
                  <ul className="space-y-2 mb-6">
                    {[
                      'Manage pricing tiers',
                      'Configure features',
                      'Create add-ons',
                      'View analytics & logs'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-white/90">
                        <div className="w-1.5 h-1.5 bg-[#F7A619] rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
    
                  <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all font-medium">
                    <span className="text-sm">Open Admin Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
  )
}

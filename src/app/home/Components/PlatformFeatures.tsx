import { Card, CardContent } from '@/app/components/ui/card'
import { BarChart3, Shield, TrendingUp, Zap } from 'lucide-react'
export default function PlatformFeatures() {
  return (
            <div className="grid md:grid-cols-4 gap-5 mb-12">
          {[
            {
              icon: TrendingUp,
              title: 'Package Management',
              description: 'CRM tiers with volume pricing and storage allocation',
              color: '#044866'
            },
            {
              icon: Zap,
              title: 'Network Credits',
              description: 'Quarterly WPO packages with compliance gates',
              color: '#F7A619'
            },
            {
              icon: Shield,
              title: 'Add-ons System',
              description: '6 pricing models with eligibility rules',
              color: '#0D5468'
            },
            {
              icon: BarChart3,
              title: 'Analytics',
              description: 'Performance metrics and conversion tracking',
              color: '#10b981'
            }
          ].map((feature, idx) => (
            <Card key={idx} className="border-[#044866]/10 hover:border-[#044866]/20 hover:shadow-lg transition-all group">
              <CardContent className="p-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${feature.color}15` }}>
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-sm mb-2 text-[#044866] font-semibold">{feature.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
  )
}

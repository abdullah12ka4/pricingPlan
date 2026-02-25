'use client'

import { Spinner } from '@/app/components/ui/spinner'
import {
  useGetSalesAgentsQuery,
  SalesAgentApiUser,
  useGetAgentAnalyticsQuery,
} from '@/Redux/services/SalesAgent'
import { Edit, Plus } from 'lucide-react'
import { useState } from 'react'
import SalesAgentForm from './SalesAgentForm'
import { SalesAgentType } from '../../Types/AdminType'
import AgentDetailsModal from './SalesAgentInfo'

export default function SalesAgent() {
  const [showModal, setShowModal] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<SalesAgentType | null>(null)
  const [InfoModal, setInfoModal] = useState(false)
  const [ViewAgent, setViewAgent] = useState<SalesAgentType | null>(null)

  const { data: agents, isLoading: agentLoading, error: agentError } = useGetSalesAgentsQuery()
  const { data: agentAnalytics, isLoading: analyticsLoading, error: analyticsError } = useGetAgentAnalyticsQuery()

  const salesAgents = agents?.filter((agent: any) =>
    agent?.role === 'SALES_AGENT' || agent?.role === 'SALES_MANAGER'
  )

  const loading = agentLoading || analyticsLoading
  const error = agentError || analyticsError

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error && 'status' in error) {
    return (
      <div className="text-red-500 h-screen flex items-center justify-center">
        Error {error.status}:{' '}
        {'error' in error ? error.error : 'Something went wrong'}
      </div>
    )
  }

  const handleEdit = (agent: any) => {
    setSelectedAgent(agent)
    setShowModal(true)
  }

  const handleView = (agent: any) => {
    if (agent) {
      setViewAgent(agent)
      setInfoModal(true)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-[#044866] mb-1">Sales Agents Management</h2>
          <p className="text-sm text-gray-600">Manage team members and their performance</p>
        </div>
        <button
          onClick={() => { setSelectedAgent(null); setShowModal(true) }}
          className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#044866] to-[#0D5468] text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Agent
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <SalesAgentForm modal={setShowModal} selectedAgent={selectedAgent} />
      )}

      {/* Agents Grid */}
      <div className="grid grid-cols-2 gap-5">
        {salesAgents?.map((agent: any) => {
          // Finds this specific agent's analytics by matching ID — works for any number of agents
          const analytics = agentAnalytics?.leaderboard?.find(
            (a: any) => a?.agent?.id === agent.id
          )

          return (
            <div
              key={agent.id}
              className="bg-white border border-[#044866]/10 rounded-xl p-5 hover:shadow-lg transition-all"
            >
              {/* Agent Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-full flex items-center justify-center text-white">
                    {agent.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-base text-[#044866]">{agent.name}</h3>
                      {analytics?.rank && (
                        <span className="text-xs text-gray-400">#{analytics.rank}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{agent.email}</p>
                    <span className="inline-flex items-center px-2 py-0.5 bg-[#044866]/5 text-[#044866] rounded-full text-xs">
                      {agent.role}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${analytics?.status === 'on_track'
                    ? 'bg-green-50 text-green-700'
                    : analytics?.status === 'needs_attention'
                      ? 'bg-yellow-50 text-yellow-700'
                      : analytics?.status === 'at_risk'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                  {analytics?.status?.replace(/_/g, ' ') ?? agent.status}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg text-[#044866] mb-0.5">{analytics?.quotes_created ?? 0}</div>
                  <div className="text-xs text-gray-600">Quotes</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg text-green-600 mb-0.5">{analytics?.conversion_rate ?? 0}%</div>
                  <div className="text-xs text-gray-600">Conv.</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg text-[#044866] mb-0.5">${((analytics?.average_deal_size ?? 0) / 1000).toFixed(0)}k</div>
                  <div className="text-xs text-gray-600">Avg Deal</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleView(agent)}
                  className="cursor-pointer flex-1 px-3 py-2 border border-[#044866]/20 text-[#044866] rounded-lg text-sm hover:bg-[#044866]/5 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleEdit(agent)}
                  className="cursor-pointer px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info Modal */}
      {InfoModal && ViewAgent && (
        <AgentDetailsModal open={InfoModal} onClose={setInfoModal} agent={ViewAgent} />
      )}
    </div>
  )
}
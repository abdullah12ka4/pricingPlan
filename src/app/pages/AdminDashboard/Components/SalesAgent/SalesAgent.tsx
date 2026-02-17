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

type SalesAgentUI = SalesAgentApiUser & {
  activeQuotes: number
  totalSales: number
  conversionRate: number
}

export default function SalesAgent() {
  const [showModal, setShowModal] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<SalesAgentType | null>(null)
  const [InfoModal, setInfoModal] = useState(false)
  const [ViewAgent, setViewAgent] = useState<SalesAgentType | null>(null)
  const id = ''
  const { data: agents, isLoading: agentLoading, error: agentError } = useGetSalesAgentsQuery()
  const { data: agentAnalytics, isLoading: analyticsLoading, error: analyticsError } = useGetAgentAnalyticsQuery(id)

  const loading = agentLoading || analyticsLoading
  const error = agentError || analyticsError

  /* ------------------ Loading ------------------ */
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  /* ------------------ Error ------------------ */
  if (error && 'status' in error) {
    return (
      <div className="text-red-500 h-screen flex items-center justify-center">
        Error {error.status}:{' '}
        {'error' in error ? error.error : 'Something went wrong'}
      </div>
    )
  }

  /* ------------------ Handlers ------------------ */
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

  /* ------------------ Render ------------------ */
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl text-[#044866] mb-1">
            Sales Agents Management
          </h2>
          <p className="text-sm text-gray-600">
            Manage team members and their performance
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedAgent(null)
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#044866] to-[#0D5468] text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Agent
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <SalesAgentForm
          modal={setShowModal}
          selectedAgent={selectedAgent}
        />
      )}
      {/* Agents Grid */}
      <div className="grid grid-cols-2 gap-5">
        {agents?.map((agent) => {
          // Temporary UI metrics (replace with analytics API later)
          const uiAgent: SalesAgentUI = {
            ...agent,
            activeQuotes: 0,
            totalSales: 0,
            conversionRate: 0,
          }

          return (
            <div
              key={uiAgent.id}
              className="bg-white border border-[#044866]/10 rounded-xl p-5 hover:shadow-lg transition-all"
            >
              {/* Agent Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-full flex items-center justify-center text-white">
                    {uiAgent.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>

                  <div>
                    <h3 className="text-base text-[#044866] mb-0.5">
                      {uiAgent.name}
                    </h3>
                    <p className="text-xs text-gray-600 mb-1">
                      {uiAgent.email}
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 bg-[#044866]/5 text-[#044866] rounded-full text-xs">
                      {uiAgent.role}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${uiAgent.status === 'active'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                    }`}
                >
                  {uiAgent.status}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg text-[#044866] mb-0.5">
                    {uiAgent.activeQuotes}
                  </div>
                  <div className="text-xs text-gray-600">Active</div>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg text-[#044866] mb-0.5">
                    ${(uiAgent.totalSales / 1000).toFixed(0)}k
                  </div>
                  <div className="text-xs text-gray-600">Sales</div>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg text-green-600 mb-0.5">
                    {uiAgent.conversionRate}%
                  </div>
                  <div className="text-xs text-gray-600">Conv.</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleView(uiAgent)}
                  className="flex-1 px-3 py-2 border border-[#044866]/20 text-[#044866] rounded-lg text-sm hover:bg-[#044866]/5 transition-colors">
                  View Details
                </button>
               

                <button
                  onClick={() => handleEdit(uiAgent)}
                  className="px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div> 
      {/* ShowInfo */}
                {InfoModal && ViewAgent && (<AgentDetailsModal open={InfoModal} onClose={setInfoModal} agent={ViewAgent} />)}
    </div>
  )
}

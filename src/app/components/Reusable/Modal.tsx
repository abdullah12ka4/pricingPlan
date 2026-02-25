import { Plus } from 'lucide-react'
import React, { ReactNode } from 'react'

export default function Modal({children, setModal, title}:{children: ReactNode, setModal: (show: boolean)=> void, title?: string}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl text-[#044866]">              
                {title}
              </h3>
              <button
                onClick={() => setModal(false)}
                className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5 text-gray-500 rotate-45" />
              </button>
            </div>

            {children}

          </div>
        </div>
  )
}

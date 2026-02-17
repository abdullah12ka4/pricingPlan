import { CheckCircle, User } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

export default function Step1() {
  const { register, watch } = useFormContext()
  const clientInfo = watch('client')
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-[#044866]/10 to-[#0D5468]/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-[#044866]" />
        </div>
        <h2 className="text-2xl text-[#044866] mb-2">Client Information</h2>
        <p className="text-sm text-gray-600">Enter the client's details to get started</p>
      </div>

      <div className="bg-white border border-[#044866]/10 rounded-2xl p-8 shadow-lg">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('client.name')}
              className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30 focus:border-[#044866]"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Organisation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('client.organization', {
                required: 'Client name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                }
              })}
              className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30 focus:border-[#044866]"
              placeholder="ABC Training College"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register('client.email', {
                required: 'Email is Required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
              className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30 focus:border-[#044866]"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              {...register('client.phone')}
              className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30 focus:border-[#044866]"
              placeholder="04XX XXX XXX"
            />
          </div>
        </div>

        {clientInfo.name && clientInfo.email && clientInfo.phone && clientInfo.organization && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700">All required fields completed</span>
          </div>
        )}
      </div>
    </div>
  )
}

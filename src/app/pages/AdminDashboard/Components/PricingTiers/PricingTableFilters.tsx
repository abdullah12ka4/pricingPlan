'use client'
import { CheckCircle, Edit, Search, Star, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDeleteTiersMutation, useGetPricingTiersQuery } from '@/Redux/services/tiersApi';
import { toast } from 'sonner';
import { Spinner } from '@/app/components/ui/spinner';
import { TABLETYPE } from '../../Types/AdminType';



export default function PricingTableFilters({ setModal, editTier }: { setModal: (show: boolean) => void, editTier: (tier: TABLETYPE) => void }) {
  const { data = [], isLoading, error } = useGetPricingTiersQuery()
  const [searchData, setsearchData] = useState<TABLETYPE[]>([])
  const [filterQuery, setfilterQuery] = useState<'all' | string>('all')
  const [searchQuery, setsearchQuery] = useState('')
  const [currentPage, setcurrentPage] = useState(1)
  const [deleteTier] = useDeleteTiersMutation();
  useEffect(() => {
    const getData = () => {
      if (data && data.length > 0) {
        setsearchData(data);
      }
    }
    getData();
  }, [data]);

console.log(searchData)

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
  // console.log('pricing Tiers', searchData)
  const ROWS_PER_PAGE = 10;

  const startIndex = (currentPage - 1) * ROWS_PER_PAGE
  const endIndex = startIndex + ROWS_PER_PAGE



  const totalPages = Math.ceil(searchData.length / ROWS_PER_PAGE);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    setsearchQuery(value)
    if (!value) {
      setsearchData(data)
      return;
    }
    const filtered = data.filter((item: TABLETYPE) =>
      item.description?.toLowerCase().includes(value) ||
      item.organisationType?.toLowerCase().includes(value) ||
      item.planType?.toLowerCase().includes(value) ||
      item.status?.toLowerCase().includes(value) ||
      item.storageGb?.toString().includes(value)
    );

    setsearchData(filtered);
  }
  const filteredHandle = (e: any) => {
    const value = e.target.value
    setfilterQuery(value)
    if (value === 'all') {
      setsearchData(data)
      return;
    }
    const filtered = data.filter((item: TABLETYPE) =>
      item.organisationType?.includes(value) ||
      item.planType?.includes(value)
    )

    setsearchData(filtered)
  }

  const handleDelete = async (id: string | undefined) => {
    try {
      if (id) {
        await deleteTier(id).unwrap()
        toast.success('Tiers Deleted Successfully')
      }
    } catch (error) {
      console.error('Delete failed', error);
    }
  }
  const handleEdit = async (tier: TABLETYPE) => {
    editTier(tier)
  }
  const paginatedData = searchData.slice(startIndex, endIndex)
  return (
    <div className='flex flex-col gap-6'>
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tiers..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
          />
        </div>
        <select
          value={filterQuery}
          onChange={filteredHandle}
          className="px-4 py-2.5 border border-[#044866]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/20"
        >
          <option value="all">All Types</option>
          <option value="BASIC">Basic Plan</option>
          <option value="PREMIUM">Premium Plan</option>
          <option value="SCHOOL">School</option>
          <option value="RTO">RTO</option>
          <option value="TAFE">TAFE</option>
          <option value="UNIVERSITY">University</option>
          <option value="CORPORATE">Corporate</option>
        </select>
      </div>
      {/* Tiers Table */}
      <div className="bg-white border border-[#044866]/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#044866]/5 border-b border-[#044866]/10">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-[#044866]">Tier Name</th>
                <th className="text-left px-5 py-3 text-xs text-[#044866]">Plan</th>
                <th className="text-left px-5 py-3 text-xs text-[#044866]">Org Type</th>
                <th className="text-left px-5 py-3 text-xs text-[#044866]">Students</th>
                <th className="text-left px-5 py-3 text-xs text-[#044866]">Storage</th>
                <th className="text-left px-5 py-3 text-xs text-[#044866]">Annual Price</th>
                <th className="text-left px-5 py-3 text-xs text-[#044866]">Status</th>
                <th className="text-right px-5 py-3 text-xs text-[#044866]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData?.map((tier: TABLETYPE) => (
                <tr key={tier.id} className="border-b border-gray-100 hover:bg-[#044866]/5 transition-colors">
                  <td className="px-5 py-4 max-w-37.5">
                    <div className="text-sm text-[#044866]">{tier.description}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${tier.planType === 'PREMIUM'
                      ? 'bg-gradient-to-r from-[#044866] to-[#0D5468] text-white'
                      : 'bg-gray-100 text-gray-700'
                      }`}>
                      {tier.planType === 'PREMIUM' && <Star className="w-3 h-3" />}
                      {tier.planType === 'BASIC' ? 'Basic' : 'Premium'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-700">{tier.organisationType}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-700">
                      {tier.minStudents === 0 ? 'Up to' : tier.minStudents.toLocaleString()} - {tier.maxStudents.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-700">{tier.storageGb}GB</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#044866]">${tier.annualPrice.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* <button className="p-1.5 hover:bg-[#044866]/10 rounded transition-colors" title="View">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button> */}
                      <button
                        onClick={() => handleEdit(tier)}
                        className="cursor-pointer p-1.5 hover:bg-[#044866]/10 rounded transition-colors" title="Edit">
                        <Edit className="w-4 h-4 text-[#044866]" />
                      </button>
                      <button
                        onClick={() => handleDelete(tier?.id)}
                        className="p-1.5 cursor-pointer hover:bg-red-50 rounded transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>Showing {data?.length} tiers</div>
        <div className="flex gap-2">
          <button
            onClick={() => setcurrentPage((prev) => Math.max(prev - 1, 1))}
            className="cursor-pointer px-3 py-1.5 border border-gray-200 rounded hover:bg-gray-50 transition-colors">Previous</button>
          <button
            onClick={() => setcurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="cursor-pointer px-3 py-1.5 border border-gray-200 rounded hover:bg-gray-50 transition-colors">Next</button>
        </div>
      </div>
    </div>

  )
}

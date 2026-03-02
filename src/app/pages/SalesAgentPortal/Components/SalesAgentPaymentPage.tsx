'use client'

import { Spinner } from "@/app/components/ui/spinner";
import { useGetSpecificQuotesQuery } from "@/Redux/services/ActiveQuotes";
import { AlertCircle, FileText, Link2, Star, User } from "lucide-react";

export default function SalesAgentPaymentPage({ quoteId }: { quoteId: string }) {
    const { data, isLoading, error } = useGetSpecificQuotesQuery(quoteId);

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

    const checkOutData = data?.data
    return (
        <section>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#044866]/10 to-[#0D5468]/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-[#044866]" />
                    </div>
                    <h2 className="text-2xl text-[#044866] mb-2">Review Package</h2>
                    <p className="text-sm text-gray-600">Verify all details before generating payment link</p>
                </div>

                <div className="space-y-5">
                    {/* Client Info Summary */}
                    <div className="bg-white border border-[#044866]/10 rounded-2xl p-6">
                        <h3 className="text-base text-[#044866] mb-4 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Client Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Name:</span>
                                <span className="ml-2 text-[#044866]">{checkOutData?.client_info.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Organisation:</span>
                                <span className="ml-2 text-[#044866]">{checkOutData?.client_info.organization}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Email:</span>
                                <span className="ml-2 text-[#044866]">{checkOutData?.client_info.email}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Phone:</span>
                                <span className="ml-2 text-[#044866]">{checkOutData?.client_info.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Package Summary */}
                    <div className="bg-white border border-[#044866]/10 rounded-2xl p-6">
                        <h3 className="text-base text-[#044866] mb-4">Package Details</h3>

                        <div className="space-y-4">
                            {/* Tier */}
                            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                                <div>
                                    <div className="text-sm text-[#044866] mb-1">{checkOutData?.pricing_tier?.name}</div>
                                    <div className="text-xs text-gray-600">
                                        {checkOutData?.plan_Type === 'PREMIUM' && <Star className="w-3 h-3 inline mr-1 text-[#F7A619]" />}
                                        {checkOutData?.plan_Type === 'BASIC' ? 'CRM Basic' : 'CRM Premium'} students
                                    </div>
                                </div>
                                <div className="text-sm text-[#044866]">${checkOutData?.pricing_tier?.annual_price.toLocaleString()}/year</div>
                            </div>

                            {/* Setup Fee */}
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                <div className="text-sm text-gray-700">Tax Amount / Setup Fee (One-time)</div>
                                <div className="text-sm text-gray-700">${checkOutData.totals.tax_amount}</div>
                            </div>

                            {/* Network Pack */}
                            {checkOutData?.network_package && (
                                <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                                    <div>
                                        <div className="text-sm text-[#044866] mb-1">{checkOutData?.network_package.name} Network Credits</div>
                                        <div className="text-xs text-gray-600">{checkOutData?.network_package.credits} credits/quarter</div>
                                    </div>
                                    <div className="text-sm text-[#044866]">${checkOutData?.network_package.total_cost.toLocaleString()}/quarter</div>
                                </div>
                            )}

                            {/* Add-ons */}
                            {checkOutData?.items.map((addon: any) => (
                                <div key={addon.id} className="flex justify-between items-start pb-4 border-b border-gray-100">
                                    <div>
                                        <div className="text-sm text-gray-700">{addon.name}</div>
                                        {addon.quantity > 1 && (
                                            <div className="text-xs text-gray-600">Quantity: {addon.quantity}</div>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-700">${addon.total_price.toLocaleString()}</div>
                                </div>
                            ))}

                            {/* Discount */}
                            {checkOutData?.discount && (
                                <div className="flex justify-between items-start pb-4 border-b border-gray-100">
                                    <div>
                                        <div className="text-sm text-[#F7A619]">Discount Applied</div>
                                        {checkOutData?.discount.reason && (
                                            <div className="text-xs text-gray-600 mt-1">{checkOutData?.discount.reason}</div>
                                        )}
                                        {checkOutData?.status === 'pending_approval' && (
                                            <div className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                Pending approval
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-sm text-[#F7A619]">-${checkOutData?.discount.amount}</div>
                                </div>
                            )}

                            {/* Totals */}
                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between items-center text-base">
                                    <span className="text-[#044866]">Total Annual</span>
                                    <span className="text-[#044866]">${checkOutData?.totals.annual_total.toLocaleString()}</span>
                                </div>
                                {checkOutData?.totals.quarterly_total > 0 && (
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Total Quarterly</span>
                                        <span className="text-gray-700">${checkOutData?.totals.quarterly_total.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">One-time Costs</span>
                                    <span className="text-gray-700">${checkOutData?.totals.one_time_total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-xl pt-3 border-t-2 border-[#044866]/20">
                                    <span className="text-[#044866]">First Year Total</span>
                                    <span className="text-[#044866]">${checkOutData?.totals.total_amount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

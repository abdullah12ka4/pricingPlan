'use client'

import { Spinner } from '@/app/components/ui/spinner';
import { useGenerateLinkMutation, useGetSpecificQuotesQuery } from '@/Redux/services/ActiveQuotes'
import { AlertCircle, CheckCircle, Clock, Copy, FileText, Link2, Mail, Star, User } from 'lucide-react'
import { useState } from 'react'
import { Step } from '../../SalesAgentPortal';
import { Controller, useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
interface Props {
    id: string | null;
    setexpiry: React.Dispatch<React.SetStateAction<number>>;
    currentStep: React.Dispatch<React.SetStateAction<Step>>;
}
export default function Step8({ id, setexpiry, currentStep }: Props) {
    const { control, watch, reset, setValue } = useFormContext<any>();

    const linkExpiry = watch('linkExpiry') ?? 3;

    const [generatedLink, setgeneratedLink] = useState('')
    const [showLinkModal, setShowLinkModal] = useState(false)
    const [copiedLink, setCopiedLink] = useState(false)

    const [generateLink, { isLoading: generateLinkLoading }] = useGenerateLinkMutation();



    if (!id) return null;
    const { data: getQuotesOne, isLoading: QuotesLoading, error: QuotesError } = useGetSpecificQuotesQuery(id);

    const isLoading = QuotesLoading;
    const error =  QuotesError
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



    const checkOutData = getQuotesOne?.data

    const handleGenerateLink = async () => {

        const payload = {
            expiryDays: Number(linkExpiry),
            sendEmail: false
        }
        try {
            const res = await generateLink({
                id,
                body: payload
            }).unwrap()
            if (res && 'success' in res) {
                setShowLinkModal(true)
                setgeneratedLink(res?.data?.payment_link.url)
                setexpiry(linkExpiry)

                setValue('createdQuote', {
                    ...checkOutData,
                    payment_link: res?.data?.payment_link.url,
                    linkExpiry,
                });
            }
        } catch (err) {
            console.log("Error occurs", err)
            if (typeof err === "object" && err !== null && "data" in err) {
                const { data } = err as FetchBaseQueryError;

                toast.error((data as any)?.message ?? "Request failed");
            } else {
                toast.error("Unexpected error");
            }
        }
    }
    const handleCopyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopiedLink(true);
        toast.success("Copied Link Successfully")
        setTimeout(() => setCopiedLink(false), 2000);
    }


    const handleSendEmail = async (id: string) => {
        if (!id || !generatedLink) return;

        const payload = {
            expiryDays: Number(linkExpiry),
            sendEmail: true,
        };

        try {
            const res = await generateLink({
                id,
                body: payload,
            }).unwrap();
            if (res.success) {
                toast.success('Email Successfully Send to Customer Email')
                setShowLinkModal(false)
            }
        } catch (err) {
            if (typeof err === "object" && err !== null && "data" in err) {
                const { data } = err as FetchBaseQueryError;

                toast.error((data as any)?.message ?? "Request failed");
            } else {
                toast.error("Unexpected error");
            }
        }
    };

    console.log(isLoading)


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
                                <div className="text-sm text-gray-700">Setup Fee (One-time)</div>
                                <div className="text-sm text-gray-700">${checkOutData?.totals.tax_amount}</div>
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
                    {checkOutData.status === 'pending_approval' && <div className='flex justify-end my-5'>
                        <button
                        type='button'

                        onClick={() => {
                            reset()
                            setShowLinkModal(false);
                            currentStep('client-info')
                        }}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-[#044866] to-[#0D5468] text-white rounded-xl hover:shadow-lg transition-all"
                    >
                        Create New Quote
                    </button>
                    </div> }

                    {/* Link Expiry */}
                    {checkOutData.status !== 'pending_approval' && (
                        <>
                            <div className="bg-white border border-[#044866]/10 rounded-2xl p-6">
                                <h3 className="text-base text-[#044866] mb-4 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Payment Link Settings
                                </h3>

                                <Controller
                                    name="linkExpiry"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <label className="block text-sm text-gray-700 mb-2">Link Expiry (days)</label>
                                            <select
                                                {...field}
                                                className="w-full px-4 py-3 border border-[#044866]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#044866]/30"
                                            >
                                                <option value={3}>3 days</option>
                                                <option value={7}>7 days</option>
                                                <option value={14}>14 days</option>
                                                <option value={30}>30 days</option>
                                            </select>
                                            <p className="text-xs text-gray-600 mt-2">
                                                The payment link will expire after {linkExpiry} days
                                            </p>
                                        </div>
                                    )}
                                />

                                {/* Generate Link Button */}
                                <div className="bg-gradient-to-r from-[#044866] to-[#0D5468] rounded-2xl p-8 text-center shadow-xl mt-6">
                                    <h3 className="text-xl text-white mb-2">Ready to Generate Payment Link</h3>
                                    <p className="text-sm text-white/80 mb-6">
                                        Click below to create a secure payment link for {checkOutData?.sales_agent.name}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleGenerateLink}
                                        disabled={generateLinkLoading}
                                        className="px-8 py-4 bg-white text-[#044866] rounded-xl hover:bg-gray-50 transition-all shadow-lg text-base flex items-center gap-2 mx-auto"
                                    >
                                        {generateLinkLoading ? <Spinner /> : <Link2 className="w-5 h-5" />}
                                        Generate Payment Link
                                    </button>
                                </div>
                            </div>      {/* Link Generated Modal */}
                            {showLinkModal && (
                                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
                                        <div className="text-center mb-6">
                                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle className="w-8 h-8 text-green-600" />
                                            </div>
                                            <h3 className="text-2xl text-[#044866] mb-2">Payment Link Generated!</h3>
                                            <p className="text-sm text-gray-600">
                                                Send this secure link to {checkOutData?.client_info.name}
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="text"
                                                    value={generatedLink}
                                                    readOnly
                                                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm"
                                                />
                                                <button
                                                    type='button'
                                                    onClick={handleCopyLink}
                                                    className="px-4 py-3 bg-[#044866] text-white rounded-lg hover:bg-[#0D5468] transition-colors flex items-center gap-2"
                                                >
                                                    {copiedLink ? (
                                                        <>
                                                            <CheckCircle className="w-4 h-4" />
                                                            Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-4 h-4" />
                                                            Copy
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>Expires in {linkExpiry} days</span>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <button
                                                type='button'
                                                onClick={() => handleSendEmail(checkOutData.id)}
                                                className="w-full px-6 py-4 bg-[#044866] text-white rounded-xl hover:bg-[#0D5468] transition-all flex items-center justify-center gap-2"
                                            >
                                                <Mail className="w-4 h-4" />
                                                {isLoading ? <Spinner /> : ' Send via Email'}
                                            </button>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type='button'
                                                onClick={() => setShowLinkModal(false)}
                                                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                                            >
                                                Close
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => {
                                                    reset()
                                                    setShowLinkModal(false);
                                                    currentStep('client-info')
                                                }}
                                                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#044866] to-[#0D5468] text-white rounded-xl hover:shadow-lg transition-all"
                                            >
                                                Create New Quote
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}


                </div>
            </div>
        </section>
    )
}

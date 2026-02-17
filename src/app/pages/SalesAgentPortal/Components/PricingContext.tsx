import { Spinner } from '@/app/components/ui/spinner';
import { useGetPricingTiersQuery } from '@/Redux/services/tiersApi'
import { ReactNode } from 'react'
import { createContext, useContext } from 'react'

const PricingContext = createContext([])


export default function PricingProvider({ children }: { children: ReactNode }) {
    const { data=[] , isLoading, error } = useGetPricingTiersQuery()
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

    return (
        <PricingContext.Provider value={data}>
            {children}
        </PricingContext.Provider>
    )
}
export const usePricing = () => useContext(PricingContext)

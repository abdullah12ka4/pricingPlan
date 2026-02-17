'use client'
import { Spinner } from '@/app/components/ui/spinner';
import { useGetQuotesQuery, useGetSpecificQuotesQuery } from '@/Redux/services/ActiveQuotes'


export default function QuotesStatus() {
  const { data: quotes, isLoading: loadQuotes, error: quotesError } = useGetQuotesQuery()
   const allQuotes = quotes?.data.quotes.map((q:any) => q.id)
   const { data: quote, isLoading: loadingQuote, error: quoteError } = useGetSpecificQuotesQuery(allQuotes)

  const isLoading = loadQuotes || loadingQuote;
  const error = quotesError || quoteError
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
  console.log(quote)

  return (
    <div>QuotesStatus</div>
  )
}

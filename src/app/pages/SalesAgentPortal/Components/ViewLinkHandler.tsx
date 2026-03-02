"use client";

import { useEffect } from "react";
import { useViewQuotesMutation } from "@/Redux/services/ActiveQuotes";
import SalesAgentPaymentPage from "@/app/pages/SalesAgentPortal/Components/SalesAgentPaymentPage";

export default function ViewLinkHandler({
  quoteId,
  token,
}: {
  quoteId: string;
  token: string;
}) {
  const [viewQuotes] = useViewQuotesMutation();

  useEffect(() => {
    const markAsViewed = async () => {
      try {
        await viewQuotes({ id: quoteId, token }).unwrap();
      } catch (err) {
        console.error("Failed to mark quote as viewed", err);
      }
    };

    markAsViewed();
  }, [quoteId, token, viewQuotes]);

  return <SalesAgentPaymentPage quoteId={quoteId} />;
}

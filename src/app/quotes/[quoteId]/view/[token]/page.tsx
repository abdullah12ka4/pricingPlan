import ViewLinkHandler from "@/app/pages/SalesAgentPortal/Components/ViewLinkHandler";

interface PageProps {
  params: {
    quoteId: string;
    token: string;
  };
}

export default async function QuoteViewPage({ params }: PageProps) {
  const { quoteId, token } = await params;

  if (!quoteId || !token) return <div>Not Found</div>;

  return (
    <ViewLinkHandler quoteId={quoteId} token={token} />
  );
}

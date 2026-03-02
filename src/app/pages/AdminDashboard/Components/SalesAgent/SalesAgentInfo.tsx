import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { SalesAgentType } from "../../Types/AdminType";
import { useDeleteSalesAgentMutation } from "@/Redux/services/SalesAgent";
import { toast } from "sonner";
import { timeAgo } from "@/app/components/Reusable/TimeAgo";

interface Props {
    agent: SalesAgentType | null;
    open: boolean;
    onClose: any
}

export default function AgentDetailsModal({ agent, open, onClose }: Props) {
    if(!agent) return null
    const [deleteAgent] = useDeleteSalesAgentMutation()

    const deleteAgents = async (id: string) => {
        if (!id) return null;
        try {
            await deleteAgent(id).unwrap()
            toast.success('Delete Agent Successfully')
            onClose(false)
        } catch (err) {
            console.log("Delete failed", err);
        }
    }
    return (
        <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-white/20" />

                <Dialog.Content
                    className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg"
                >
                    {/* REQUIRED for Radix accessibility */}
                    <Dialog.Title className="sr-only">Agent details</Dialog.Title>

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">{agent.name}</h2>

                        <Dialog.Close asChild>
                            <button className="rounded p-2 hover:bg-gray-100">
                                <X className="h-5 w-5" />
                            </button>
                        </Dialog.Close>
                    </div>

                    {/* Body */}
                    <div className="mt-4 space-y-2">
                        <p className="text-sm text-gray-600">Email: {agent.email}</p>
                        <div className="flex gap-4 items-center ">
                           {agent?.activeQuotes &&  <p className="text-sm text-gray-600">Active Quotes: {agent.activeQuotes}</p>}
                            {agent?.conversionRate && <p className="text-sm text-gray-600">Conversion Rate: ${agent.conversionRate}</p>}
                        </div>

                        <p className="text-sm text-gray-600">Phone: {agent.phoneNumber || "NO Contact Found"}</p>
                       {agent?.lastLogin &&  <p className="text-sm text-gray-600">Last Login: {timeAgo(agent.lastLogin)}</p>}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end gap-5">
                        <button
                            onClick={() => deleteAgents(agent.id)}
                            className="bg-red-500 px-4 py-2 text-white rounded">
                            Delete
                        </button>
                        <Dialog.Close asChild>

                            <button className="rounded bg-primary px-4 py-2 text-white">
                                Close
                            </button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

import { toast } from 'sonner';

export const notifications = {
  // Success notifications
  success: (message: string, description?: string) => {
    toast.success(message, { description });
  },

  // Error notifications
  error: (message: string, description?: string) => {
    toast.error(message, { description });
  },

  // Info notifications
  info: (message: string, description?: string) => {
    toast.info(message, { description });
  },

  // Warning notifications
  warning: (message: string, description?: string) => {
    toast.warning(message, { description });
  },

  // Loading state
  loading: (message: string) => {
    return toast.loading(message);
  },

  // Promise-based notification
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages);
  },

  // Custom notifications for SkilTrak actions
  skiltrak: {
    quoteSent: (quoteNumber: string) => {
      toast.success('Quote sent successfully! 📧', {
        description: `Quote ${quoteNumber} has been sent to the client.`,
      });
    },

    paymentComplete: (amount: number) => {
      toast.success('Payment completed! 🎉', {
        description: `Successfully processed $${amount.toFixed(2)}`,
      });
    },

    tierCreated: (tierName: string) => {
      toast.success('Pricing tier created', {
        description: `${tierName} is now available for selection.`,
      });
    },

    addOnCreated: (addOnName: string) => {
      toast.success('Add-on created', {
        description: `${addOnName} has been added to the catalog.`,
      });
    },

    lowCredits: (remaining: number) => {
      toast.warning('Low credit balance ⚠️', {
        description: `Only ${remaining} credits remaining. Consider purchasing more.`,
      });
    },

    creditsPurchased: (amount: number) => {
      toast.success('Credits purchased! ⚡', {
        description: `${amount} credits added to your account.`,
      });
    },

    discountApprovalNeeded: (percentage: number) => {
      toast.info('Approval required', {
        description: `Discount of ${percentage}% requires manager approval.`,
      });
    },

    exportComplete: (filename: string) => {
      toast.success('Export completed', {
        description: `${filename} has been downloaded.`,
      });
    },

    draftSaved: () => {
      toast.success('Draft saved', {
        description: 'Your changes have been saved automatically.',
      });
    },

    draftRestored: () => {
      toast.info('Draft restored', {
        description: 'Your previous work has been restored.',
      });
    },
  },
};

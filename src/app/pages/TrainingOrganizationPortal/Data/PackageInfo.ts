export const buildPackageInfo = (
    subscription: any,
    organization: any,
    creditBalance: any
) => {
    const tier = subscription?.pricing_tier || subscription?.tier;

    return {
        name: creditBalance?.package_name || "Standard Package",

        totalCredits: creditBalance?.totalCredits || creditBalance?.credits_remaining || 0,

        usedCredits:
            creditBalance?.credits_used ||
            (creditBalance?.totalCredits || 0) -
            (creditBalance?.remainingCredits || 0),

        remainingCredits:
            creditBalance?.remainingCredits ||
            creditBalance?.credits_remaining,

        renewalDate: creditBalance?.expiryDate,

        status: subscription?.status?.toLowerCase(),

        billingCycle:
            creditBalance?.billingCycle?.toLowerCase() ||
            subscription?.billing_cycle?.toLowerCase(),

        orgName: organization?.name,

        orgType: organization?.organization_type || organization?.type,

        tier: tier?.name || "Basic",

        annualLicense: {
            type: subscription?.data?.plan_type,

            startDate: subscription?.data?.start_date,

            endDate: subscription?.data?.end_date,

            studentCapacity: {
                min: subscription?.data?.pricing_tier?.min_students,
                max: subscription?.data?.pricing_tier?.max_students
            },

            currentStudents:
                subscription?.data?.current_students,

            price:
                subscription?.data?.annual_price ,

            setupFee: 500, // static if not in API
            setupFeePaid: subscription?.data?.setup_fee_paid,
        },

        subscription: {
            startDate: subscription?.data?.start_date,
            contractLength: "12 months",
            autoRenew: subscription?.data?.auto_renew,
            cancellationDeadline: subscription?.data?.next_billing_date,
            nextBillingDate: subscription?.data?.next_billing_date,
        },

        // ⚠️ Not available from APIs → mock or backend required
        overages: null,

        // ⚠️ Not available → backend needed
        complianceStatus: null,
    };
};
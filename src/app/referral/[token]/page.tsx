import ReferralViewer from '@/components/collaboration/referral-viewer';

interface ReferralPageProps {
    params: Promise<{
        token: string;
    }>;
}

export default async function ReferralPage({ params }: ReferralPageProps) {
    const { token } = await params;

    return <ReferralViewer token={token} />;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ReferralPageProps) {
    return {
        title: 'Professional Dental Referral - Noble Dental Care',
        description: 'Secure, DPDPA-compliant dental referral summary',
        robots: 'noindex, nofollow' // Don't index referral pages
    };
}

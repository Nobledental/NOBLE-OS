import { AppointmentGrid } from "@/components/booking/appointment-grid";
import { supabase } from "@/lib/supabase";

interface PageProps {
    params: {
        clinicId: string;
    };
}

export default async function BookingPage({ params }: PageProps) {
    const { clinicId } = params;

    // Fetch Clinic Config Server-Side
    const { data: config } = await supabase
        .from('clinic_configs')
        .select('*')
        .eq('clinic_id', clinicId)
        .single();

    return <AppointmentGrid clinicId={clinicId} initialConfig={config} />;
}

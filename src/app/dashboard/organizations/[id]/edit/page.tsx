'use client';

import { useParams } from 'next/navigation';
import OrganizationForm from '@/components/OrganizationForm';

export default function EditOrganizationPage() {
    const params = useParams();
    const organizationId = parseInt(params.id as string);

    return <OrganizationForm mode="edit" organizationId={organizationId} />;
}

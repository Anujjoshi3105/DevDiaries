import React, { Suspense } from 'react';
import NewPassword from '@/components/auth/NewPassword';

export default function page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NewPassword />
        </Suspense>
    );
}

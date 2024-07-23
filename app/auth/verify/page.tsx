import { Suspense } from 'react';
import Verify from '@/components/auth/Verify';

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Verify />
    </Suspense>
  );
}

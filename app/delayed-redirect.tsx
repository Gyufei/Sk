'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function DelayedRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const target = searchParams.get('target');

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(target || '/en');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, target]);

  return null;
}
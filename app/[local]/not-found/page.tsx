"use client";

import { useEffect } from 'react';
import { useRouter } from "@/app/navigation";

import { useTranslations } from 'next-intl';

export default function NotFound() {
  const router = useRouter();
  const T = useTranslations('Common');

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">{T('PageNotFound')}</p>
      <p className="text-md mt-2">{T('RedirectingToHome')}</p>
    </div>
  );
}

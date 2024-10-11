"use client";

import { useEffect, useState } from 'react';
import { useRouter } from "@/app/navigation";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [router]);

  return null
}

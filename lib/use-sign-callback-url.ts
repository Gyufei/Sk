import { useSearchParams } from "next/navigation";

export function useSignCallbackUrl() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  function getCallbackUrl() {
    const path = from ? `/${from}` : "/home";
    return window.location.origin + path;
  }

  return { getCallbackUrl };
}

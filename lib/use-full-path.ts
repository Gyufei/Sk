import { usePathname } from "@/app/navigation";
import { getHost } from "./utils/browser";

export function useFullPath() {
  const pathname = usePathname();
  const host = getHost();

  if (!host) return pathname;

  if (host.includes("localhost") || host.includes("preview")) {
    return pathname;
  }

  if (host === "brands.juu17.com") {
    return `/brands${pathname}`;
  }

  if (host === "one.juu17.com") {
    return `/one${pathname}`;
  }

  return pathname;
}

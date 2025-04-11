export function getHost() {
  if (typeof window !== "undefined") {
    return window.location.hostname;
  }
  return "";
}

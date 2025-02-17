export function useSignCallbackUrl() {
  function getCallbackUrl() {
    return window.location.href;
  }

  return { getCallbackUrl };
}

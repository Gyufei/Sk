export function useSignCallbackUrl() {
  function getCallbackUrl() {
    return (
      window.location.origin + window.location.pathname + window.location.search
    );
  }

  return { getCallbackUrl };
}

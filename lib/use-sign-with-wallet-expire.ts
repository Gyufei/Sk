const ExpireKey = "signAt";

export function useSignWithWalletExpire() {
  function getSignWithWalletTime() {
    const lt = localStorage.getItem(ExpireKey);
    if (!lt) return;
    return Number(lt);
  }

  function setSignWithWalletTime() {
    localStorage.setItem(ExpireKey, Date.now().toString());
  }

  return {
    getSignWithWalletTime,
    setSignWithWalletTime,
  };
}

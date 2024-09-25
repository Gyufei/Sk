export function genSignMsg() {
  const ts = Math.round(new Date().getTime() / 1000);
  const salt = btoa(`${ts}`);

  const msg = JSON.stringify({
    message: "Welcome to Juu17 Club",
    salt: salt,
  });

  return {
    salt,
    msg,
  };
}

export function genOffChainClaimMsg(eventName: string, claimVersion: number) {
  const ts = Math.round(new Date().getTime() / 1000);
  const salt = btoa(`${ts}`);

  const msg = JSON.stringify({
    auction: "claim",
    event_name: eventName,
    claim_version: claimVersion,
    salt,
  });

  return {
    salt,
    msg,
  };
}

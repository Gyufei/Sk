export function genSignMsg() {
  const ts = Math.round(new Date().getTime() / 1000);
  const salt = btoa(`${ts}`);

  const msg = JSON.stringify({
    message: "welcome to juu17 club",
    salt: salt,
  });

  return {
    salt,
    msg,
  };
}

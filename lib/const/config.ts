import { isProduction } from "../api/path";

export const GoogleClientId = isProduction
  ? ""
  : "901355214678-litp58raporctginmttjk7jaqa0t7dsb.apps.googleusercontent.com";

export const TgConfig = isProduction
  ? {
      botName: "",
      botId: "",
    }
  : {
      botName: "Juu17SiteBot",
      botId: "7905537340",
    };

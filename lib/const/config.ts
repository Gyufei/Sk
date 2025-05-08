import { isProduction } from "../api/path";

export const GoogleClientId = isProduction
  ? "369418276123-o08grpmn84s7bboj25u7mp9r1p8903ne.apps.googleusercontent.com"
  : "901355214678-litp58raporctginmttjk7jaqa0t7dsb.apps.googleusercontent.com";

export const TgConfig = {
  botName: process.env.NEXT_PUBLIC_TELEGRAM_BOT_HANDLE,
  botId: process.env.NEXT_PUBLIC_TELEGRAM_BOT_UID,
  tgBotUrl: "https://t.me/Juu17BrandsBot",
};

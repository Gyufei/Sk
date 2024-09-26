export const isPreview = process.env.NEXT_PUBLIC_IS_PREVIEW === "1";
export const isProduction = process.env.NODE_ENV === "production" && !isPreview;

const ProdHost = "https://api.juu17.com";
const DevHost = "https://juu17-api-dev.vercel.app";
export const ApiHost = isProduction ? ProdHost : DevHost;

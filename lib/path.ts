const ProdHost = 'https://api.juu17.com';
const DevHost = 'https://api.juu17.com';
// const DevHost = 'https://juu17-api-dev.vercel.app';
export const ApiHost = process.env.NODE_ENV === "production" ? ProdHost : DevHost;

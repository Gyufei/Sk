// const ProdHost = 'https://api.juu17.com';
const ProdHost = 'https://juu17-api-dev.vercel.app';
const DevHost = 'https://juu17-api-dev.vercel.app';
// const DevHost = 'https://api.juu17.com';
export const ApiHost = process.env.NODE_ENV === "production" ? ProdHost : DevHost;

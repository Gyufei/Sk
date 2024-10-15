/* eslint-disable no-undef */
"use client";

// // Generate browser fingerprint
// function generateFingerprint(): string {
//   const components = [
//     navigator.userAgent,
//     navigator.language,
//     screen.colorDepth,
//     screen.width + 'x' + screen.height,
//     new Date().getTimezoneOffset(),
//     !!window.sessionStorage,
//     !!window.localStorage,
//     !!window.indexedDB,
//   ];

//   // Use a simple hash function
//   return components.join('|').split('').reduce((a, b) => {
//     a = ((a << 5) - a) + b.charCodeAt(0);
//     return a & a;
//   }, 0).toString(36);
// }

// Cache the fingerprint to avoid recalculating on every request
let cachedFingerprint: string | null = null;

export default async function fetcher(
  input: URL | RequestInfo,
  init?: RequestInit | undefined,
) {
  try {
    // Generate or retrieve the cached fingerprint
    if (!cachedFingerprint) {
      // cachedFingerprint = generateFingerprint();
    }

    // Add the fingerprint to the request headers
    const headers = new Headers(init?.headers || {});
    // headers.set('pudgy', cachedFingerprint);

    // Update the init object
    const updatedInit: RequestInit = {
      ...init,
      headers,
    };

    const res = await fetch(input, updatedInit);

    if (!res.ok) {
      const error = new Error(
        "An error occurred while fetching the data.",
      ) as any;

      if (res.status === 422) {
        error.info = "params error, sign failed";
      }

      if (!error.info) {
        const resBody = await res.text();
        const errorTip =
          resBody.length > 100 ? "Failed: An error occurred" : resBody;
        error.info = errorTip;
      }

      error.status = res.status;

      throw error;
    }

    const json = await res.json();
    return json?.data || json;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

"use client";

export default async function fetcher(
  input: URL | RequestInfo,
  init?: RequestInit | undefined,
) {
  try {
    const headers = new Headers(init?.headers || {});

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

import fetcher from "./fetcher";
import { ApiHost } from "./path";

export function useSubmitDataUrl() {

  async function submitDataUrl(params: { twitter_id: string; tweet_id: string }) {

    const res: any = await fetcher(`${ApiHost}/tweet/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        twitter_id: params.twitter_id,
        tweet_id: params.tweet_id,
      }),
    });

    return res;
  }

  return {
    submitDataUrl,
  };
}

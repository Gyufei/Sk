import { ApiHost } from "./path";
import useSWR from "swr";
import fetcher from "./fetcher";

export function useEventsData() {

  async function fetchAllEventsData() {
    const res: Array<{
      project_name: string,
      claim_version: number
    }>  = await fetcher(`${ApiHost}/static/events.json`);

    const eventData = await Promise.all(res.map(async (item) => {
      const eD = await fetcher(`${ApiHost}/events?project_name=${item.project_name}`)
      return {
        ...item,
        ...eD,
      }
    }))

    return eventData
  }


  const res = useSWR('events', fetchAllEventsData);

  return res;
}

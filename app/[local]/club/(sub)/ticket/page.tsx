"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import { GoBackTo } from "@/components/go-back-to";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import fetcher from "@/lib/api/fetcher";
import { ApiHost } from "@/lib/api/path";
import { useAtomValue } from "jotai";
import { UuidAtom } from "@/lib/api/state";
import { useTranslations } from "next-intl";
import { useRecentTickets } from "@/lib/api/use-recent-tickets";
import { formatDate } from "@/lib/utils/utils";
import { GlobalMsgContext } from "@/components/global-msg-context";

export default function Page() {
  const T = useTranslations("Common");
  const { setGlobalMessage } = useContext(GlobalMsgContext);
  const uuid = useAtomValue(UuidAtom);
  const { data: recentTickets } = useRecentTickets();

  const [topic, setTopic] = useState("");
  const [topicOpen, setTopicOpen] = useState(false);
  const topicArr = ["General", "ClothSizes", "ScheduleTalk"];
  const [content, setContent] = useState("");
  const [contact, setContact] = useState("");

  const [topicValid, setTopicValid] = useState(true);
  const [contactValid, setContactValid] = useState(true);
  const [contentValid, setContentValid] = useState(true);

  async function saveTopic() {
    if (!topic) {
      setTopicValid(false);
    }

    if (!content) {
      setContentValid(false);
    }

    if (!contact) {
      setContactValid(false);
    }

    if (!topic || !content || !contact) {
      return;
    }

    const res: any = await fetcher(`${ApiHost}/ticket/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uuid,
        topic,
        content,
        contact,
      }),
    });

    if (!res) {
      console.error("saveExchange error");
      setGlobalMessage({
        type: "error",
        message: "Submit failed, please try again",
      });
      return;
    }

    setGlobalMessage({
      type: "success",
      message: "Ticket submitted successfully",
    });

    setTopic("");
    setContent("");
    setContact("");
  }

  function handleTopicSelected(v: string) {
    setTopic(v);
    setTopicValid(true);
    setTopicOpen(false);
  }

  function handleContentInput(v: string) {
    setContent(v);
    setContentValid(!!v);
  }

  function handleContactInput(v: string) {
    setContact(v);
    setContactValid(!!v);
  }

  return (
    <div className="relative -left-[100px]">
      <div className="relative  flex items-center justify-end">
        <GoBackTo />
      </div>
      <div className="mb-[20px] mt-6 w-[600px] rounded-[20px] bg-[rgba(255,255,255,0.1)] p-6 backdrop-blur-md">
        <div className="text-xl font-semibold leading-[30px] text-white">
          {T("SubmitTicket")}
        </div>
        <div className="mt-5">{T("Topic")}</div>
        <Popover
          open={topicOpen}
          onOpenChange={(isOpen) => setTopicOpen(isOpen)}
        >
          <PopoverTrigger asChild>
            <div
              onClick={() => setTopicOpen(!topicOpen)}
              className="flex h-12 w-full items-center justify-between border-b border-solid"
              style={{
                borderBottomColor: topicValid ? "#464646" : "#ff5a5a",
              }}
            >
              <div className="flex items-center">
                <div className="text-sm leading-6 text-white">{topic}</div>
              </div>
              <Image
                data-open={topicOpen}
                src="/icons/arrow-down.svg"
                width={24}
                height={24}
                alt="down"
                className="data-[open=true]:rotate-180"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="no-scroll-bar mt-1 flex h-fit w-[552px] flex-col items-stretch space-y-2 overflow-y-auto rounded-2xl border-none bg-[#262626] p-4 outline-none">
            {topicArr.map((c) => (
              <div
                key={c}
                className="flex h-12 cursor-pointer items-center rounded-xl py-[5px] hover:bg-[rgba(255,255,255,0.05)]"
                onClick={() => {
                  handleTopicSelected(c);
                }}
              >
                <div
                  className="ml-3 text-sm leading-6 text-[]"
                  style={{
                    color:
                      topic === c
                        ? "rgba(255,255,255)"
                        : "rgba(255,255,255,0.6)",
                  }}
                >
                  {T(c)}
                </div>
              </div>
            ))}
          </PopoverContent>
        </Popover>
        <div className="mt-10">{T("Content")}</div>
        <div>
          <textarea
            value={content}
            onChange={(e) => handleContentInput(e.target.value)}
            className="h-24 w-full border-b border-solid bg-transparent text-base text-white outline-none"
            style={{
              borderBottomColor: contentValid ? "#464646" : "#ff5a5a",
            }}
          />
        </div>
        <div className="mt-10">{T("Contact")}</div>

        <div>
          <Input
            value={contact || ""}
            onChange={(e: any) => handleContactInput(e.target.value)}
            className="h-12 w-full rounded-none border-b border-[rgba(255,255,255,0.2)] bg-transparent pl-0 text-base text-white"
            placeholder=""
            style={{
              borderBottomColor: contactValid ? "#464646" : "#ff5a5a",
            }}
          />
        </div>

        <div
          onClick={saveTopic}
          className="mt-10 flex h-12 w-40 cursor-pointer items-center justify-center rounded-xl border border-solid border-[rgba(255,255,255,0.2)] text-base font-semibold leading-6 text-[rgba(255,255,255,0.6)] hover:text-white"
        >
          Submit
        </div>
      </div>

      <div className="mt-10 px-6">
        <div className="font-haasDisp text-xl font-semibold leading-[30px] text-white">
          {T("RecentTickets")}
        </div>
        <div className="mt-5">
          {!recentTickets?.length && (
            <div className="flex h-[50px] items-center justify-start">
              {T("NoData")}
            </div>
          )}
          {(recentTickets || []).map((c: any) => (
            <div
              key={c.id}
              className="flex h-12 items-center justify-between text-base leading-6 text-[#d6d6d6]"
              style={{
                boxShadow: "inset 0px -1px 0px 0px rgba(255, 255, 255, 0.2)",
              }}
            >
              <div>{c.id}</div>
              <div>{formatDate(c.create_at)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

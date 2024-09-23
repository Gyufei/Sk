"use client";

import { useState } from "react";
import Image from "next/image";
import { GoBackTo } from "@/components/go-back-to";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export default function Page() {
  const [topic, setTopic] = useState("");
  const [topicOpen, setTopicOpen] = useState(false);
  const topicArr = [
    "TextTextTextTextTextText1",
    "TextTextTextTextTextText2",
    "TextTextTextTextTextText3",
    "TextTextTextTextTextText4",
  ];
  const [content, setContent] = useState("");
  const [contact, setContact] = useState("");

  return (
    <div className="absolute md:-left-1/2 md:top-[15%]">
      <div className="relative flex items-center justify-end">
        <GoBackTo />
      </div>
      <div className="mb-[20px] mt-6 w-[600px] rounded-[20px] bg-[rgba(255,255,255,0.1)] p-6 backdrop-blur-md">
        <div className="text-xl font-semibold leading-[30px] text-white">
          Submit Ticket
        </div>
        <div className="mt-5">Topic</div>
        <Popover
          open={topicOpen}
          onOpenChange={(isOpen) => setTopicOpen(isOpen)}
        >
          <PopoverTrigger asChild>
            <div
              onClick={() => setTopicOpen(!topicOpen)}
              className="flex h-12 w-full items-center justify-between border-b border-solid border-[#464646]"
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
                  setTopic(c);
                  setTopicOpen(false);
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
                  {c}
                </div>
              </div>
            ))}
          </PopoverContent>
        </Popover>
        <div className="mt-10">Content</div>
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-24 w-full border-b border-solid border-[#464646] bg-transparent text-base text-white outline-none"
          />
        </div>
        <div className="mt-10">Contact</div>

        <div>
          <Input
            value={contact || ""}
            onChange={(e: any) => setContact(e.target.value)}
            className="h-12 w-full rounded-none border-b border-[rgba(255,255,255,0.2)] bg-transparent pl-0 text-base text-white"
            placeholder=""
          />
        </div>

        <div className="mt-10 flex h-12 w-40 cursor-pointer items-center justify-center rounded-xl border border-solid border-[rgba(255,255,255,0.2)] text-base font-semibold leading-6 text-[rgba(255,255,255,0.6)] hover:text-white">
          Submit
        </div>
      </div>

      <div className="mt-10 px-6">
        <div className="font-haasDisp text-xl font-semibold leading-[30px] text-white">
          Recent Tickets
        </div>
        <div className="mt-5">
          <div
            className="flex h-12 items-center justify-between text-base leading-6 text-[#d6d6d6]"
            style={{
              boxShadow: "inset 0px -1px 0px 0px rgba(255, 255, 255, 0.2)",
            }}
          >
            <div>ZT912803810120KS01</div>
            <div>2024-4-1 23:11:11</div>
          </div>
        </div>
      </div>
    </div>
  );
}

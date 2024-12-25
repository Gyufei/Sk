"use client";

import { useContext, useState, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { GoBackTo } from "@/components/go-back-to";
import { Input } from "@/components/ui/input";
import fetcher from "@/lib/api/fetcher";
import { ApiHost } from "@/lib/api/path";
import { useAtomValue } from "jotai";
import { UuidAtom } from "@/lib/api/state";
import { useTranslations } from "next-intl";
import { useRecentTickets } from "@/lib/api/use-recent-tickets";
import { formatDate } from "@/lib/utils/utils";
import { GlobalMsgContext } from "@/components/global-msg-context";
import ReCAPTCHA from "react-google-recaptcha";
import { BreadCrumbs } from "@/components/bread-crumbs";
import { PopDrawer } from "@/components/pop-drawer";
import topicConfig from './topic_config.json';
const ReCAPTCHAKey = "6Ldtt2sqAAAAADNjoSXTRuzrWTQHcKYmIvDk_BjV";
const topics = topicConfig.topics;
const defaultQuestion = topicConfig.defaultQuestion;
type TopicKey = keyof typeof topics;

export default function Page() {
  const T = useTranslations("Common");
  const { setGlobalMessage } = useContext(GlobalMsgContext);
  const uuid = useAtomValue(UuidAtom);
  const { data: recentTickets } = useRecentTickets();
  const captchaInst = useRef<ReCAPTCHA>(null);

  const [topic, setTopic] = useState("");

  const [topicOpen, setTopicOpen] = useState(false);
  const topicArr = ["General", "ClothSizes", "ScheduleTalk"];
  const [question, setQuestion] = useState<Record<string, QuestionType>>(defaultQuestion);
  const [qContent, setQContent] = useState<Record<string, string>>({});
  const [qValid, setQValid] = useState<Record<string, boolean | undefined>>({});
  const [topicValid, setTopicValid] = useState(true);

  const [reCaptchaValue, setReCaptchaValue] = useState<string | null>(null);
  
  const isValid = useMemo(() => {
    const qKeys = Object.keys(question);
    const errorIndex = qKeys.findIndex((key) => qValid[key] !== true)
    if (errorIndex > -1 || !topic) {
      return false
    }
    return true
  }, [question, qValid, topicValid])

  const handleReCaptchaChange = useCallback((value: string | null) => {
    setReCaptchaValue(value);
  }, []);

  async function saveTopic() {
    const qKeys = Object.keys(question);
    const errorIndex = qKeys.findIndex((key) => qValid[key] !== true)
    if (errorIndex > -1) {
      return 
    }

    if (!reCaptchaValue) {
      return;
    }
    
    if (!topic) {
      setTopicValid(false);
      return;
    }

    const contentObj = {} as Record<string, string>;
    qKeys.map((key) => {
      contentObj[key] =  (qContent[key] || '').trim()
    })
    const res: any = await fetcher(`${ApiHost}/ticket/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uuid,
        topic,
        content: contentObj,
        recaptcha: reCaptchaValue,
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
    setQuestion(defaultQuestion)
    setQContent({})
    setQValid({})

    captchaInst.current?.reset();
    setReCaptchaValue(null);
  }

  function handleTopicSelected(v: string) {
    setTopic(v);
    setTopicValid(true);
    setQuestion(topics[v as TopicKey].preset_template);
    setTopicOpen(false);
  }

  function handleQuestionValueChange(name: string, value: string) {
    const values = {
      ...qContent,
      ...{ [name]: value  }
    };
    setQContent(values)
  }

  function handleQuestionValidChange(name: string, value: boolean) {
    const values = {
      ...qValid,
      ...{ [name]: value  }
    };
    setQValid(values)
  }

  return (
    <div className="relative h-full content-w-600">
      <div className="relative flex flex-row-reverse sm:flex-row items-end justify-between">
        <BreadCrumbs />
        <GoBackTo />
      </div>
      <div className="mb-[20px] mt-6 rounded-[20px] bg-[rgba(255,255,255,0.1)] p-[20px] sm:p-6 backdrop-blur-md">
        <div className="text-xl font-semibold leading-[30px] text-white">
          {T("SubmitTicket")}
        </div>
        <div className="mt-5 text-[20px] sm:text-xl ">{T("Topic")}</div>
        <PopDrawer
          title={T("Topic")}
          open={topicOpen}
          onOpenChange={(isOpen) => setTopicOpen(isOpen)}
          popContentClass={'h-fit w-[552px]'}
          className={"h-[400px]"}
          popContent={topicArr.map((c) => (
            <div
              key={c}
              className="flex h-12 cursor-pointer items-center border-b border-solid border-[#515151] py-[5px] hover:brightness-75"
              onClick={() => {
                handleTopicSelected(c);
              }}
            >
              <div
                className="ml-3 text-base sm:text-sm leading-6"
                style={{
                  color:
                    topic === c
                      ? "rgba(255,255,255)"
                      : "#d6d6d6",
                }}
              >
                {T(c)}
              </div>
            </div>
          ))}
        >
          <div
              onClick={() => setTopicOpen(!topicOpen)}
              className="flex h-12 w-full items-center justify-between border-b border-solid"
              style={{
                borderBottomColor: topicValid ? "#464646" : "#ff5a5a",
              }}
            >
              <div className="flex items-center">
                <div className="text-base leading-6 text-white">{topic && T(topic) || ''}</div>
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
        </PopDrawer>
        {
          Object.keys(question).map((key) => {
            return (
              <QuestionItem
                key={key}
                question={question[key]}
                value={qContent[key]}
                valid={qValid[key]}
                onValueChange={handleQuestionValueChange}
                onValidChange={handleQuestionValidChange}
              />
            )
          })
        }
        <div className="mt-10 flex flex-col items-center sm:flex-row">
          <div className="recaptcha-container mb-4 sm:mb-0">
            <ReCAPTCHA
              ref={captchaInst}
              sitekey={ReCAPTCHAKey}
              onChange={handleReCaptchaChange}
              onErrored={console.log}
            />
          </div>
          <button
            disabled={
              !isValid || !reCaptchaValue
            }
            onClick={() => saveTopic()}
            className="flex h-12 w-40 cursor-pointer items-center justify-center rounded-xl border border-solid border-[rgba(255,255,255,0.2)] text-base font-semibold leading-6 text-[rgba(255,255,255,0.6)] hover:text-white disabled:cursor-not-allowed disabled:brightness-50 disabled:hover:text-[rgba(255,255,255,0.6)] sm:ml-4"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="sm:mt-10 sm:px-6">
        <div className="font-haasDisp text-xl font-semibold leading-[30px] text-white">
          {T("RecentTickets")}
        </div>
        <div className="mt-5 text-xl">
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


type QuestionType = {
  type: string,
  name: string;
  errorMsg: string;
  regex: string;
}

type QuestionItemProps = {
  question: QuestionType;
  value?: string;
  valid?: boolean;
  onValueChange: (name: string, value: string) => void;
  onValidChange: (name: string, value: boolean) => void;
}
function QuestionItem({
  question,
  value = '',
  valid = true,
  onValueChange,
  onValidChange
}: QuestionItemProps) {
  const {
    type,
    name,
    errorMsg,
  } = question;
  const T = useTranslations("Common");
  function handleInputChange(v: string) {
    const validV = (v || '').trim()
    onValueChange(name, v);
    const regex = new RegExp(question.regex);
    onValidChange(name, regex.test(validV))
  }

  return (
    <>
      <div className="mt-10 text-[20px] sm:text-xl">{T(name)}</div>
      <div>
        {
          type === "textArea" ? (
            <textarea
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
              className="py-2 h-12 w-full border-b border-solid bg-transparent text-base text-white outline-none min-h-[48px]"
              style={{
                borderBottomColor: valid ? "#464646" : "#ff5a5a",
              }}
            />
          ) : (
            <Input
              value={value || ""}
              onChange={(e) => handleInputChange(e.target.value)}
              className="h-12 w-full rounded-none border-b border-[rgba(255,255,255,0.2)] bg-transparent pl-0 text-base text-white"
              placeholder=""
              style={{
                borderBottomColor: valid ? "#464646" : "#ff5a5a",
              }}
            />
          )
        }
       
        {!valid && errorMsg && (
          <div className="mt-1 text-sm text-red-500">
            {errorMsg}
          </div>
        )}
      </div>
    </>
  )
}
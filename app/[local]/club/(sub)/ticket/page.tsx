"use client";

import {
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
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
import { FieldType, topicConfig } from "./topic_config";
const ReCAPTCHAKey = "6Ldtt2sqAAAAADNjoSXTRuzrWTQHcKYmIvDk_BjV";
const topics = topicConfig.topics;
type TopicKey = keyof typeof topics;

export default function Page() {
  const T = useTranslations("Ticket");
  const { setGlobalMessage } = useContext(GlobalMsgContext);
  const uuid = useAtomValue(UuidAtom);
  const { data: recentTickets, mutate } = useRecentTickets();
  const captchaInst = useRef<ReCAPTCHA>(null);

  const [topic, setTopic] = useState("");

  const [topicOpen, setTopicOpen] = useState(false);
  const topicArr = ["General", "ClothSizes", "ScheduleTalk"];
  const [question, setQuestion] = useState<QuestionType[]>([]);
  const [qContent, setQContent] = useState<Record<string, string>>({});
  const [qValid, setQValid] = useState<Record<string, boolean | undefined>>({});
  const [topicValid, setTopicValid] = useState(true);

  const [reCaptchaValue, setReCaptchaValue] = useState<string | null>(null);

  const isValid = useMemo(() => {
    const qKeys = question.map((item) => item.name);
    const errorIndex = qKeys.findIndex((key) => qValid[key] !== true);
    if (errorIndex > -1 || !topic) {
      return false;
    }
    return true;
  }, [question, qValid, topicValid]);

  const handleReCaptchaChange = useCallback((value: string | null) => {
    setReCaptchaValue(value);
  }, []);

  async function saveTopic() {
    const qKeys = question.map((item) => item.name);
    const errorIndex = qKeys.findIndex((key) => qValid[key] !== true);
    if (errorIndex > -1) {
      return;
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
      contentObj[key] = (qContent[key] || "").trim();
    });
    const res: any = await fetcher(`${ApiHost}/ticket/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uuid,
        topic,
        content: JSON.stringify(contentObj),
        contact: contentObj.Contact || "",
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
    setQuestion([]);
    setQContent({});
    setQValid({});
    mutate();
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
      ...{ [name]: value },
    };
    setQContent(values);
  }

  function handleQuestionValidChange(name: string, value: boolean) {
    const values = {
      ...qValid,
      ...{ [name]: value },
    };
    setQValid(values);
  }

  return (
    <div className="no-scroll-bar content-w-600 sm:trans-scroll-bar relative h-full overflow-y-auto sm:max-h-[calc(100%-40px)]">
      <div className="relative flex flex-row-reverse items-end justify-between sm:flex-row">
        <BreadCrumbs />
        <GoBackTo />
      </div>
      <div className="mb-[20px] mt-6 rounded-[20px] bg-[rgba(255,255,255,0.1)] p-[20px] backdrop-blur-md sm:p-6">
        <div className="text-xl font-semibold leading-[30px] text-white">
          {T("SubmitTicket")}
        </div>
        <div className="mt-5 text-[20px] sm:text-xl ">{T("Topic")}</div>
        <PopDrawer
          title={T("Topic")}
          open={topicOpen}
          onOpenChange={(isOpen) => setTopicOpen(isOpen)}
          popContentClass={"h-fit w-[552px]"}
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
                className="ml-3 text-base leading-6 sm:text-sm"
                style={{
                  color: topic === c ? "rgba(255,255,255)" : "#d6d6d6",
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
              <div className="text-base leading-6 text-white">
                {(topic && T(topic)) || "--"}
              </div>
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
        {question.map((item) => {
          return (
            <QuestionItem
              key={item.name}
              question={item}
              value={qContent[item.name]}
              valid={qValid[item.name]}
              onValueChange={handleQuestionValueChange}
              onValidChange={handleQuestionValidChange}
            />
          );
        })}
        {topic && (
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
              disabled={!isValid || !reCaptchaValue}
              onClick={() => saveTopic()}
              className="flex h-12 w-40 cursor-pointer items-center justify-center rounded-xl border border-solid border-[rgba(255,255,255,0.2)] text-base font-semibold leading-6 text-[rgba(255,255,255,0.6)] hover:text-white disabled:cursor-not-allowed disabled:brightness-50 disabled:hover:text-[rgba(255,255,255,0.6)] sm:ml-4"
            >
              Submit
            </button>
          </div>
        )}
      </div>
      {!recentTickets?.length && (
        <div className="sm:mt-10 sm:px-6">
          <div className="font-haasDisp text-xl font-semibold leading-[30px] text-white">
            {T("RecentTickets")}
          </div>
          <div className="mt-5 text-xl">
            {/* <div className="flex h-[50px] items-center justify-start">
              {T("NoData")}
            </div> */}

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
      )}
    </div>
  );
}

type QuestionType = {
  name: string;
  label: string;
  type: string;
  errorMsg: string;
  regex: RegExp;
};

type QuestionItemProps = {
  question: QuestionType;
  value?: string;
  valid?: boolean;
  onValueChange: (name: string, value: string) => void;
  onValidChange: (name: string, value: boolean) => void;
};
function QuestionItem({
  question,
  value = "",
  valid = true,
  onValueChange,
  onValidChange,
}: QuestionItemProps) {
  const { type, name, label, errorMsg } = question;
  const T = useTranslations("Ticket");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  function handleInputChange(v: string) {
    const validV = (v || "").trim();
    onValueChange(name, v);
    onValidChange(name, question.regex.test(validV));
  }

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <>
      <div className="mt-10 text-[20px] sm:text-xl">{T(label)}</div>
      {type === FieldType.TEXTAREA ? (
        <textarea
          ref={textareaRef}
          wrap="soft"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          className="box-border h-12 w-full border-b border-solid bg-transparent py-2 text-base text-white outline-none"
          style={{
            resize: "none",
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
      )}

      {!valid && errorMsg && (
        <div className="mt-1 text-sm text-red-500">{errorMsg}</div>
      )}
    </>
  );
}

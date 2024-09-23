"use client";
import { useEffect, useState } from "react";
import { useSubmitDataUrl } from "@/lib/use-submit-data-url";
import Image from "next/image";

export default function Tools() {
  const [dataUrl, setDataUrl] = useState("");
  const [statusText, setStatusText] = useState("");

  function handleDataChange(v: string) {
    const newV = v.replace(/(^\s*)|(\s*$)/g, "");
    setDataUrl(newV);
  }

  const { submitDataUrl } = useSubmitDataUrl();

  async function handleSubmit() {
    if (statusText == "sending...") {
      return;
    }
    setStatusText("sending...");

    const regex =
      /https:\/\/(twitter|x).com\/(?<twitter_id>[a-zA-Z0-9_-]{2,15})\/status\/(?<tweet_id>\d{10,20})/g;

    const regResult = regex.exec(dataUrl);

    if (!regResult || !regResult.groups) return;

    const res: any = await submitDataUrl({
      twitter_id: regResult.groups.twitter_id,
      tweet_id: regResult.groups.tweet_id,
    });
    setStatusText(JSON.stringify(res));
    if (res.status == true) {
      setDataUrl("");
    }
    return false;
  }

  const [urlInputBaseHeight, setUrlInputBaseHeight] = useState(0);

  useEffect(() => {
    const inputEl = document.getElementById("txtDataUrl");
    inputEl && setUrlInputBaseHeight(inputEl.clientHeight);
  }, []);

  function adjustHeight(el: HTMLElement) {
    el.style.height =
      el.scrollHeight > el.clientHeight
        ? el.scrollHeight + "px"
        : urlInputBaseHeight + "px";
  }

  return (
    <div className="top-content shift-animation">
      <div className="content-inner-box">
        <div className="div-block-7">
          <p className="paragraph-009">Tools</p>
        </div>
        <div className="text-block-para">====================</div>
        <div className="panel-para-text">
          <div className="html-embed-4 w-embed">
            <form className="update-form" action="">
              <textarea
                id="txtDataUrl"
                value={dataUrl}
                className="text-field w-input"
                placeholder="https://"
                onChange={(e: any) => {
                  handleDataChange(e.target.value);
                  adjustHeight(e.target);
                }}
                style={{
                  fontSize: "1em",
                  minHeight: "4.2em",
                  fontWeight: "400",
                }}
              ></textarea>
              <button
                className="submit-button w-button"
                type="button"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </form>
            <p className="my-4 text-xl">{statusText}</p>
          </div>
        </div>
        <Image
          src="/icons/ellipse_ico.svg"
          loading="lazy"
          width={8}
          height={8}
          alt=""
          className="point-1"
        />
        <Image
          src="/icons/ellipse_ico.svg"
          loading="lazy"
          width={8}
          height={8}
          alt=""
          className="point-2"
        />
      </div>
    </div>
  );
}

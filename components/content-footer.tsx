"use client";

import Image from "next/image";
import { useState } from "react";

export default function ContentFooter() {
  const [emailText, setEmailText] = useState("");

  function handleValChange(v: string) {
    const newV = v.replace(/(^\s*)|(\s*$)/g, "");
    setEmailText(newV);
  }

  return (
    <div className="bottom-content relative md:-left-[100px]">
      <div className="field-label-text">Dive a bit deeper</div>
      <div className="html-embed-4 w-embed">
        <form
          className="update-form"
          action="https://tally.so/r/mRo66p"
          method="get"
          target="_blank"
        >
          <input type="hidden" name="transparentBackground" value="1" />
          <input
            className="text-field w-input"
            required
            type="email"
            name="email"
            placeholder="Your email"
            maxLength={50}
            value={emailText}
            onChange={(e: any) => handleValChange(e.target.value)}
            style={{ fontWeight: "400" }}
          />
          <button
            className="normal-line-button submit-button w-button"
            type="submit"
          >
            Submit a request
          </button>
        </form>
      </div>
      <Image
        src="/icons/ellipse_ico.svg"
        loading="lazy"
        width={8}
        height={8}
        alt=""
        className="point-3"
      />
      <Image
        src="/icons/ellipse_ico.svg"
        loading="lazy"
        alt=""
        width={8}
        height={8}
        className="point-4"
      />
    </div>
  );
}

"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function ContentFooter() {
  const pathname = usePathname();

  if (pathname === "/club") {
    return null;
  }

  return (
    <div className="bottom-content">
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
          />
          <button className="submit-button w-button" type="submit">
            Submit a request
          </button>
        </form>
      </div>
      <Image
        src="./ellipse_ico.svg"
        loading="lazy"
        width={8}
        height={8}
        alt=""
        className="point-3"
      />
      <Image
        src="./ellipse_ico.svg"
        loading="lazy"
        alt=""
        width={8}
        height={8}
        className="point-4"
      />
    </div>
  );
}

import Image from "next/image";

export default function DragonIsh() {
  return (
    <div className="content-inner-box active">
      <div className="div-block-7">
        <p className="paragraph-009">Dragon-ish Program</p>
      </div>
      <div className="text-block-para">
        Incubate the blooming industry with valuable people together. Below are
        non-official groups created by community members and subscribers.
      </div>
      <div className="panel-para-text">
        <div className="div-block-5 unselected-item">
          <Image
            src="./telegram_logo.svg"
            loading="lazy"
            width={38}
            height={38}
            alt=""
            className="comm-icon"
          />
          <a href="https://t.me/juu17_fan" target="_blank">
            Juu17&apos;s Inner Great Carers
          </a>
        </div>
        <div className="div-block-5 unselected-item">
          <Image
            src="./telegram_logo.svg"
            width={38}
            height={38}
            loading="lazy"
            alt=""
            className="comm-icon"
          />
          <a href="https://t.me/+Ms4xuv2ETQkyZGE1" target="_blank">
            Juu17 Private Academy Node
          </a>
        </div>
        <div className="div-block-5 unselected-item">
          <Image
            src="./telegram_logo.svg"
            width={38}
            height={38}
            loading="lazy"
            alt=""
            className="comm-icon"
          />
          <a href="https://t.me/+TaA1mi_WKqNlYWY1" target="_blank">
            Juu17 Fight Back to School
          </a>
        </div>
        <div className="div-block-5 unselected-item">
          <Image
            src="./telegram_logo.svg"
            width={38}
            height={38}
            loading="lazy"
            alt=""
            className="comm-icon"
          />
          <a href="https://t.me/+eZiKDBujBjRjOTc1" target="_blank">
            Juu17 Inscription Discussion
          </a>
        </div>
      </div>
      <Image
        src="./ellipse_ico.svg"
        loading="lazy"
        width={8}
        height={8}
        alt=""
        className="point-1"
      />
      <Image
        src="./ellipse_ico.svg"
        loading="lazy"
        width={8}
        height={8}
        alt=""
        className="point-2"
      />
    </div>
  );
}

import ContentFooter from "@/components/content-footer";
import Image from "next/image";

export default function Service() {
  return (
    <>
      <div className="top-content shift-animation">
        <div className="content-inner-box">
          <div className="div-block-7">
            <p className="paragraph-009">Service</p>
          </div>
          <div className="text-block-para">Provided by me personally</div>
          <div>
            <div className="div-block-5 unselected-item">
              <div className="panel-para-text">- Market-making Consulting</div>
            </div>
            <div className="div-block-5 unselected-item">
              <div className="panel-para-text">- Legal Consulting</div>
            </div>
            <div className="div-block-5 unselected-item">
              <div className="panel-para-text">- Regulatory Consulting</div>
            </div>
            <div className="div-block-5 unselected-item">
              <div className="panel-para-text">- Financial Assistance</div>
            </div>
            <div className="div-block-5 unselected-item">
              <div className="panel-para-text">- Security Auditing</div>
            </div>
            <div className="div-block-5 unselected-item">
              <div className="panel-para-text">- Tokenomics Correcting</div>
            </div>
          </div>
          <Image
            src="/icons/ellipse_ico.svg"
            loading="lazy"
            alt=""
            width={8}
            height={8}
            className="point-1"
          />
          <Image
            src="/icons/ellipse_ico.svg"
            width={8}
            height={8}
            loading="lazy"
            alt=""
            className="point-2"
          />
        </div>
      </div>
      <ContentFooter />
    </>
  );
}

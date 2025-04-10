"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import { UuidAtom } from "@/lib/api/state";
import { useAtomValue } from "jotai/react";
import fetcher from "@/lib/api/fetcher";
import { ApiHost } from "@/lib/api/path";
import { useTranslations } from "next-intl";
import { useFetchUserInfo } from "@/lib/api/use-fetch-user-info";
import { SaveBtn } from "./save-btn";
import { countryCodeList, NameAndPhone } from "./name-and-phone";
import { AddressInput } from "./address-input";
import { StreetAndCode } from "./street-and-code";
import { useRecentLogisticsOrder } from "@/lib/api/use-recent-logistics-order";
import { formatDate } from "@/lib/utils/utils";
import { GlobalMsgContext } from "@/components/global-msg-context";

export default function ShippingAddressPage() {
  const uuid = useAtomValue(UuidAtom);
  const T = useTranslations("Common");
  const { setGlobalMessage } = useContext(GlobalMsgContext);
  const { data: userInfo, mutate: getUserInfo } = useFetchUserInfo();
  const { data: logisticsOrders } = useRecentLogisticsOrder();
  const [recipientName, setRecipientName] = useState(
    userInfo?.shipping?.recipient_name || "",
  );

  const [country, setCountry] = useState(userInfo?.shipping?.country || "中国");
  const [state, setState] = useState(userInfo?.shipping?.state || "");
  const [city, setCity] = useState(userInfo?.shipping?.city || "");

  const [street, setStreet] = useState(userInfo?.shipping?.address_line || "");
  const [code, setCode] = useState(userInfo?.shipping?.zip_code || "");

  const [countryCode, setCountryCode] = useState(
    userInfo?.shipping?.country_code || 86,
  );
  const [phoneNumber, setPhoneNumber] = useState(
    userInfo?.shipping?.phone || "",
  );

  const [saved, setSaved] = useState(false);

  const [rcNameValid, setRcNameValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);
  const [streetValid, setStreetValid] = useState(true);

  const disabled = useMemo(() => {
    if (saved) return true;
    if (!rcNameValid) return true;
    if (!streetValid) return true;
    if (!phoneValid) return true;
    if (!recipientName || !phoneNumber || !street || !code) return true;
    return false;
  }, [
    saved,
    recipientName,
    streetValid,
    phoneValid,
    street,
    rcNameValid,
    phoneNumber,
    code,
  ]);

  useEffect(() => {
    if (userInfo?.shipping) {
      setRecipientName(userInfo?.shipping?.recipient_name || "");
      setCountry(userInfo?.shipping?.country || "中国");
      setState(userInfo?.shipping?.state || "");
      setCity(userInfo?.shipping?.city || "");
      setStreet(userInfo?.shipping?.address_line || "");
      setCode(userInfo?.shipping?.zip_code || "");

      if (userInfo?.shipping?.phone) {
        let sWith = false;
        const ph = userInfo?.shipping?.phone;
        for (const pf of countryCodeList) {
          if (ph.startsWith(pf)) {
            setCountryCode(pf);
            setPhoneNumber(ph.slice(pf.length));
            sWith = true;
          }
        }

        if (!sWith) {
          const cC = userInfo?.shipping?.country_code || "86";
          setCountryCode(cC);
          setPhoneNumber(userInfo?.shipping?.phone);
        }
      } else {
        setCountryCode("86");
        setPhoneNumber("");
      }
    }
  }, [userInfo]);

  async function handleSave() {
    if (!uuid || disabled) return;

    await saveShip();
    getUserInfo();
  }

  async function saveShip() {
    if (!uuid) return;

    const res: any = await fetcher(`${ApiHost}/user/shipping`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: uuid,
        recipient_name: recipientName,
        country_code: countryCode,
        phone: phoneNumber,
        country: country,
        state: state,
        city: city,
        address_line: street,
        zip_code: code,
      }),
    });

    if (res.status) {
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 3000);
    }
    if (res.status === false && res.msg) {
      setGlobalMessage({
        type: "error",
        message: res.msg,
      });
    }

    return res;
  }

  return (
    <div className="no-scroll-bar pd-[100px] sm:pd-0 content-w-800 sm:trans-scroll-bar relative overflow-y-auto focus-visible:outline-none sm:h-fit sm:max-h-[calc(100%-40px)]">
      <div className="mt-6 rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur sm:rounded-[18px] sm:p-[24px]">
        <div className="mb-7 font-haasDisp text-xl font-semibold leading-[30px] text-white">
          {T("ShippingAddress")}
        </div>
        <NameAndPhone
          {...{
            recipientName,
            setRecipientName,
            countryCode,
            setCountryCode,
            phoneNumber,
            setPhoneNumber,
            rcNameValid,
            setRcNameValid,
            phoneValid,
            setPhoneValid,
            code,
            setCode,
          }}
        />
        <AddressInput
          {...{ country, setCountry, state, setState, city, setCity }}
        />
        <StreetAndCode
          {...{ street, setStreet, code, setCode, streetValid, setStreetValid }}
        >
          <SaveBtn
            className="hidden w-12 sm:!mt-[20px] sm:flex"
            disabled={disabled}
            onClick={handleSave}
          />
        </StreetAndCode>
        <SaveBtn
          className="mt-[20px] flex w-full bg-[#ffffff10] sm:hidden"
          disabled={disabled}
          onClick={handleSave}
        />
      </div>
      {(logisticsOrders || []).length > 0 && (
        <div className="mt-10 sm:px-6">
          <div className="font-haasDisp text-xl font-semibold leading-[30px] text-white">
            {T("RecentLogisticsOrder")}
          </div>
          <div className="mt-5">
            {!logisticsOrders?.length && (
              <div className="flex h-[50px] items-center justify-start text-xl">
                {T("NoData")}
              </div>
            )}
            {(logisticsOrders || [])?.map((item: any, index: number) => (
              <div
                key={index}
                className="flex flex-col py-[12px] text-[#d6d6d6] jm:h-12 jm:flex-row jm:items-center jm:justify-between jm:py-0"
                style={{
                  boxShadow: "inset 0px -1px 0px 0px rgba(255, 255, 255, 0.2)",
                }}
              >
                <div className="flex w-full items-center justify-between text-base leading-6 jm:w-[40%]">
                  <div>{item.order_id}</div>
                  <div>{item.delivery}</div>
                </div>
                <div className="mt-[5px] text-[12px] leading-[18px] opacity-60 jm:mt-0 jm:text-base jm:leading-6 jm:opacity-100">
                  {formatDate(item.create_at)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
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
import MartMenu from "../../mart-menu";

export default function ShippingAddressPage() {
  const uuid = useAtomValue(UuidAtom);
  const T = useTranslations("Common");
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

  function handleSave() {
    if (!uuid || disabled) return;

    saveShip();
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

    return res;
  }

  return (
    <div className="relative h-full">
      <div className="z-50 fixed inset-x-4 bottom-8 sm:absolute sm:left-[auto] sm:right-[-140px] sm:top-[5px] mt-6"><MartMenu /></div>
      <div className="no-scroll-bar pd-[100px] sm:pd-0 content-w-800 md:trans-scroll-bar md:h-fit md:max-h-[calc(100%-70px)] relative overflow-y-auto lg:-ml-[200px]">
        <div className="mt-6 rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur md:rounded-[18px] md:p-[20px]">
          <div className="mb-7 text-xl leading-[30px] text-white">
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
            }}
          />
          <AddressInput
            {...{ country, setCountry, state, setState, city, setCity }}
          />
          <StreetAndCode
            {...{ street, setStreet, code, setCode, streetValid, setStreetValid }}
          >
            <SaveBtn
              className="hidden w-12 md:flex"
              disabled={disabled}
              onClick={handleSave}
            />
          </StreetAndCode>
        </div>
        <SaveBtn
          className="my-4 flex w-full bg-[rgba(255,255,255,0.1)] backdrop-blur md:hidden"
          disabled={disabled}
          onClick={handleSave}
        />

        <div className="mt-10 px-6">
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
                className="flex h-12 items-center justify-between text-base leading-6 text-[#d6d6d6]"
                style={{
                  boxShadow: "inset 0px -1px 0px 0px rgba(255, 255, 255, 0.2)",
                }}
              >
                <div>{item.order_id}</div>
                <div>{item.delivery}</div>
                <div>{formatDate(item.create_at)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

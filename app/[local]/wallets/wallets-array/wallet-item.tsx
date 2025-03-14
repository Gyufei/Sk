"use client";
import Image from "next/image";
import { ConnectBtn } from "./connect-btn";


export function WalletItem({
  addressIndex,
  address,
  connectAddress,
  handleRemove = () => {},
  handleAdd = () => {},
  handleDisconnect = () => {},
  handleConnect = () => {},
}: {
  addressIndex: number;
  address: string;
  connectAddress?: string;
  handleRemove?: (clickAddress: string, index: number) => void;
  handleDisconnect?: (clickAddress: string) => void;
  handleConnect?: (clickAddress?: string) => void;
  handleAdd?: () => void;
}) {
  
  return (
    <div className="mb-6 flex flex-col items-start sm:flex-row sm:items-center sm:justify-between">
       <div className="w-full sm:w-[456px] relative mr-4 flex h-12 items-center justify-between border-b border-[rgba(255,255,255,0.2)] pr-8 sm:ml-0">
       <div className="mr-0 w-full max-w-full flex-1 text-base truncate leading-6 text-[#d6d6d6] sm:mr-0">
          {address}
        </div>
        {address && (
          <Image
            src="/icons/sign.svg"
            width={20}
            height={20}
            alt="sign"
            className="absolute right-0 top-[10px] cursor-pointer sm:top-[14px]"
          />
        )}
      </div>
      <div className="w-full sm:w-[270px] sm:min-w-[270px] flex flex-row-reverse justify-between">
        {
          (addressIndex > 0) ? (
            <div className="mt-4  ml-[24px] flex h-12 w-12 min-w-12 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.6)] sm:mt-0">
              <Image
                onClick={() => handleRemove(address, addressIndex)}
                className="cursor-pointer opacity-60"
                src="/icons/close-2.svg"
                width={48}
                height={49}
                alt="delete"
              />
            </div>
          ) : (
            <div className="sm:w-12 sm:ml-[24px]"></div>
          )
        }
        <ConnectBtn
          isAdd={addressIndex === -1}
          isConnect={!!connectAddress && connectAddress === address}
          handleConnect={() => {
            if (address) {
              handleConnect(address)
            } else {
              handleAdd()
            }
          }}
          handleDisconnect={() => handleDisconnect(address)}
        />
      </div>
    </div>
  );
}

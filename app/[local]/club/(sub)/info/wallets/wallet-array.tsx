import { useTranslations } from "next-intl";
import { EthWallets } from "./eth-wallets";
import { SolWallets } from "./sol-wallets";

export interface IWallet {
  name: string;
  address: string;
  isSign: boolean;
}

export function WalletArray() {
  const T = useTranslations("Common");

  return (
    <div className="relative mt-6 md:w-[800px] rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur md:rounded-[18px] md:p-[20px]">
      <div className="flex items-center justify-between space-x-[10px] md:justify-start">
        <div className="text-xl leading-[30px]">{T("Wallets")}</div>
      </div>
      <div className="mt-5">
        <EthWallets />
        <SolWallets />
      </div>
    </div>
  );
}

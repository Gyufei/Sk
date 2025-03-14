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
    <div className="relative mt-6 rounded-[20px] bg-[rgba(255,255,255,0.1)] p-5 backdrop-blur sm:rounded-[18px] sm:p-[20px]">
      <div className="flex items-center justify-between space-x-[10px] sm:justify-start">
        <div className="text-xl font-haasDisp leading-[30px] font-semibold">{T("Connections")}</div>
      </div>
      <div className="mt-5">
        <EthWallets />
        <SolWallets />
      </div>
    </div>
  );
}

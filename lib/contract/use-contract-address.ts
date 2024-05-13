import Mainnet from './mainnet.json'
import Testnet from './testnet.json'


export function useContractAddress(chainName: 'linea' | 'ethereum' | 'solana') {
  if (process.env.NODE_ENV === "production") {
    return (Mainnet)[chainName]["work-bench"]
  } else {
    return Testnet[chainName]["work-bench"]
  }
}

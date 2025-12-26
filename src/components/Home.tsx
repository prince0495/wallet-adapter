import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import Navbar from "./Navbar"
import { useWalletStore } from "../lib/store"
import Airdrop from "./Airdrop"
import Balance from "./Balance"
import Sign from "./Sign"
import Transact from "./Transact"
import Token from "./Token"
import { Toaster } from 'sonner'

export const GlowText = ({text} : {text: string}) => {
  return (
    <span className="gg-wrap">
      <span className="gg-glow">{text}</span>
      <span className="gg-text">{text}</span>
    </span>
  )
}

export const RenderScreen = () => {
    const { screen } = useWalletStore();
    if(screen === 'airdrop') return <Airdrop/>
    else if(screen === 'balance') return <Balance/>
    else if(screen === 'sign') return <Sign/>
    else if(screen === 'transact') return <Transact/>
    else if(screen === 'token') return <Token/>
    else null; 
}

const Home = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-start gap-8 font-mono'>
        <div className='mt-20 flex flex-col gap-4 items-center'>
            <div className="flex gap-4">
                <img width={100} src="https://api.phantom.app/image-proxy/?image=https%3A%2F%2Fcdn.jsdelivr.net%2Fgh%2Fsolana-labs%2Ftoken-list%40main%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png" alt="coin" className="rounded-full border-gray-900 border-2" />
                <GlowText text='Solana Wallet Adapter'/>
            </div>
            <WalletMultiButton/>
        </div>
        <div className="h-full w-full flex flex-col items-center justify-start gap-6">
            <Navbar/>
            <RenderScreen/>
        </div>
        <Toaster/>
    </div>
  )
}

export default Home
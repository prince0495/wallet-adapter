import clsx from 'clsx'
import { useWalletStore } from '../lib/store'

const Navbar = () => {
  const { screen, setScreen } = useWalletStore();
  return (
    <div className='mx-auto flex gap-3 grad p-4 rounded-lg font-mono font-bold w-3/6 items-center justify-evenly'>
        <div className={clsx('p-2 rounded-lg cursor-pointer hover:scale-[1.05] transition-all duration-200 ease-in-out', screen === 'airdrop' && 'underline')} onClick={() => setScreen('airdrop')} >Request Airdrop</div>
        <div className={clsx('p-2 rounded-lg cursor-pointer hover:scale-[1.05] transition-all duration-200 ease-in-out', screen === 'balance' && 'underline')} onClick={() => setScreen('balance')} >Balance</div>
        <div className={clsx('p-2 rounded-lg cursor-pointer hover:scale-[1.05] transition-all duration-200 ease-in-out', screen === 'sign' && 'underline')} onClick={() => setScreen('sign')} >Sign Transaction</div>
        <div className={clsx('p-2 rounded-lg cursor-pointer hover:scale-[1.05] transition-all duration-200 ease-in-out', screen === 'transact' && 'underline')} onClick={() => setScreen('transact')} >Transfer SOL</div>
        <div className={clsx('p-2 rounded-lg cursor-pointer hover:scale-[1.05] transition-all duration-200 ease-in-out', screen === 'token' && 'underline')} onClick={() => setScreen('token')} >Create Token</div>
    </div>
  )
}

export default Navbar
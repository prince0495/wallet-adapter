import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import clsx from "clsx";
import { useState } from "react";
import { toast } from "sonner";

const Airdrop = () => {
  const [ amount, setAmount ] = useState<string>('');
  const [ disabled, setDisabled ] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();

  async function sendAirDrop() {
    if(!wallet.publicKey) {
      toast('Please connect your wallet to perform action.')
      return;
    }
    else if(amount.length === 0 || amount === '') {
      toast('Enter some amount')
      return;
    }
    setDisabled(true);
    try {
      const solAmount = Number(amount) * LAMPORTS_PER_SOL;
      const txn = await connection.requestAirdrop(wallet.publicKey, solAmount);
      toast.success(`${amount}SOL has been airdropped to your wallet\nConfirm with transaction id: ${txn}`)
    } catch (error) {
      toast.error('Too many requests... please try again later')
    }
    setDisabled(false);
    setAmount('');
  }

  return (
    <div className='w-3/6 rounded-lg p-8 airdrop-bg flex flex-col items-center gap-4 purple-shadow'>
      <div className='text-center font-semibold text-2xl'>Request Airdrop SOL</div>
      <div className="flex items-center gap-6">
        <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" className="text-white p-3 text-lg input-black rounded-lg airdrop-shadow" placeholder="Enter Amount in SOL" />
        <button disabled={disabled} onClick={sendAirDrop} className={clsx("p-3 text-lg rounded-lg airdrop-grad", disabled && 'cursor-not-allowed')}>Airdrop</button>
      </div>
    </div>
  )
}

export default Airdrop
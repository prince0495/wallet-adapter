import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { useState } from 'react';
import { toast } from 'sonner';

const Transact = () => {
  const [ toPublicKey, setToPublicKey ] = useState("");
  const [ amount, setAmount ] = useState("");

  const wallet = useWallet();
  const { connection } = useConnection();

  async function onSend() {
    if(!wallet.publicKey) {
      toast('Wallet is not connected, try connecting wallet again');
      return;
    }
    else if(amount.length === 0) {
      toast('Atleast enter some amount to send');
      return;
    }
    const amountToSend = Number(amount) * LAMPORTS_PER_SOL;
    const transaction = new Transaction();
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(toPublicKey),
        lamports:amountToSend,
      })
    );
    const txnId = await wallet.sendTransaction(transaction, connection);
    toast.success(`Successfully transfered ${amount}SOL to ${toPublicKey}\nTransaction id: ${txnId}`);
    
    setAmount("");
  }
  
  return (
    <div className='w-3/6 rounded-lg p-8 transact-bg flex flex-col items-center gap-4 purple-shadow'>
      <div className='text-center font-semibold text-2xl'>Securely Transfer your SOL</div>
      <div className='flex flex-col gap-3'>
        <input value={toPublicKey} onChange={(e) => setToPublicKey(e.target.value)} type="text" className="text-white p-3 text-lg input-black rounded-lg airdrop-shadow" placeholder="Receiver's address" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" className="text-white p-3 text-lg input-black rounded-lg airdrop-shadow" placeholder="Enter Amount in SOL" />
        <button onClick={onSend} className='p-3 text-lg rounded-lg airdrop-grad'>Send</button>
      </div>
    </div>
  )
}

export default Transact
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { toast } from "sonner";
import bs58 from 'bs58';
import { ed25519 } from '@noble/curves/ed25519.js';

const Sign = () => {
  const [ message, setMessage ] = useState("");
  const [ signature, setSignature ] = useState("");

  const wallet = useWallet();

  async function onSign() {
    if(!wallet.publicKey) {
      toast('Wallet is not connected, try connecting wallet again');
      return;
    }
    else if(!wallet.signMessage) {
      toast("Wallet doesn't support message signing, try another wallet or give permissions");
      return;
    }
    else if(message.length === 0) {
      toast("Atleast write something to sign message");
      return;
    }
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await wallet.signMessage(encodedMessage);
    setSignature(bs58.encode(signedMessage));
  }

  async function onVerify() {
    if(!wallet.publicKey) {
      toast('Wallet is not connected, try connecting wallet again');
      return;
    }
    else if(message.length === 0) {
      toast('No message found to verify');
      return;
    }
    else if(signature.length === 0) {
      toast('No signature found to verify');
    }
    
    if(ed25519.verify(bs58.decode(signature), new TextEncoder().encode(message), wallet.publicKey.toBytes())) {
      toast.success('You indeed signed this message');
    }
    else {
      toast.warning('Message is not signed by you.')
    }
  }

  return (
    <div className='w-3/6 rounded-lg p-8 flex flex-col items-center gap-4 sign-bg purple-shadow'>
      <div className='text-2xl font-semibold'>
        Sign your message here
      </div>
      <div className='flex flex-col gap-4 w-full'>
        <div className='w-full flex gap-2'>
          <input value={message} onChange={(e) => setMessage(e.target.value)} type="text" placeholder='Enter Your Message' className='w-full rounded-lg input-black p-3 text-lg airdrop-shadow' />
          <button onClick={onSign} className='p-3 input-black rounded-lg px-6 text-lg airdrop-grad'>Sign</button>
        </div>
        <div className='w-full flex gap-2'>
          <input value={signature} onChange={(e) => setSignature(e.target.value)} type="text" placeholder='Signature' className='w-full rounded-lg input-black p-3 text-lg airdrop-shadow' />
          <button onClick={onVerify} className='p-3 input-black rounded-lg text-lg airdrop-grad'>Verify</button>
        </div>
      </div>
    </div>
  )
}

export default Sign
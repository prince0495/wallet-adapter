import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

const Token = () => {
  const [showOptional, setShowOptional] = useState(false);

  const wallet = useWallet();
  const { connection } = useConnection();

  const tokenProgram = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");

  useEffect(() => {
    
    async function getTokens() {
      if(!wallet.publicKey) {
        return;
      }
      const response = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, { programId: tokenProgram});      
      

    }

    try {
      getTokens();
    } catch (error) {
      
    }
  }, [wallet])
  

  const formSchema = z.object({
    tokenName: z.string().min(2, "Token name must be atleast 2 characters long"),
    tokenSymbol: z.string().min(2, "Symbol should be atleast 2 characters long"),
    tokenImageUrl: z.string().url(),
    
    tokenSupply: z.number().min(1, 'Supply should be at least 1'),

    tokenDecimals: z.number().min(0, 'Must be positive').max(9, "Decimal can be maximum 9").optional(),

    tokenMintAuthority: z.string().optional(),

    tokenFreezeAuthority: z.string().optional()


  });

  type FormValues = z.infer<typeof formSchema>;

  const { 
    register,
    handleSubmit,
    formState: { errors },
   } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenName: "",
      tokenSymbol: "",
      tokenImageUrl: "",
      // tokenSupply: 0,
      tokenDecimals: 9,
      tokenMintAuthority: "",
      tokenFreezeAuthority: ""
    }
   });

   const onSubmit = (data: FormValues) => {
    console.log(data);
   }

  return (
    <div className='w-3/6 rounded-lg p-8 token-bg flex flex-col items-center gap-4 '>
      <div className='text-center font-semibold text-2xl'>Launch your new tokens in just few clicks</div>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full flex flex-col gap-2'>
        <div className='grid lg:grid-cols-6 md:grid-cols-2 grid-cols-1 gap-4 w-full'>

          <div className='flex flex-col gap-2 items-start w-full lg:col-span-2'>
            <span className='text-xl text-white font-semibold'>Token Name</span>
            <input type="text" placeholder='eg.FOXY' className='input-black text-white p-3 text-lg rounded-lg airdrop-shadow w-full' {...register("tokenName")} />
            {errors.tokenName && <span className='text-sm'>{errors.tokenName.message}</span>}
          </div>

          <div className='flex flex-col gap-2 items-start w-full '>
            <span className='text-xl text-white font-semibold'>Symbol</span>
            <input type="text" placeholder='eg.FXY' className='input-black text-white p-3 text-lg rounded-lg airdrop-shadow w-full' {...register("tokenSymbol")} />
            {errors.tokenSymbol && <span className='text-sm'>{errors.tokenSymbol.message}</span>}
          </div>

          <div className='flex flex-col gap-2 items-start w-full lg:col-span-2'>
            <span className='text-xl text-white font-semibold'>Image URL</span>
            <input type="text" placeholder='eg. https://picsum.photos/id/237/200/300' className='input-black text-white p-3 text-lg rounded-lg airdrop-shadow w-full' {...register("tokenImageUrl")} />
            {errors.tokenImageUrl && <span className='text-sm'>{errors.tokenImageUrl.message}</span>}
          </div>

          <div className='flex flex-col gap-2 items-start w-full'>
            <span className='text-xl text-white font-semibold'>Supply</span>
            <input type="number" placeholder='eg. 100' className='input-black text-white p-3 text-lg rounded-lg airdrop-shadow w-full' {...register("tokenSupply", { valueAsNumber: true })} />
            {errors.tokenSupply && <span className='text-sm'>{errors.tokenSupply.message}</span>}
          </div>

        </div>

        <button 
          onClick={() => setShowOptional(!showOptional)}
          className='flex items-center gap-2 text-2xl font-semibold text-left w-fit cursor-pointer'
        >
          Optional Fields
          <span
            className={clsx('transition-transform duration-300', showOptional ? 'rotate-180' : 'rotate-0')}
          >
            <img src="/dropdown.svg" alt="|" width={20} height={20} />
          </span>
        </button>

        <div className={clsx('overflow-hidden transition-all duration-500 ease-in-out', showOptional ? 'max-h-[500px] opacity-100 translate-y-0 mb-4' : 'max-h-0 opacity-0 -translate-y-2')}>
          <div className='grid lg:grid-cols-6 md:grid-cols-2 grid-cols-1 gap-4 w-full'>

            <div className='flex flex-col gap-2 items-start w-full lg:col-span-2'>
              <span className='text-xl text-white font-semibold'>Mint Authority</span>
              <input type="text" placeholder="public key of wallet" className='input-black text-white p-3 text-lg rounded-lg airdrop-shadow w-full' {...register("tokenMintAuthority")} />
              {errors.tokenMintAuthority && <span className='text-sm'>{errors.tokenMintAuthority.message}</span>}
            </div>

            <div className='flex flex-col gap-2 items-start w-full lg:col-span-2'>
              <span className='text-xl text-white font-semibold'>Freeze Authority</span>
              <input type="text" placeholder='public key of wallet' className='input-black text-white p-3 text-lg rounded-lg airdrop-shadow w-full' {...register("tokenFreezeAuthority")} />
              {errors.tokenFreezeAuthority && <span className='text-sm'>{errors.tokenFreezeAuthority.message}</span>}
            </div>

            <div className='flex flex-col gap-2 items-start w-full'>
              <span className='text-xl text-white font-semibold'>Decimals</span>
              <input type="number" placeholder='eg. 9' className='input-black text-white p-3 text-lg rounded-lg airdrop-shadow w-full' {...register("tokenDecimals", { valueAsNumber: true })} />
              {errors.tokenDecimals && <span className='text-sm'>{errors.tokenDecimals.message}</span>}
            </div>

          </div>
        </div>

        <button type='submit' className='p-3 text-lg rounded-lg airdrop-grad mx-auto'>
          Create
        </button>

      </form>

      {/* {tokenAccountsByOwner && (
        tokenAccountsByOwner.map((tokenAccount) => (
          <div>
            {JSON.stringify(tokenAccount)}
          </div>
        ))
      )} */}
    </div>
  )
}

export default Token
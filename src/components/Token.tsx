import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, type AccountInfo, type ParsedAccountData } from '@solana/web3.js';
import { getMint, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { unpack, type TokenMetadata } from "@solana/spl-token-metadata";

function extractToken2022Extension(tlv: Uint8Array, targetType: number): Uint8Array | null {
  let offset = 0;

  while (offset < tlv.length) {
    const type = tlv[offset] | (tlv[offset + 1] << 8);        // <-- u16 LE
    const length = tlv[offset + 2] | (tlv[offset + 3] << 8);  // <-- u16 LE

    const start = offset + 4;
    const end = start + length;

    if (type === targetType) {
      return tlv.slice(start, end);
    }

    offset = end;
  }
  return null;
}

type TokenData = {
  pubkey: PublicKey;
  account: AccountInfo<ParsedAccountData>;
  tokenMetaData: TokenMetadata | null;
  mintAuthority: PublicKey | null;
  freezeAuthority: PublicKey | null;
  supply: bigint | null;
}


const Token = () => {
  const [showOptional, setShowOptional] = useState(false);
  const [ tokensData, setTokensData ] = useState<TokenData[]>([])

  const wallet = useWallet();
  const { connection } = useConnection();  

  useEffect(() => {
    
    async function getTokens() {
      if(!wallet.publicKey) {
        return;
      }
      const response = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, { programId: TOKEN_2022_PROGRAM_ID });
      
      const tokensDataMap: TokenData[] = await Promise.all(
        response.value.map(async (tokenAccount) => {
          let tokenMetaData: TokenMetadata | null = null;
          let mintAuthority: PublicKey | null = null;
          let freezeAuthority: PublicKey | null = null;
          let supply: bigint | null = null;

          try {
            const mintAddr = tokenAccount.account.data.parsed?.info?.mint;

            if (mintAddr) {
              const mintPubKey = new PublicKey(mintAddr);
              const mintInfo = await getMint(connection, mintPubKey, undefined, TOKEN_2022_PROGRAM_ID);
              mintAuthority = mintInfo.mintAuthority;
              freezeAuthority = mintInfo.freezeAuthority;
              supply = mintInfo.supply;

              console.log('mintInfo: ',mintInfo);
              
              const tokenMetadataBuf = extractToken2022Extension(mintInfo.tlvData, 19);

              if (tokenMetadataBuf) {
                tokenMetaData = unpack(tokenMetadataBuf);
              }
            }
          } catch (e) {
            console.log("metadata error:", e);
          }
          console.log(tokenAccount.pubkey.toBase58(), ' name: ', tokenMetaData ? tokenMetaData.name : "null");
          
          return {
            pubkey: tokenAccount.pubkey,
            account: tokenAccount.account,
            tokenMetaData,
            mintAuthority,
            freezeAuthority,
            supply,
          };
        })
      );
      console.log(tokensDataMap);
      
      setTokensData(tokensDataMap);
      /**
       * response.value.map(async(tokenAccount) => {
        
        let metadata = null;

        try {
          if(tokenAccount.account.data.parsed?.info?.mint) {
            const mintPubKey = new PublicKey(tokenAccount.account.data.parsed?.info?.mint);
            const mintInfo = await getMint(
              connection,
              mintPubKey,
              undefined,
              TOKEN_2022_PROGRAM_ID
            );
            const tokenMetadataBuf = extractToken2022Extension(mintInfo.tlvData, 19);
            if(tokenMetadataBuf) {
              metadata = unpack(tokenMetadataBuf);
            }
          }
        } catch (error) {
          console.log(error);
          
        }

        return { metadata, pubkey: tokenAccount.pubkey, account: tokenAccount.account };

      })
       */
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
    <div className='w-3/6 rounded-lg p-8 flex flex-col items-center gap-4 black-grad'>
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

      {tokensData.length > 0 && (
        tokensData.map((tokenData, index) => (
          <div key={index} className='w-full flex flex-col gap-6 border-1 p-2 rounded-lg border-white'>

            <div className='flex items-center justify-between gap-3'>
              <div className='flex flex-col gap-2 w-2/6'>
                <div className='flex gap-2 overflow-x-hidden items-center justify-start border-2 bg-linear-to-tr from-[#000000] to-[#6f5a5a] p-2 rounded-lg border-[#454545]'>
                  <div className='flex items-center justify-center'>
                    <img src={(tokenData.tokenMetaData && tokenData.tokenMetaData?.uri) ? tokenData.tokenMetaData.uri : '/images/black.jpg'} alt="LOGO NOT FOUND" className='object-cover rounded-full w-16 h-16'/>
                  </div>
                  <div className='flex flex-col gap-1 items-center justify-center'>
                    <span className='font-bold text-lg'>{tokenData.tokenMetaData?.name}</span>
                    <span className='text-md'>{tokenData.tokenMetaData?.symbol}</span>
                  </div>
                </div>
                <div className='flex overflow-x-hidden w-full flex-col gap-4 border-2 bg-linear-to-tr from-[#000000] to-[#6f5a5a] p-2 rounded-lg border-[#454545] w-40'>
                  <span className='text-xl font-semibold'>Token Supply</span>
                  <span>{tokenData.supply ? (Number(tokenData.supply) / Number(10n ** BigInt(tokenData.account.data.parsed?.info?.tokenAmount?.decimals ?? 9))) : 'Not found yet'}</span>
                </div>
              </div>

              <div className='flex flex-col gap-2 w-4/6'>
                <div className='flex overflow-x-hidden flex-col gap-2 w-full bg-linear-to-tr from-[#000000] to-[#6f5a5a] p-2 rounded-lg border-[#454545]'>
                  <span className='font-bold text-center w-full'>Mint Account Address</span>
                  <span className='bg-white w-full text-black text-center rounded-md cursor-pointer overflow-x-hidden'
                    onClick={() => {
                      navigator.clipboard.writeText(`${tokenData.account.data.parsed?.info?.mint}`);
                    }}
                  >{tokenData.account.data.parsed?.info?.mint}</span>
                </div>
                <div className='flex overflow-x-hidden flex-col gap-2 w-full bg-linear-to-tr from-[#000000] to-[#6f5a5a] p-2 rounded-lg border-[#454545]'>
                  <span className='font-bold text-center w-full'>Associated Token Account</span>
                  <span className='bg-white w-full text-black text-center rounded-md cursor-pointer overflow-x-hidden'
                    onClick={() => {
                      navigator.clipboard.writeText(tokenData.pubkey.toBase58());
                    }}
                  >{tokenData.pubkey.toBase58()}</span>
                </div>
              </div>
            </div>

            <div className='flex justify-center items-center p-4 gap-4'>
              <input type="number" placeholder='Amount' className='rounded-lg input-black p-3 text-lg airdrop-shadow'/>
              <button className='p-3 input-black rounded-lg text-lg airdrop-grad' >Mint Tokens</button>
            </div>

            <div className='flex justify-center items-center gap-2 w-full'>
              <div className='w-full bg-linear-to-tr from-[#000000] to-[#6f5a5a] p-3 rounded-lg border-[#454545] cursor-pointer'>Revoke Mint Authority</div>
              <div className='w-full bg-linear-to-tr from-[#000000] to-[#6f5a5a] p-3 rounded-lg border-[#454545] cursor-pointer '>Revoke Freeze Authority</div>
            </div>

            <div className='flex flex-col items-center justify-center gap-3 w-full'>
              <div className='p-1 flex flex-col gap-1 rounded-lg bg-linear-to-tr from-[#000000] to-[#6f5a5a] w-1/2'>
                <span className='text-center text-sm w-full font-extrabold'>Receiver's Address</span>
                <input type="text" placeholder="Wallet Address" className='w-full p-1 text-black bg-white rounded-sm' />
              </div>
              <div className='flex items-center justify-center gap-2 w-1/2'>
                <input type="number" placeholder='Amount' className='text-white p-3 text-lg input-black rounded-lg airdrop-shadow'/>
                <button className='p-3 text-lg rounded-lg airdrop-grad'>Send</button>
              </div>
            </div>

          </div>
        ))
      )}

    </div>
  )
}

export default Token
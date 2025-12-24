import React from 'react'

const Sign = () => {
  return (
    <div className='w-3/6 rounded-lg p-8 flex flex-col items-center gap-4 sign-bg'>
      <div className='text-2xl font-semibold'>
        Sign your message here
      </div>
      <div className='flex flex-col gap-4 w-full'>
        <div className='w-full flex gap-2'>
          <input type="text" placeholder='Enter Your Message' className='w-full rounded-lg input-black p-3 text-lg airdrop-shadow' />
          <button className='p-3 input-black rounded-lg px-6 text-lg airdrop-grad'>Sign</button>
        </div>
        <div className='w-full flex gap-2'>
          <input type="text" placeholder='Signature' className='w-full rounded-lg input-black p-3 text-lg airdrop-shadow' />
          <button className='p-3 input-black rounded-lg text-lg airdrop-grad'>Verify</button>
        </div>
      </div>
    </div>
  )
}

export default Sign
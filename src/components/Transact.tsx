import React from 'react'

const Transact = () => {
  return (
    <div className='w-3/6 rounded-lg p-8 transact-bg flex flex-col items-center gap-4'>
      <div className='text-center font-semibold text-2xl'>Securely Transfer your SOL</div>
      <div className='flex flex-col gap-3'>
        <input type="text" className="text-white p-3 text-lg input-black rounded-lg airdrop-shadow" placeholder="Receiver's address" />
        <input type="number" className="text-white p-3 text-lg input-black rounded-lg airdrop-shadow" placeholder="Enter Amount in SOL" />
        <button className='p-3 text-lg rounded-lg airdrop-grad'>Send</button>
      </div>
    </div>
  )
}

export default Transact
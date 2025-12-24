
const Airdrop = () => {
  return (
    <div className='w-3/6 rounded-lg p-8 airdrop-bg flex flex-col items-center gap-4'>
      <div className='text-center font-semibold text-2xl'>Request Airdrop SOL</div>
      <div className="flex items-center gap-6">
        <input type="number" className="text-white p-3 text-lg input-black rounded-lg airdrop-shadow" placeholder="Enter Amount in SOL" />
        <button className="p-3 text-lg rounded-lg airdrop-grad">Airdrop</button>
      </div>
    </div>
  )
}

export default Airdrop
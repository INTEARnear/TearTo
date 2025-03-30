'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-[3.5rem] leading-tight font-bold bg-gradient-to-r from-[#B44BF7] to-[#F74B87] via-[#CF4B9F] inline-block text-transparent bg-clip-text animate-gradient">
            TearTo
          </h1>
          <p className="mt-6 text-[#8A8A9A] text-xl font-medium max-w-2xl mx-auto">
            Accept crypto payments from 12+ blockchains with zero setup. No smart contracts, no permissions, just your NEAR account.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-[#12121A] rounded-[32px] shadow-2xl p-8 border border-[#1F1F2E]">
            <h2 className="text-2xl font-bold text-white mb-4">For Creators</h2>
            <p className="text-[#8A8A9A] mb-6">
              Just create a NEAR wallet, set up your page (or go with default), share your tear.to/you.near link, and start accepting tips from any blockchain. Everything is automatically converted to USDC on NEAR and comes straight to your wallet.
            </p>
            <button
              onClick={() => router.push('/docs')}
              className="w-full flex justify-center py-4 px-4 border-0 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-[#B44BF7] to-[#F74B87] hover:from-[#A43BE6] hover:to-[#E64B87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B44BF7] focus:ring-offset-[#12121A] transition-all duration-200"
            >
              Get Started
            </button>
          </div>

          <div className="bg-[#12121A] rounded-[32px] shadow-2xl p-8 border border-[#1F1F2E]">
            <h2 className="text-2xl font-bold text-white mb-4">For Supporters</h2>
            <p className="text-[#8A8A9A] mb-6">
              Support your favorite creators from (almost) any blockchain. Tell them to use Tear.to to receive tips with 0% fee.
            </p>
            <button
              onClick={() => router.push('/docs')}
              className="w-full flex justify-center py-4 px-4 border-0 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-[#B44BF7] to-[#F74B87] hover:from-[#A43BE6] hover:to-[#E64B87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B44BF7] focus:ring-offset-[#12121A] transition-all duration-200"
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="bg-[#12121A] rounded-[32px] shadow-2xl p-8 border border-[#1F1F2E]">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Supported Blockchains</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Bitcoin', 'Ethereum', 'Solana', 'NEAR', 'BNB Chain', 'Polygon', 'Arbitrum', 'Base', 'Tron', 'Ripple', 'Doge', 'Zcash', 'Bera', 'Gnosis'].map((chain) => (
              <div 
                key={chain} 
                className="flex items-center justify-center p-4 bg-[#1A1A24] rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#B44BF7]/20 hover:border hover:border-transparent hover:bg-gradient-to-r hover:from-[#1A1A24] hover:to-[#1A1A24] hover:bg-clip-padding hover:border-gradient-to-r hover:border-from-[#B44BF7] hover:border-to-[#F74B87]"
              >
                <span className="text-[#E1E1E3] font-medium">{chain}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

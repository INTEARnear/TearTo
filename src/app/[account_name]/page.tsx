'use client';

import { useState, use, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Invoice from '@/components/Invoice';

interface TipFormData {
  name: string;
  message: string;
  amount: string;
}

interface ValidationErrors {
  name?: string;
  amount?: string;
}

export default function TipPage({ params }: { params: Promise<{ account_name: string }> }) {
  const { account_name } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<TipFormData>({
    name: '',
    message: '',
    amount: '',
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showInvoice, setShowInvoice] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [invoiceId, setInvoiceId] = useState<string>('');

  useEffect(() => {
    const checkAccount = async () => {
      try {
        const response = await fetch('https://rpc.mainnet.near.org', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 'dontcare',
            method: 'query',
            params: {
              request_type: 'view_account',
              finality: 'final',
              account_id: account_name,
            },
          }),
        });

        const data = await response.json();
        
        if (data.error) {
          router.push('/');
          return;
        }
      } catch (error) {
        router.push('/');
        return;
      }
      setIsLoading(false);
    };

    checkAccount();
  }, [account_name, router]);

  const errors = useMemo(() => {
    const errors: ValidationErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount < 1.00) {
      errors.amount = 'Amount must be at least 1.00 USDC';
    }

    return errors;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    // Generate a unique invoice ID
    const newInvoiceId = `tip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setInvoiceId(newInvoiceId);
    setShowInvoice(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handlePaymentSuccess = () => {
    setShowInvoice(false);
    setShowSuccess(true);
  };

  const handlePaymentCancel = () => {
    setShowInvoice(false);
  };

  const handleBack = () => {
    setShowSuccess(false);
    setFormData({
      name: '',
      message: '',
      amount: '',
    });
    setTouched({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 8s ease infinite;
        }
      `}</style>
      
      <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className={`mx-auto ${showInvoice ? 'max-w-7xl' : 'max-w-md'}`}>
          <div className="text-center mb-12">
            <h1 className="text-[2.5rem] leading-tight font-bold bg-gradient-to-r from-[#B44BF7] to-[#F74B87] via-[#CF4B9F] inline-block text-transparent bg-clip-text animate-gradient">
              Tip @{account_name}
            </h1>
            <p className="mt-3 text-[#8A8A9A] text-lg font-medium">Support your favorite creator</p>
          </div>

          {showSuccess ? (
            <div className="bg-[#12121A] rounded-[32px] shadow-2xl p-8 border border-[#1F1F2E] text-center">
              <div className="mb-6">
                <svg className="mx-auto h-16 w-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">Payment Successful!</h3>
              <p className="text-[#8A8A9A] mb-8">Thank you for your tip. Your support means a lot!</p>
              <button
                onClick={handleBack}
                className="w-full flex justify-center py-4 px-4 border-0 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-[#B44BF7] to-[#F74B87] hover:from-[#A43BE6] hover:to-[#E64B87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B44BF7] focus:ring-offset-[#12121A] transition-all duration-200"
              >
                Done
              </button>
            </div>
          ) : showInvoice ? (
            <div className="bg-[#12121A] rounded-[32px] shadow-2xl p-8 border border-[#1F1F2E]">
              <Invoice
                amountUsd={parseFloat(formData.amount)}
                invoiceId={invoiceId}
                recipientAddress={account_name}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
                showRecipient={false}
              />
            </div>
          ) : (
            <div className="bg-[#12121A] rounded-[32px] shadow-2xl p-8 border border-[#1F1F2E]">
              <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <label htmlFor="name" className="block text-[15px] font-medium text-[#E1E1E3] mb-2.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`mt-1 block w-full rounded-2xl bg-[#1A1A24] text-white placeholder-[#4A4A57] shadow-sm text-[15px] py-3.5 px-4 transition-colors duration-200 ${
                      touched.name && errors.name 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-[#2A2A35] focus:border-[#B44BF7] focus:ring-[#B44BF7]'
                    }`}
                    placeholder="Enter your name"
                  />
                  {touched.name && errors.name && (
                    <p className="mt-1.5 text-[13px] text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-[15px] font-medium text-[#E1E1E3] mb-2.5">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-2xl bg-[#1A1A24] border-[#2A2A35] text-white placeholder-[#4A4A57] shadow-sm focus:border-[#B44BF7] focus:ring-[#B44BF7] text-[15px] py-3.5 px-4 resize-none transition-colors duration-200"
                    placeholder="Add a message..."
                  />
                </div>

                <div>
                  <label htmlFor="amount" className="block text-[15px] font-medium text-[#E1E1E3] mb-2.5">
                    Amount (USDC)
                  </label>
                  <div className="mt-1 relative rounded-2xl shadow-sm">
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      required
                      min="1"
                      step="0.01"
                      value={formData.amount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`block w-full rounded-2xl bg-[#1A1A24] text-white placeholder-[#4A4A57] shadow-sm text-[15px] py-3.5 pl-4 pr-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-colors duration-200 ${
                        touched.amount && errors.amount 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-[#2A2A35] focus:border-[#B44BF7] focus:ring-[#B44BF7]'
                      }`}
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-[#8A8A9A] text-[15px] font-medium">USDC</span>
                    </div>
                  </div>
                  {touched.amount && errors.amount && (
                    <p className="mt-1.5 text-[13px] text-red-500">{errors.amount}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isValid}
                  className={`w-full flex justify-center py-4 px-4 border-0 rounded-2xl text-base font-semibold transition-all duration-200 mt-8 ${
                    isValid 
                      ? 'text-white bg-gradient-to-r from-[#B44BF7] to-[#F74B87] hover:from-[#A43BE6] hover:to-[#E64B87] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B44BF7] focus:ring-offset-[#12121A]' 
                      : 'text-[#8A8A9A] bg-gradient-to-r from-[#2A2A35] to-[#2A2A35] cursor-not-allowed'
                  }`}
                >
                  Send Tip
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LayoutGrid, Terminal, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginPageProps {
  onLoginSuccess: (email: string, rememberMe: boolean) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'sanghars.mohanty@iserveu.in',
      password: '••••••••',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMsg(null);
    
    // Simulate minor authentication latency
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    if (!data.email) {
      setErrorMsg('Please specify a valid corporate email identifier.');
      setLoading(false);
      return;
    }

    setLoading(false);
    onLoginSuccess(data.email, data.rememberMe);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#090d16] p-4 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-[#111927] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden animate-fade-in">
        
        {/* Header Visual Section */}
        <div className="p-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center gap-2.5 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-2xl italic font-sans shadow-md shadow-blue-500/25">A</div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-950 dark:text-white leading-none">AI.PRO</span>
          </div>
          <h1 className="bold-header text-slate-905 dark:text-white mt-5">
            Portal Access
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-[280px] mx-auto">
            Authorized Enterprise Co-pilot & Generative Delivery Portal
          </p>
        </div>

        {/* Form Body */}
        <div className="px-8 pb-8 pt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-on-y">
            
            {/* Error notifications */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl flex items-start gap-2.5">
                <Terminal className="w-4 h-4 text-red-500 mt-0.5" />
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">{errorMsg}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5 mb-4">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Corporate Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-[#1f293d]/50 border ${
                  errors.email ? 'border-red-400' : 'border-gray-200 dark:border-gray-800'
                } rounded-xl text-sm text-gray-900 dark:text-white-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white transition-all`}
                {...register('email', { 
                  required: 'Email address is required for enterprise access.',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email syntax.'
                  }
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert("Please verify authorization passwords with your corporate directory administrator.")}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-500 font-medium cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter corporate password"
                  className="w-full pl-4 pr-11 py-2.5 bg-gray-50 dark:bg-[#1f293d]/50 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white transition-all"
                  {...register('password', { required: 'Passphrase is required.' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 text-blue-600 border-gray-200 dark:border-gray-800 rounded-md focus:ring-blue-500 dark:bg-[#1f293d]/50 focus:ring-offset-0 cursor-pointer"
                  {...register('rememberMe')}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Remember this system
                </span>
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium text-sm rounded-xl cursor-pointer shadow-lg shadow-blue-500/15 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authorizing...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Secure Workspace Disclaimer */}
          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-gray-400 dark:text-gray-500 font-medium border-t border-gray-100 dark:border-gray-800/60 pt-4">
            <Shield className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
            SECURE CLIENT PORTAL • END-TO-END AES-256
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
      
import RegisterServiceWorker from "./register-sw";

type FilerStatus = "filer" | "lateFiler" | "nonFiler";

// Rates for property value <= 50 million (500 hundred lacs)
const buyerRatesBelow50M = {
  filer: 1.5,
  lateFiler: 4.5,
  nonFiler: 10.5,
};

const sellerRatesBelow50M = {
  filer: 4.5,
  lateFiler: 7.5,
  nonFiler: 11.5,
};

// Rates for property value > 50 million
const buyerRatesAbove50M = {
  filer: 2,
  lateFiler: 5.5,
  nonFiler: 14.5,
};

const sellerRatesAbove50M = {
  filer: 5,
  lateFiler: 8.5,
  nonFiler: 11.5,
};

export default function TaxCalculator() {
  const [propertyValue, setPropertyValue] = useState<number>(0);
  const [buyerStatus, setBuyerStatus] = useState<FilerStatus>("filer");
  const [sellerStatus, setSellerStatus] = useState<FilerStatus>("filer");

  // Determine which rates to use based on property value
  const threshold = 50000000; // 50 million PKR (500 hundred lacs)
  const isAboveThreshold = propertyValue > threshold;
  
  const buyerRates = isAboveThreshold ? buyerRatesAbove50M : buyerRatesBelow50M;
  const sellerRates = isAboveThreshold ? sellerRatesAbove50M : sellerRatesBelow50M;

  // Buyer fixed rates (always the same)
  const tmaRate = 1;
  const stampDutyRate = 1;

  // Calculations
  const tmaAmount = (propertyValue * tmaRate) / 100;
  const stampDutyAmount = (propertyValue * stampDutyRate) / 100;
  const fixedCharges = tmaAmount + stampDutyAmount;
  
  const buyerFilerTax = (propertyValue * buyerRates[buyerStatus]) / 100;
  const buyerTax = fixedCharges + buyerFilerTax;

  const sellerTax = (propertyValue * sellerRates[sellerStatus]) / 100;

  const totalTax = buyerTax + sellerTax;

  const formatPKR = (num: number) =>
    num.toLocaleString("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    });

return (
    <div className="min-h-screen bg-slate-50 sm:p-6 flex flex-col items-center justify-center font-sans">
      <RegisterServiceWorker/>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full bg-white rounded-xl shadow-xl border border-slate-200 p-4 sm:p-8 md:p-10"
      >
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
             <span className="text-2xl">🏠</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 tracking-tight">
            Property Tax Calculator
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto">
            Calculate total FBR taxes for Buyer and Seller based on filer status and property value.
          </p>
        </div>

        {/* Property Value Threshold Indicator */}
        {propertyValue > 0 && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 text-sm sm:text-base flex items-start sm:items-center gap-3 shadow-sm ${
            isAboveThreshold 
              ? 'bg-amber-50 text-amber-900 border-amber-400' 
              : 'bg-blue-50 text-blue-900 border-blue-400'
          }`}>
             <span className="text-lg">{isAboveThreshold ? '⚠️' : '✓'}</span>
             <span className="font-medium">
              {isAboveThreshold 
                ? 'High Value Property (> 5 Crore PKR) - Higher tax rates apply.'
                : 'Standard Value Property (≤ 5 Crore PKR) - Standard tax rates apply.'}
             </span>
          </div>
        )}

        {/* Property Value Input */}
        <div className="mb-8">
          <label className="block text-slate-700 font-semibold mb-2 text-sm sm:text-base">
            Property Value (PKR)
          </label>
          <div className="relative">
            <input
              type="number"
              value={propertyValue || ""}
              onChange={(e) => setPropertyValue(Number(e.target.value))}
              placeholder="Enter property value e.g. 5000000"
              className="w-full text-slate-900 border border-slate-300 rounded-lg p-4 pl-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base sm:text-lg placeholder:text-slate-400"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-slate-400 font-medium">PKR</span>
            </div>
          </div>
        </div>

        {/* Fixed Charges Section - Styled like a Ledger/Receipt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 bg-slate-50 border border-slate-200 rounded-lg p-5 sm:p-6"
        >
          <h2 className="text-sm uppercase tracking-wide font-bold text-slate-500 mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
            📋 Fixed Government Charges
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex justify-between items-center bg-white p-3 rounded border border-slate-200">
              <span className="text-slate-600 text-sm">TMA (1%)</span>
              <span className="text-slate-900 font-medium font-mono">{formatPKR(tmaAmount)}</span>
            </div>
            <div className="flex justify-between items-center bg-white p-3 rounded border border-slate-200">
              <span className="text-slate-600 text-sm">Stamp Duty (1%)</span>
              <span className="text-slate-900 font-medium font-mono">{formatPKR(stampDutyAmount)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-slate-700 font-semibold text-sm sm:text-base">Subtotal (Fixed Charges)</span>
            <span className="text-slate-800 font-bold text-base sm:text-lg font-mono">{formatPKR(fixedCharges)}</span>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Buyer Card */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-blue-600 bg-blue-50 p-1.5 rounded-md">🧍‍♂️</span> Buyer (خریدار)
            </h2>

            <div className="mb-5">
              <label className="block text-slate-600 text-sm font-medium mb-1.5">
                Filer Status
              </label>
              <div className="relative">
                <select
                  value={buyerStatus}
                  onChange={(e) => setBuyerStatus(e.target.value as FilerStatus)}
                  className="w-full text-slate-900 border border-slate-300 rounded-lg p-3 pr-8 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                >
                  <option value="filer">✅ Active Filer ({buyerRates.filer}%)</option>
                  <option value="lateFiler">⚠️ Late Filer ({buyerRates.lateFiler}%)</option>
                  <option value="nonFiler">❌ Non-Filer ({buyerRates.nonFiler}%)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Withholding Tax ({buyerRates[buyerStatus]}%)</span>
                <span className="font-mono text-slate-800">{formatPKR(buyerFilerTax)}</span>
              </div>
              <div className="border-t border-dashed border-slate-200 my-3"></div>
              <div className="flex flex-col sm:flex-row items-center sm:justify-between">
                <span className="text-slate-500 text-sm font-medium uppercase">Total Buyer Payable</span>
                <span className="text-blue-700 font-bold text-xl font-mono">{formatPKR(buyerTax)}</span>
              </div>
            </div>
          </motion.div>

          {/* Seller Card */}
          <motion.div
            whileHover={{ y: -2 }}
            className="bg-white border border-teal-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-teal-500"></div>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-teal-600 bg-teal-50 p-1.5 rounded-md">🧍‍♀️</span> Seller (بیچنے والا)
            </h2>

            <div className="mb-5">
              <label className="block text-slate-600 text-sm font-medium mb-1.5">
                Filer Status
              </label>
              <div className="relative">
                <select
                  value={sellerStatus}
                  onChange={(e) => setSellerStatus(e.target.value as FilerStatus)}
                  className="w-full text-slate-900 border border-slate-300 rounded-lg p-3 pr-8 bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none appearance-none"
                >
                  <option value="filer">✅ Active Filer ({sellerRates.filer}%)</option>
                  <option value="lateFiler">⚠️ Late Filer ({sellerRates.lateFiler}%)</option>
                  <option value="nonFiler">❌ Non-Filer ({sellerRates.nonFiler}%)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                   <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Withholding Tax ({sellerRates[sellerStatus]}%)</span>
                <span className="font-mono text-slate-800">{formatPKR(sellerTax)}</span>
              </div>
              <div className="border-t border-dashed border-slate-200 my-3"></div>
              <div className="flex flex-col sm:flex-row items-center sm:justify-between">
                <span className="text-slate-500 text-sm font-medium uppercase">Total Seller Payable</span>
                <span className="text-teal-700 font-bold text-xl font-mono">{formatPKR(sellerTax)}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Total Summary */}
        <div
          className="mt-10 bg-slate-900 rounded-xl p-6 shadow-lg text-white"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-slate-700 p-2 rounded-lg">
                <span className="text-2xl">🏦</span>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-slate-300 text-sm font-medium uppercase tracking-wider">Estimated Grand Total</h3>
                <p className="text-slate-400 text-xs">Includes Fixed Charges + Buyer Tax + Seller Tax + Misc</p>
              </div>
            </div>
            <span className="text-3xl font-bold text-white font-mono tracking-tight">{formatPKR(totalTax + 500)}</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center mt-8">
          *Calculations are estimates based on standard rates. Please consult a tax professional for final verification.
        </p>
      </motion.div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-200 to-gray-300 p-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-10"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          🏠 Property Tax Calculator
        </h1>
        <p className="text-center text-gray-500 mb-10">
          Calculate total taxes for Buyer and Seller based on FBR filer status
        </p>

        {/* Property Value Threshold Indicator */}
        {propertyValue > 0 && (
          <div className={`mb-6 p-4 rounded-xl text-center font-semibold ${
            isAboveThreshold 
              ? 'bg-orange-100 text-orange-800 border-2 border-orange-300' 
              : 'bg-green-100 text-green-800 border-2 border-green-300'
          }`}>
            {isAboveThreshold 
              ? '⚠️ Property value exceeds 5 Crore PKR - Higher tax rates apply'
              : '✓ Property value is 5 Crore PKR or below - Standard tax rates apply'}
          </div>
        )}

        {/* Property Value */}
        <div className="mb-10">
          <label className="block text-gray-700 font-medium mb-1">
            Property Value (PKR)
          </label>
          <input
            type="number"
            value={propertyValue || ""}
            onChange={(e) => setPropertyValue(Number(e.target.value))}
            placeholder="Enter property value"
            className="w-full text-black border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Fixed Charges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 shadow-md"
        >
          <h2 className="text-xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
            📋 Fixed Charges (Applicable to All Buyers)
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">TMA (1%)</span>
                <span className="text-purple-700 font-semibold">{formatPKR(tmaAmount)}</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Stamp Duty (1%)</span>
                <span className="text-purple-700 font-semibold">{formatPKR(stampDutyAmount)}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 bg-purple-100 rounded-xl p-3">
            <div className="flex justify-between items-center">
              <span className="text-purple-800 font-semibold">Total Fixed Charges</span>
              <span className="text-purple-800 font-bold text-lg">{formatPKR(fixedCharges)}</span>
            </div>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Buyer Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-md"
          >
            <h2 className="text-2xl font-semibold text-indigo-700 mb-3 flex items-center gap-2">
              🧍‍♂️ Buyer (خریدار)
            </h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1 font-medium">
                Filer Status
              </label>
              <select
                value={buyerStatus}
                onChange={(e) =>
                  setBuyerStatus(e.target.value as FilerStatus)
                }
                className="w-full text-black border border-gray-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="filer">✅ Filer ({buyerRates.filer}%)</option>
                <option value="lateFiler">⚠️ Late Filer ({buyerRates.lateFiler}%)</option>
                <option value="nonFiler">❌ Non-Filer ({buyerRates.nonFiler}%)</option>
              </select>
            </div>

            <div className="mt-6 space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Fixed Charges (TMA + Stamp)</span>
                <span className="font-medium">{formatPKR(fixedCharges)}</span>
              </div>
              <div className="flex justify-between">
                <span>Filer Tax ({buyerRates[buyerStatus]}%)</span>
                <span className="font-medium">{formatPKR(buyerFilerTax)}</span>
              </div>
              <hr className="my-3 border-gray-300" />
              <div className="flex justify-between font-semibold text-indigo-700 text-lg">
                <span>Total Buyer Tax</span>
                <span>{formatPKR(buyerTax)}</span>
              </div>
            </div>
          </motion.div>

          {/* Seller Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 shadow-md"
          >
            <h2 className="text-2xl font-semibold text-emerald-700 mb-3 flex items-center gap-2">
              🧍‍♀️ Seller (بیچنے والا)
            </h2>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1 font-medium">
                Filer Status
              </label>
              <select
                value={sellerStatus}
                onChange={(e) =>
                  setSellerStatus(e.target.value as FilerStatus)
                }
                className="w-full text-black border border-gray-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="filer">✅ Filer ({sellerRates.filer}%)</option>
                <option value="lateFiler">⚠️ Late Filer ({sellerRates.lateFiler}%)</option>
                <option value="nonFiler">❌ Non-Filer ({sellerRates.nonFiler}%)</option>
              </select>
            </div>

            <div className="mt-6 space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Filer Tax ({sellerRates[sellerStatus]}%)</span>
                <span className="font-medium">
                  {formatPKR(sellerTax)}
                </span>
              </div>
              <hr className="my-3 border-gray-300" />
              <div className="flex justify-between font-semibold text-emerald-700 text-lg">
                <span>Total Seller Tax</span>
                <span>{formatPKR(sellerTax)}</span>
              </div>
            </div>
          </motion.div>
        </div>``

        {/* Total Summary */}
        <motion.div
          key={totalTax}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-10 bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 text-white"
        >
          <div className="flex justify-between text-xl font-bold">
            <span>🏦 Combined Total Tax</span>
            <span className="text-yellow-300">{formatPKR(totalTax + 500)}</span>
          </div>

          
        </motion.div>

        <p className="text-xs text-gray-400 text-center mt-8">
          *Sample rates for demonstration only. Adjust per FBR updates.
        </p>
      </motion.div>
    </div>
  );
}
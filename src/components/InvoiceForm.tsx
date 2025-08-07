// app/components/InvoiceForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaPlus,
  FaFileInvoice,
  FaUsers,
} from "react-icons/fa";
import {
  CompanyType,
  AddOn,
  InvoiceData,
  STATES,
  AVAILABLE_ADDONS,
  BASE_FEES_BY_TYPE,
  COMPANY_TYPES,
} from "../types/invoice";
// import MidnightCountdown from "@/components/conter";
import OfferBanner from "@/components/OfferBanner";

interface InvoiceFormProps {
  onInvoiceChange: (
    invoice: InvoiceData,
    hasUserSelections?: { companyType: boolean; state: boolean },
    personCount?: number
  ) => void;
}

export default function InvoiceForm({ onInvoiceChange }: InvoiceFormProps) {
  // --- STATE MANAGEMENT ---
  // Initialize states with empty strings to allow for placeholders
  const [companyType, setCompanyType] = useState<CompanyType | "">("");
  const [selectedStateName, setSelectedStateName] = useState<string>("");
  const [personCount, setPersonCount] = useState<number>(2); // Counter starts at 2
  const [addOns, setAddOns] = useState<AddOn[]>(
    AVAILABLE_ADDONS.map((addon) => ({ ...addon, selected: false }))
  );

  useEffect(() => {
    if (companyType === "" || selectedStateName === "") return;

    const selectedState = STATES.find((s) => s.name === selectedStateName);
    if (!selectedState) return;

    // --- CALCULATIONS ---
    const selectedAddOns = addOns.filter((addon) => addon.selected);
    const addOnTotal = selectedAddOns.reduce(
      (sum, addon) => sum + addon.price,
      0
    );

    const baseFees = BASE_FEES_BY_TYPE[companyType];
    const stateFee = selectedState.fees[companyType];

    // Calculate additional fees based on person count
    let additionalDscFee = 0;
    let additionalDinFee = 0;

    if (personCount > 2) {
      // DSC logic: After 2 persons, add ₹2360 for each additional person
      additionalDscFee = (personCount - 2) * 2360;
    }

    if (personCount > 3) {
      // DIN logic: After 3 persons, add ₹1180 for each additional person
      additionalDinFee = (personCount - 3) * 1180;
    }

    const subtotal =
      baseFees.dsc +
      additionalDscFee +
      baseFees.runPanTan +
      baseFees.professionalFee +
      stateFee +
      addOnTotal +
      additionalDinFee;

    // --- SPECIAL OFFER LOGIC ---
    const offerAddons = ["trademark", "iso", "startup-india", "iec"];
    const selectedOfferAddons = selectedAddOns.filter((addon) =>
      offerAddons.includes(addon.id)
    );
    const hasSpecialOffer = selectedOfferAddons.length === 4;
    const discount = hasSpecialOffer ? 2000 : 0;
    const total = subtotal - discount;

    // --- FINAL INVOICE DATA ---
    const invoiceData: InvoiceData = {
      companyType,
      state: {
        name: selectedState.name,
        fee: stateFee,
      },
      addOns: selectedAddOns,
      baseFees,
      total,
      subtotal,
      discount,
      hasSpecialOffer,
    };

    // Track if user has made selections (not empty strings)
    const hasUserSelections = {
      companyType: companyType !== ("" as CompanyType),
      state: selectedStateName !== "",
    };

    onInvoiceChange(invoiceData, hasUserSelections, personCount);
  }, [companyType, selectedStateName, personCount, addOns, onInvoiceChange]);

  // --- HANDLERS ---
  const handleAddOnToggle = (addonId: string) => {
    setAddOns((prev) =>
      prev.map((addon) =>
        addon.id === addonId ? { ...addon, selected: !addon.selected } : addon
      )
    );
  };

  const handlePersonCountChange = (newCount: number) => {
    if (newCount >= 2 && newCount <= 15) {
      setPersonCount(newCount);
    }
  };

  // --- JSX / RENDER ---
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <FaFileInvoice className="text-3xl text-green-500" />
        <h1 className="text-3xl font-bold text-[#7C5128]">
          Quotation Generator
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Company Type Dropdown */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaBuilding className="text-green-500" />
            <label className="text-base font-semibold text-gray-700">
              Company Type
            </label>
          </div>
          <select
            value={companyType}
            onChange={(e) => setCompanyType(e.target.value as CompanyType)}
            className={`w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#C2FEBC] focus:outline-none bg-white ${
              companyType === "" ? "text-gray-400" : "text-gray-700"
            }`}
          >
            <option value="" disabled>
              -- Select Company Type --
            </option>
            {COMPANY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* State Dropdown */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaMapMarkerAlt className="text-green-600" />
            <label className="text-base font-semibold text-gray-700">
              State
            </label>
          </div>
          <select
            value={selectedStateName}
            onChange={(e) => setSelectedStateName(e.target.value)}
            className={`w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#C2FEBC] focus:outline-none  ${
              selectedStateName === "" ? "text-gray-400" : "text-gray-700"
            }`}
          >
            <option value="" disabled>
              -- Select State --
            </option>
            {STATES.map((state) => (
              <option key={state.name} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add-ons Dropdown */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaPlus className="text-green-500 text-sm" />
            <label className="text-base font-semibold text-[#7C5128]">
              Add-ons
            </label>
          </div>
          <select
            onChange={(e) => handleAddOnToggle(e.target.value)}
            value="" // Always reset to show the placeholder
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none text-gray-700 bg-white"
          >
            <option value="" disabled>
              -- Select an Add-on --
            </option>
            {addOns
              .filter((addon) => !addon.selected) // Hide already selected add-ons
              .map((addon) => (
                <option key={addon.id} value={addon.id}>
                  {addon.name} (₹{addon.price.toLocaleString("en-IN")})
                </option>
              ))}
          </select>
          {addOns.some((addon) => addon.selected) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {addOns
                .filter((addon) => addon.selected)
                .map((addon) => (
                  <span
                    key={addon.id}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full"
                  >
                    {addon.name}
                    <button
                      onClick={() => handleAddOnToggle(addon.id)}
                      className="ml-2 text-red-400 hover:text-red-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Person Counter and Offer in same row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Person Counter */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaUsers className="text-green-500" />
            <label className="text-base font-semibold text-gray-700">
              Number of Directors
            </label>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePersonCountChange(personCount - 1)}
              disabled={personCount <= 2}
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 font-bold"
            >
              -
            </button>
            <span className="text-lg font-semibold text-gray-700 min-w-[3rem] text-center">
              {personCount}
            </span>
            <button
              onClick={() => handlePersonCountChange(personCount + 1)}
              disabled={personCount >= 15}
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-gray-600 font-bold"
            >
              +
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Min: 2, Max: 15 Directors
          </p>
        </div>

        {/* Empty space for middle column */}
        <div></div>

        {/* Offer section */}
        <div>
          <OfferBanner />
        </div>
      </div>
    </div>
  );
}

// app/admin/page.tsx

"use client";

import { useState, useCallback, useEffect } from "react";
import InvoiceForm from "@/components/InvoiceForm";
import CheckoutModal from "@/components/CheckoutModal";
import { InvoiceData, STATES, BASE_FEES_BY_TYPE } from "@/types/invoice";
import { useRouter } from "next/navigation";

// Helper function to get cookie value
function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // All other state hooks - must be called in same order every time
  const defaultCompanyType = "Private limited company";
  const defaultBaseFees = BASE_FEES_BY_TYPE[defaultCompanyType];

  const [invoice, setInvoice] = useState<InvoiceData>({
    companyType: defaultCompanyType,
    state: {
      name: STATES[5].name, // Delhi
      fee: STATES[5].fees[defaultCompanyType],
    },
    addOns: [],
    baseFees: defaultBaseFees,
    finalPrize: 0,
    total:
      defaultBaseFees.dsc +
      defaultBaseFees.runPanTan +
      defaultBaseFees.professionalFee +
      STATES[5].fees[defaultCompanyType],
  });

  const [personCount, setPersonCount] = useState<number>(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"checkout" | "download">("checkout");
  const [userHasSelectedCompanyType, setUserHasSelectedCompanyType] = useState(false);
  const [userHasSelectedState, setUserHasSelectedState] = useState(false);

  useEffect(() => {
    // Check for admin auth token in cookies
    const adminToken = getCookie('admin-auth-token');
    const expectedToken = process.env.NEXT_PUBLIC_ADMIN_AUTH_TOKEN;
    
    if (!adminToken || adminToken !== expectedToken) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, [router]);

  const handleInvoiceChange = useCallback(
    (
      newInvoice: InvoiceData,
      hasUserSelections?: { companyType: boolean; state: boolean },
      newPersonCount?: number
    ) => {
      setInvoice((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(newInvoice)) {
          if (hasUserSelections) {
            setUserHasSelectedCompanyType(hasUserSelections.companyType);
            setUserHasSelectedState(hasUserSelections.state);
          }
          if (newPersonCount !== undefined) {
            setPersonCount(newPersonCount);
          }
          return newInvoice;
        }
        return prev;
      });
    },
    []
  );

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    // Remove the admin auth cookie
    document.cookie = 'admin-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/admin/login');
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Render nothing if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Render admin panel
  return (
    <div className="w-full bg-white py-4 lg:px-24 md:px-20 sm:px-2">
      {/* Admin Header */}
      <div className="mb-6 flex justify-between items-center bg-blue-50 p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-blue-800">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="w-full mx-auto">
        <div className="mb-8">
          <InvoiceForm onInvoiceChange={handleInvoiceChange} />
        </div>

        {/* Final Prize Input Field - Admin Only */}
        <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Final Offered Prize (Admin Only)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Offered Prize Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={invoice.finalPrize || 0}
                onChange={(e) => {
                  const finalPrize = parseFloat(e.target.value) || 0;
                  setInvoice({ ...invoice, finalPrize });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter final prize amount"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter amount greater than 0 to show in PDF
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <div className="flex justify-end gap-4">
            {/* Download Button */}
            <button
              onClick={() => {
                if (!userHasSelectedCompanyType || !userHasSelectedState) {
                  alert(
                    "⚠️ Please select both Company Type and State before downloading your quotation!"
                  );
                  return;
                }
                setModalMode("download");
                setIsModalOpen(true);
              }}
              className="bg-black text-white border border-gray-600 font-bold py-2 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 lg:text-sm text-[5px]"
            >
              <span className="text-sm">
                Download Quotation with Final Prize
              </span>
            </button>
          </div>
        </div>

        <CheckoutModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          invoice={invoice}
          mode={modalMode}
          personCount={personCount}
        />
      </div>
    </div>
  );
}

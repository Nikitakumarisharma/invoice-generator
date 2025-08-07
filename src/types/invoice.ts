export type CompanyType =
  | "Private limited company"
  | "One Person Company"
  | "Limited Liability Partnership"
  | "Section 8 Company";

export interface StateInfo {
  name: string;
  fees: {
    "Private limited company": number;
    "One Person Company": number;
    "Limited Liability Partnership": number;
    "Section 8 Company": number;
  };
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}

export interface BaseFees {
  dsc: number;
  runPanTan: number;
  professionalFee: number;
}

export interface InvoiceData {
  companyType: CompanyType;
  state: {
    name: string;
    fee: number;
  };
  addOns: AddOn[];
  baseFees: BaseFees;
  total: number;
  subtotal?: number;
  discount?: number;
  hasSpecialOffer?: boolean;
  finalPrize?: number;
}

export interface CustomerInfo {
  fullName: string;
  contactNumber: string;
}

export interface InvoiceFormData extends InvoiceData {
  customer?: CustomerInfo;
}

// State data with filing fees for different company types
export const STATES: StateInfo[] = [
  {
    name: "Andaman and Nicobar Islands",
    fees: {
      "Private limited company": 520,
      "One Person Company": 520,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 20,
    },
  },
  {
    name: "Andhra Pradesh",
    fees: {
      "Private limited company": 1520,
      "One Person Company": 1520,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 1520,
    },
  },
  {
    name: "Arunachal Pradesh",
    fees: {
      "Private limited company": 710,
      "One Person Company": 710,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 710,
    },
  },
  {
    name: "Assam",
    fees: {
      "Private limited company": 525,
      "One Person Company": 525,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 525,
    },
  },
  {
    name: "Bihar",
    fees: {
      "Private limited company": 1600,
      "One Person Company": 1600,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 100,
    },
  },
  {
    name: "Chandigarh",
    fees: {
      "Private limited company": 1503,
      "One Person Company": 1503,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 3,
    },
  },
  {
    name: "Chhattisgarh",
    fees: {
      "Private limited company": 1510,
      "One Person Company": 1510,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 10,
    },
  },
  {
    name: "Dadar nagar",
    fees: {
      "Private limited company": 41,
      "One Person Company": 41,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 1,
    },
  },
  {
    name: "Daman and Diu",
    fees: {
      "Private limited company": 1170,
      "One Person Company": 1170,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 20,
    },
  },
  {
    name: "Delhi",
    fees: {
      "Private limited company": 360,
      "One Person Company": 360,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 10,
    },
  },
  {
    name: "Goa",
    fees: {
      "Private limited company": 1200,
      "One Person Company": 1200,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 50,
    },
  },
  {
    name: "Gujarat",
    fees: {
      "Private limited company": 820,
      "One Person Company": 820,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 20,
    },
  },
  {
    name: "Haryana",
    fees: {
      "Private limited company": 135,
      "One Person Company": 135,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 15,
    },
  },
  {
    name: "Himachal Pradesh",
    fees: {
      "Private limited company": 183,
      "One Person Company": 123,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 3,
    },
  },
  {
    name: "Jammu and Kashmir",
    fees: {
      "Private limited company": 310,
      "One Person Company": 310,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 10,
    },
  },
  {
    name: "Jharkhand",
    fees: {
      "Private limited company": 173,
      "One Person Company": 173,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 5,
    },
  },
  {
    name: "Karnataka",
    fees: {
      "Private limited company": 10020,
      "One Person Company": 10020,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 20,
    },
  },
  {
    name: "Kerala",
    fees: {
      "Private limited company": 3025,
      "One Person Company": 3025,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 3025,
    },
  },
  {
    name: "Lakshadweep",
    fees: {
      "Private limited company": 1525,
      "One Person Company": 1525,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 1525,
    },
  },
  {
    name: "Madhya Pradesh",
    fees: {
      "Private limited company": 7550,
      "One Person Company": 7550,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 7550,
    },
  },
  {
    name: "Maharashtra",
    fees: {
      "Private limited company": 1300,
      "One Person Company": 1300,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 100,
    },
  },
  {
    name: "Manipur",
    fees: {
      "Private limited company": 260,
      "One Person Company": 260,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 260,
    },
  },
  {
    name: "Meghalaya",
    fees: {
      "Private limited company": 410,
      "One Person Company": 410,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 410,
    },
  },
  {
    name: "Mizoram",
    fees: {
      "Private limited company": 260,
      "One Person Company": 260,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 260,
    },
  },
  {
    name: "Nagaland",
    fees: {
      "Private limited company": 260,
      "One Person Company": 260,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 260,
    },
  },
  {
    name: "Odisha",
    fees: {
      "Private limited company": 610,
      "One Person Company": 610,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 610,
    },
  },
  {
    name: "Puducherry",
    fees: {
      "Private limited company": 510,
      "One Person Company": 510,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 10,
    },
  },
  {
    name: "Punjab",
    fees: {
      "Private limited company": 10025,
      "One Person Company": 10025,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 25,
    },
  },
  {
    name: "Rajasthan",
    fees: {
      "Private limited company": 5500,
      "One Person Company": 5500,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 1010,
    },
  },
  {
    name: "Sikkim",
    fees: {
      "Private limited company": 0,
      "One Person Company": 0,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 0,
    },
  },
  {
    name: "Tamilnadu",
    fees: {
      "Private limited company": 520,
      "One Person Company": 520,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 20,
    },
  },
  {
    name: "Telangana",
    fees: {
      "Private limited company": 1520,
      "One Person Company": 1520,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 1520,
    },
  },
  {
    name: "Tripura",
    fees: {
      "Private limited company": 260,
      "One Person Company": 260,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 260,
    },
  },
  {
    name: "Uttar Pradesh",
    fees: {
      "Private limited company": 1010,
      "One Person Company": 1010,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 1010,
    },
  },
  {
    name: "Uttarakhand",
    fees: {
      "Private limited company": 1010,
      "One Person Company": 1010,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 1010,
    },
  },
  {
    name: "West Bengal",
    fees: {
      "Private limited company": 370,
      "One Person Company": 370,
      "Limited Liability Partnership": 643,
      "Section 8 Company": 10,
    },
  },
];

// Available add-ons
export const AVAILABLE_ADDONS: Omit<AddOn, "selected">[] = [
  { id: "msme", name: "MSME Registration", price: 0 },
  { id: "trademark", name: "Trademark Registration", price: 1999 },
  { id: "gst", name: "GST Registration", price: 2500 },
  { id: "iso", name: "ISO Registration", price: 2500 },
  { id: "startup-india", name: "Startup India Filing", price: 2999 },
  { id: "iec", name: "IEC Registration", price: 2499 },
  { id: "fssai", name: "FSSAI Registration", price: 1999 },
  { id: "gem", name: "GEM Registration ", price: 4999 },
];

// Base fees for different company types
export const BASE_FEES_BY_TYPE: Record<CompanyType, BaseFees> = {
  "Private limited company": {
    dsc: 4720,
    runPanTan: 2456,
    professionalFee: 2499,
  },
  "One Person Company": {
    dsc: 4720,
    runPanTan: 2456,
    professionalFee: 2499,
  },
  "Limited Liability Partnership": {
    dsc: 4720,
    runPanTan: 2456,
    professionalFee: 2499,
  },
  "Section 8 Company": {
    dsc: 4720,
    runPanTan: 2456,
    professionalFee: 2499,
  },
};

export const BASE_FEES: BaseFees = BASE_FEES_BY_TYPE["Private limited company"];

// Company types
export const COMPANY_TYPES: CompanyType[] = [
  "Private limited company",
  "One Person Company",
  "Limited Liability Partnership",
  "Section 8 Company",
];

// Data from affiliate's perspective
export interface Challenge {
  id: number;
  name: string;
  price: number;
  purchaseDate: string;
  commissionEarned: number;
  status: "active" | "completed" | "failed";
  completedDate?: string;
}

export interface ReferralStep {
  id: number;
  type: "signup" | "challenge";
  title: string;
  date: string;
  status: "completed" | "active" | "pending";
  details: {
    // For signup step
    signUpDate?: string;
    accountType?: string;
    verificationStatus?: string;
    commissionEarned?: number;
    // For challenge step
    challenge?: Challenge;
  };
}

export interface Referral {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  signUpDate?: string;
  totalCommission: number;
  steps: ReferralStep[];
  currentStatus: "pending" | "signed_up" | "active_trader" | "completed";
}

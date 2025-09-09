export interface AffiliateType {
  _id: string;
  userId: {
    _id: string;
    email: string;
    name: string;
  };
  tier: string;
  referralCode: string;
  referralLink: string;
  referrals: {
    referredUser: {
      _id: string;
      email: string;
      name: string;
    };
    signupDate: string;
    signupCommission: number;
    purchases: {
      challenge: {
        _id: string;
      };
      purchaseDate: string;
      challengeCost: number;
      commissionEarned: number;
      commissionPercentage: number;
      _id: string;
    }[];
    totalEarnings: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
  }[];
  totalEarnings: number;
  balance: number;
  commissionPercentage: number;
  totalReferrals: number;
  withdraws: {
    _id: string;
    userId: string;
    affiliateId: string;
    amount: number;
    status: string;
    paymentMethod: {
      type: string;
      accountNumber: string;
    };
    challengeId: string | null;
    requestedDate: string;
    processedDate: string | null;
    notes: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }[];
  totalWithdrawn: number;
  tierHistory: {
    tier: string;
    upgradedAt: string;
    referralsCount: number;
    commissionPercentage: number;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AffiliatesList {
  result: {
    data: AffiliateType[];
    pagination: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  message: string;
}

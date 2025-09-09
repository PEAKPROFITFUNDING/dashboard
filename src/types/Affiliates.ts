export interface Affiliate {
  _id: string;
  userId: string;
  user: {
    name: string;
    email: string;
    profilePicture: string;
  };
  tier: string;
  referralCode: string;
  referralLink: string;
  referrals: [];
  referralsCount: number;
  commissionPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface AffiliatesList {
  result: {
    data: ApiAffiliate[];
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

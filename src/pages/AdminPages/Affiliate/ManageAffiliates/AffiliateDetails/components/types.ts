// Types
export interface AffiliateDetails {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  joinedDate: string;
  referralCode: string;
  status: "active" | "inactive" | "pending";
  performance: {
    totalClicks: number;
    totalSignups: number;
    totalFundedAccounts: number;
    totalCommissionEarned: number;
  };
  referralStats: {
    totalReferrals: number;
    signedUp: number;
    deposited: number;
    passedChallenge: number;
  };
}

export interface Referral {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  signedUp: boolean;
  deposited: boolean;
  passedChallenge: boolean;
}

// Dummy data for affiliate details
export const affiliateDetailsData: { [key: number]: AffiliateDetails } = {
  1: {
    id: 1,
    fullName: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    joinedDate: "2024-01-15",
    referralCode: "JOHN123",
    status: "active",
    performance: {
      totalClicks: 1250,
      totalSignups: 45,
      totalFundedAccounts: 23,
      totalCommissionEarned: 1250.5,
    },
    referralStats: {
      totalReferrals: 45,
      signedUp: 32,
      deposited: 18,
      passedChallenge: 12,
    },
  },
  2: {
    id: 2,
    fullName: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 234-5678",
    joinedDate: "2024-01-20",
    referralCode: "SARAH456",
    status: "active",
    performance: {
      totalClicks: 890,
      totalSignups: 32,
      totalFundedAccounts: 18,
      totalCommissionEarned: 890.25,
    },
    referralStats: {
      totalReferrals: 32,
      signedUp: 25,
      deposited: 12,
      passedChallenge: 8,
    },
  },
  3: {
    id: 3,
    fullName: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "+1 (555) 345-6789",
    joinedDate: "2024-02-01",
    referralCode: "MIKE789",
    status: "inactive",
    performance: {
      totalClicks: 450,
      totalSignups: 15,
      totalFundedAccounts: 8,
      totalCommissionEarned: 450.75,
    },
    referralStats: {
      totalReferrals: 15,
      signedUp: 10,
      deposited: 5,
      passedChallenge: 3,
    },
  },
  4: {
    id: 4,
    fullName: "Emily Davis",
    email: "emily.d@email.com",
    phone: "+1 (555) 456-7890",
    joinedDate: "2024-02-10",
    referralCode: "EMILY101",
    status: "active",
    performance: {
      totalClicks: 1100,
      totalSignups: 38,
      totalFundedAccounts: 20,
      totalCommissionEarned: 1100.0,
    },
    referralStats: {
      totalReferrals: 38,
      signedUp: 28,
      deposited: 15,
      passedChallenge: 10,
    },
  },
  5: {
    id: 5,
    fullName: "David Wilson",
    email: "david.w@email.com",
    phone: "+1 (555) 567-8901",
    joinedDate: "2024-02-15",
    referralCode: "DAVID202",
    status: "pending",
    performance: {
      totalClicks: 300,
      totalSignups: 12,
      totalFundedAccounts: 6,
      totalCommissionEarned: 300.0,
    },
    referralStats: {
      totalReferrals: 12,
      signedUp: 8,
      deposited: 4,
      passedChallenge: 2,
    },
  },
  6: {
    id: 6,
    fullName: "Lisa Brown",
    email: "lisa.b@email.com",
    phone: "+1 (555) 678-9012",
    joinedDate: "2024-02-20",
    referralCode: "LISA303",
    status: "active",
    performance: {
      totalClicks: 950,
      totalSignups: 35,
      totalFundedAccounts: 19,
      totalCommissionEarned: 950.0,
    },
    referralStats: {
      totalReferrals: 35,
      signedUp: 26,
      deposited: 14,
      passedChallenge: 9,
    },
  },
  7: {
    id: 7,
    fullName: "Robert Taylor",
    email: "robert.t@email.com",
    phone: "+1 (555) 789-0123",
    joinedDate: "2024-03-01",
    referralCode: "ROBERT404",
    status: "inactive",
    performance: {
      totalClicks: 400,
      totalSignups: 14,
      totalFundedAccounts: 7,
      totalCommissionEarned: 400.0,
    },
    referralStats: {
      totalReferrals: 14,
      signedUp: 9,
      deposited: 5,
      passedChallenge: 3,
    },
  },
  8: {
    id: 8,
    fullName: "Jennifer Garcia",
    email: "jennifer.g@email.com",
    phone: "+1 (555) 890-1234",
    joinedDate: "2024-03-05",
    referralCode: "JENNIFER505",
    status: "active",
    performance: {
      totalClicks: 1200,
      totalSignups: 42,
      totalFundedAccounts: 22,
      totalCommissionEarned: 1200.0,
    },
    referralStats: {
      totalReferrals: 42,
      signedUp: 30,
      deposited: 17,
      passedChallenge: 11,
    },
  },
  9: {
    id: 9,
    fullName: "Michael Martinez",
    email: "michael.m@email.com",
    phone: "+1 (555) 901-2345",
    joinedDate: "2024-03-10",
    referralCode: "MICHAEL606",
    status: "active",
    performance: {
      totalClicks: 800,
      totalSignups: 29,
      totalFundedAccounts: 16,
      totalCommissionEarned: 800.0,
    },
    referralStats: {
      totalReferrals: 29,
      signedUp: 21,
      deposited: 11,
      passedChallenge: 7,
    },
  },
  10: {
    id: 10,
    fullName: "Amanda Rodriguez",
    email: "amanda.r@email.com",
    phone: "+1 (555) 012-3456",
    joinedDate: "2024-03-15",
    referralCode: "AMANDA707",
    status: "pending",
    performance: {
      totalClicks: 250,
      totalSignups: 10,
      totalFundedAccounts: 5,
      totalCommissionEarned: 250.0,
    },
    referralStats: {
      totalReferrals: 10,
      signedUp: 7,
      deposited: 3,
      passedChallenge: 2,
    },
  },
};

// Dummy referral data
export const referralData: Referral[] = [
  {
    id: 1,
    fullName: "Alice Johnson",
    email: "alice.j@email.com",
    phone: "+1 (555) 111-1111",
    signedUp: true,
    deposited: true,
    passedChallenge: true,
  },
  {
    id: 2,
    fullName: "Bob Wilson",
    email: "bob.w@email.com",
    phone: "+1 (555) 222-2222",
    signedUp: true,
    deposited: true,
    passedChallenge: false,
  },
  {
    id: 3,
    fullName: "Carol Davis",
    email: "carol.d@email.com",
    phone: "+1 (555) 333-3333",
    signedUp: true,
    deposited: false,
    passedChallenge: false,
  },
  {
    id: 4,
    fullName: "David Brown",
    email: "david.b@email.com",
    phone: "+1 (555) 444-4444",
    signedUp: false,
    deposited: false,
    passedChallenge: false,
  },
  {
    id: 5,
    fullName: "Eva Garcia",
    email: "eva.g@email.com",
    phone: "+1 (555) 555-5555",
    signedUp: true,
    deposited: true,
    passedChallenge: true,
  },
];

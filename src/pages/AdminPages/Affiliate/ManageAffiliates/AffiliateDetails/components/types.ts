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
    email: "emily.davis@email.com",
    phone: "+1 (555) 456-7890",
    joinedDate: "2024-02-10",
    referralCode: "EMILY101",
    status: "pending",
    performance: {
      totalClicks: 0,
      totalSignups: 0,
      totalFundedAccounts: 0,
      totalCommissionEarned: 0,
    },
    referralStats: {
      totalReferrals: 0,
      signedUp: 0,
      deposited: 0,
      passedChallenge: 0,
    },
  },
  5: {
    id: 5,
    fullName: "David Wilson",
    email: "david.wilson@email.com",
    phone: "+1 (555) 567-8901",
    joinedDate: "2024-02-15",
    referralCode: "DAVID202",
    status: "active",
    performance: {
      totalClicks: 2100,
      totalSignups: 78,
      totalFundedAccounts: 45,
      totalCommissionEarned: 2100.0,
    },
    referralStats: {
      totalReferrals: 78,
      signedUp: 58,
      deposited: 32,
      passedChallenge: 22,
    },
  },
  6: {
    id: 6,
    fullName: "Lisa Brown",
    email: "lisa.brown@email.com",
    phone: "+1 (555) 678-9012",
    joinedDate: "2024-02-20",
    referralCode: "LISA303",
    status: "active",
    performance: {
      totalClicks: 675,
      totalSignups: 28,
      totalFundedAccounts: 15,
      totalCommissionEarned: 675.3,
    },
    referralStats: {
      totalReferrals: 28,
      signedUp: 21,
      deposited: 11,
      passedChallenge: 7,
    },
  },
  7: {
    id: 7,
    fullName: "Alex Thompson",
    email: "alex.thompson@email.com",
    phone: "+1 (555) 789-0123",
    joinedDate: "2024-03-01",
    referralCode: "ALEX404",
    status: "inactive",
    performance: {
      totalClicks: 320,
      totalSignups: 12,
      totalFundedAccounts: 6,
      totalCommissionEarned: 320.45,
    },
    referralStats: {
      totalReferrals: 12,
      signedUp: 9,
      deposited: 5,
      passedChallenge: 3,
    },
  },
  8: {
    id: 8,
    fullName: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "+1 (555) 890-1234",
    joinedDate: "2024-03-05",
    referralCode: "MARIA505",
    status: "active",
    performance: {
      totalClicks: 1580,
      totalSignups: 52,
      totalFundedAccounts: 31,
      totalCommissionEarned: 1580.8,
    },
    referralStats: {
      totalReferrals: 52,
      signedUp: 39,
      deposited: 22,
      passedChallenge: 15,
    },
  },
  9: {
    id: 9,
    fullName: "James Lee",
    email: "james.lee@email.com",
    phone: "+1 (555) 901-2345",
    joinedDate: "2024-03-10",
    referralCode: "JAMES606",
    status: "pending",
    performance: {
      totalClicks: 0,
      totalSignups: 0,
      totalFundedAccounts: 0,
      totalCommissionEarned: 0,
    },
    referralStats: {
      totalReferrals: 0,
      signedUp: 0,
      deposited: 0,
      passedChallenge: 0,
    },
  },
  10: {
    id: 10,
    fullName: "Anna White",
    email: "anna.white@email.com",
    phone: "+1 (555) 012-3456",
    joinedDate: "2024-03-15",
    referralCode: "ANNA707",
    status: "active",
    performance: {
      totalClicks: 920,
      totalSignups: 35,
      totalFundedAccounts: 20,
      totalCommissionEarned: 920.15,
    },
    referralStats: {
      totalReferrals: 35,
      signedUp: 26,
      deposited: 14,
      passedChallenge: 9,
    },
  },
};

export const dummyAffiliates: Affiliate[] = [
  {
    id: 1,
    fullName: "John Smith",
    email: "john.smith@email.com",
    status: "active",
    clicks: 1250,
    signups: 45,
    fundedAccounts: 23,
    commissionsEarned: 1250.5,
  },
  {
    id: 2,
    fullName: "Sarah Johnson",
    email: "sarah.j@email.com",
    status: "active",
    clicks: 890,
    signups: 32,
    fundedAccounts: 18,
    commissionsEarned: 890.25,
  },
  {
    id: 3,
    fullName: "Mike Chen",
    email: "mike.chen@email.com",
    status: "inactive",
    clicks: 450,
    signups: 15,
    fundedAccounts: 8,
    commissionsEarned: 450.75,
  },
  {
    id: 4,
    fullName: "Emily Davis",
    email: "emily.davis@email.com",
    status: "pending",
    clicks: 0,
    signups: 0,
    fundedAccounts: 0,
    commissionsEarned: 0,
  },
  {
    id: 5,
    fullName: "David Wilson",
    email: "david.w@email.com",
    status: "active",
    clicks: 2100,
    signups: 78,
    fundedAccounts: 45,
    commissionsEarned: 2100.0,
  },
  {
    id: 6,
    fullName: "Lisa Brown",
    email: "lisa.b@email.com",
    status: "active",
    clicks: 675,
    signups: 28,
    fundedAccounts: 15,
    commissionsEarned: 675.3,
  },
  {
    id: 7,
    fullName: "Alex Thompson",
    email: "alex.thompson@email.com",
    status: "inactive",
    clicks: 320,
    signups: 12,
    fundedAccounts: 6,
    commissionsEarned: 320.45,
  },
  {
    id: 8,
    fullName: "Maria Garcia",
    email: "maria.garcia@email.com",
    status: "active",
    clicks: 1580,
    signups: 52,
    fundedAccounts: 31,
    commissionsEarned: 1580.8,
  },
  {
    id: 9,
    fullName: "Michael Martinez",
    email: "michael.m@email.com",
    status: "pending",
    clicks: 0,
    signups: 0,
    fundedAccounts: 0,
    commissionsEarned: 0,
  },
  {
    id: 10,
    fullName: "Amanda Rodriguez",
    email: "amanda.r@email.com",
    status: "active",
    clicks: 920,
    signups: 35,
    fundedAccounts: 20,
    commissionsEarned: 920.15,
  },
];

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

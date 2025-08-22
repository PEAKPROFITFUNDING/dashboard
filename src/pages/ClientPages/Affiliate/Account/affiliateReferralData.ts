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

export const affiliateReferralData: Referral[] = [
  {
    id: 1,
    fullName: "Alice Johnson",
    email: "alice.j@email.com",
    phone: "+1 (555) 111-1111",
    signUpDate: "2024-01-15",
    totalCommission: 750,
    currentStatus: "completed",
    steps: [
      {
        id: 1,
        type: "signup",
        title: "Account Sign Up",
        date: "2024-01-15",
        status: "completed",
        details: {
          signUpDate: "2024-01-15",
          accountType: "Individual",
          verificationStatus: "Verified",
          commissionEarned: 50,
        },
      },
      {
        id: 2,
        type: "challenge",
        title: "First Challenge Purchase",
        date: "2024-01-20",
        status: "completed",
        details: {
          challenge: {
            id: 101,
            name: "$10K Challenge",
            price: 99,
            purchaseDate: "2024-01-20",
            commissionEarned: 200,
            status: "completed",
            completedDate: "2024-02-10",
          },
        },
      },
      {
        id: 3,
        type: "challenge",
        title: "Second Challenge Purchase",
        date: "2024-02-15",
        status: "completed",
        details: {
          challenge: {
            id: 102,
            name: "$25K Challenge",
            price: 199,
            purchaseDate: "2024-02-15",
            commissionEarned: 500,
            status: "completed",
            completedDate: "2024-03-10",
          },
        },
      },
      {
        id: 3,
        type: "challenge",
        title: "Second Challenge Purchase",
        date: "2024-02-15",
        status: "completed",
        details: {
          challenge: {
            id: 102,
            name: "$25K Challenge",
            price: 199,
            purchaseDate: "2024-02-15",
            commissionEarned: 500,
            status: "completed",
            completedDate: "2024-03-10",
          },
        },
      },
    ],
  },
  {
    id: 2,
    fullName: "Bob Wilson",
    email: "bob.w@email.com",
    phone: "+1 (555) 222-2222",
    signUpDate: "2024-01-20",
    totalCommission: 250,
    currentStatus: "active_trader",
    steps: [
      {
        id: 1,
        type: "signup",
        title: "Account Sign Up",
        date: "2024-01-20",
        status: "completed",
        details: {
          signUpDate: "2024-01-20",
          accountType: "Individual",
          verificationStatus: "Verified",
          commissionEarned: 50,
        },
      },
      {
        id: 2,
        type: "challenge",
        title: "Challenge Purchase",
        date: "2024-01-25",
        status: "active",
        details: {
          challenge: {
            id: 103,
            name: "$5K Challenge",
            price: 49,
            purchaseDate: "2024-01-25",
            commissionEarned: 200,
            status: "active",
          },
        },
      },
    ],
  },
  {
    id: 3,
    fullName: "Carol Davis",
    email: "carol.d@email.com",
    phone: "+1 (555) 333-3333",
    signUpDate: "2024-01-25",
    totalCommission: 50,
    currentStatus: "signed_up",
    steps: [
      {
        id: 1,
        type: "signup",
        title: "Account Sign Up",
        date: "2024-01-25",
        status: "completed",
        details: {
          signUpDate: "2024-01-25",
          accountType: "Individual",
          verificationStatus: "Pending",
          commissionEarned: 50,
        },
      },
    ],
  },
  {
    id: 4,
    fullName: "David Brown",
    email: "david.b@email.com",
    phone: "+1 (555) 444-4444",
    totalCommission: 0,
    currentStatus: "pending",
    steps: [],
  },
  {
    id: 5,
    fullName: "Eva Garcia",
    email: "eva.g@email.com",
    phone: "+1 (555) 555-5555",
    signUpDate: "2024-02-01",
    totalCommission: 1250,
    currentStatus: "completed",
    steps: [
      {
        id: 1,
        type: "signup",
        title: "Account Sign Up",
        date: "2024-02-01",
        status: "completed",
        details: {
          signUpDate: "2024-02-01",
          accountType: "Corporate",
          verificationStatus: "Verified",
          commissionEarned: 50,
        },
      },
      {
        id: 2,
        type: "challenge",
        title: "First Challenge Purchase",
        date: "2024-02-05",
        status: "completed",
        details: {
          challenge: {
            id: 104,
            name: "$50K Challenge",
            price: 299,
            purchaseDate: "2024-02-05",
            commissionEarned: 600,
            status: "completed",
            completedDate: "2024-03-01",
          },
        },
      },
      {
        id: 3,
        type: "challenge",
        title: "Second Challenge Purchase",
        date: "2024-03-10",
        status: "completed",
        details: {
          challenge: {
            id: 105,
            name: "$100K Challenge",
            price: 499,
            purchaseDate: "2024-03-10",
            commissionEarned: 600,
            status: "completed",
            completedDate: "2024-04-15",
          },
        },
      },
    ],
  },
];

// Types
export interface Affiliate {
  id: number;
  fullName: string;
  email: string;
  status: "active" | "inactive" | "pending";
  clicks: number;
  signups: number;
  fundedAccounts: number;
  commissionsEarned: number;
}

export type FilterType = "all" | "active" | "inactive" | "pending";
export type SortField = "commissionsEarned" | "signups" | "fullName" | "status";

// Dummy data
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
    email: "david.wilson@email.com",
    status: "active",
    clicks: 2100,
    signups: 78,
    fundedAccounts: 45,
    commissionsEarned: 2100.0,
  },
  {
    id: 6,
    fullName: "Lisa Brown",
    email: "lisa.brown@email.com",
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
    fullName: "James Lee",
    email: "james.lee@email.com",
    status: "pending",
    clicks: 0,
    signups: 0,
    fundedAccounts: 0,
    commissionsEarned: 0,
  },
  {
    id: 10,
    fullName: "Anna White",
    email: "anna.white@email.com",
    status: "active",
    clicks: 920,
    signups: 35,
    fundedAccounts: 20,
    commissionsEarned: 920.15,
  },
];

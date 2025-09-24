// TypeScript interfaces for payout feature
export interface Challenge {
  id: string;
  name: string;
  profit: number;
  drawdown: number;
  targetMet: boolean;
  rulesRespected: boolean;
  nextPayoutDate: string;
  eligible: boolean;
  eligibilityReason?: string;
  performanceSummary: string;
  payoutWindowOpen: boolean;
  payoutStatus: "not_requested" | "requested" | "paid";
  username: string;
  avatarUrl: string;
}

export function fetchTraderAccounts(): Promise<TraderAccount[]> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(dummyTraderAccounts), 800)
  );
}

export interface AdminPayoutRequest {
  id: string;
  challengeId: string;
  username: string;
  avatarUrl: string;
  requestedAt: string;
  method: "PayPal" | "Bank" | "Crypto";
  accountHolder: string;
  details: string;
  amount: number;
  status: "pending" | "approved" | "declined";
}

export const dummyPayoutRequests: AdminPayoutRequest[] = [
  {
    id: "req-1",
    challengeId: "ch-1",
    username: "john_doe",
    avatarUrl: "/images/user/user-01.jpg",
    requestedAt: new Date().toISOString(),
    method: "PayPal",
    accountHolder: "John Doe",
    details: "john@example.com",
    amount: 5200,
    status: "pending",
  },
  {
    id: "req-2",
    challengeId: "ch-2",
    username: "jane_smith",
    avatarUrl: "/images/user/user-02.jpg",
    requestedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    method: "Bank",
    accountHolder: "Jane Smith",
    details: "IBAN: DE89370400440532013000",
    amount: 3400,
    status: "approved",
  },
  {
    id: "req-3",
    challengeId: "ch-3",
    username: "alex_trader",
    avatarUrl: "/images/user/user-03.jpg",
    requestedAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    method: "Crypto",
    accountHolder: "Alex Trader",
    details: "BTC Address: 1BoatSLRHtKNngkdXEeobR76b53LETtpyT",
    amount: 1200,
    status: "declined",
  },
  {
    id: "req-4",
    challengeId: "ch-4",
    username: "lisa_m",
    avatarUrl: "/images/user/user-04.jpg",
    requestedAt: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    method: "PayPal",
    accountHolder: "Lisa M",
    details: "lisa.m@example.com",
    amount: 2750,
    status: "pending",
  },
  {
    id: "req-5",
    challengeId: "ch-5",
    username: "trader_mark",
    avatarUrl: "/images/user/user-05.jpg",
    requestedAt: new Date(Date.now() - 4 * 86400000).toISOString(), // 4 days ago
    method: "Bank",
    accountHolder: "Mark Henry",
    details: "IBAN: GB29NWBK60161331926819",
    amount: 4100,
    status: "pending",
  },
  {
    id: "req-6",
    challengeId: "ch-6",
    username: "emma_w",
    avatarUrl: "/images/user/user-06.jpg",
    requestedAt: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
    method: "Crypto",
    accountHolder: "Emma W",
    details: "ETH Address: 0x32Be343B94f860124dC4fEe278FDCBD38C102D88",
    amount: 1800,
    status: "approved",
  },
];

export interface TraderAccount {
  id: string;
  name: string;
  challengeType: string;
  eligible: boolean;
  nextPayoutDate: string;
  performanceSummary: string;
}

export const dummyTraderAccounts: TraderAccount[] = [
  {
    id: "acc-1",
    name: "John Doe Account",
    challengeType: " $100K Challenge",
    eligible: true,
    nextPayoutDate: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000
    ).toISOString(),
    performanceSummary: "Profit: $5,200 | Drawdown: $1,800",
  },
  {
    id: "acc-2",
    name: "Alice Smith Account",
    challengeType: " $50K Challenge",
    eligible: false,
    nextPayoutDate: new Date(
      Date.now() + 10 * 24 * 60 * 60 * 1000
    ).toISOString(),
    performanceSummary: "Profit: $2,100 | Drawdown: $900",
  },
];

export interface PayoutRequest {
  challengeId: string;
  method: "PayPal" | "Bank" | "Crypto";
  accountHolder: string;
  details: string;
}

export interface PayoutEligibility {
  eligible: boolean;
  reason?: string;
  nextPayoutDate: string;
  targetMet: boolean;
  rulesRespected: boolean;
}

// Dummy data for challenges
export const dummyChallenges: Challenge[] = [
  {
    id: "ch-1",
    name: " $100K Challenge",
    profit: 5200,
    drawdown: 1800,
    targetMet: true,
    rulesRespected: true,
    nextPayoutDate: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000
    ).toISOString(),
    eligible: true,
    eligibilityReason: "",
    performanceSummary: "Profit: $5,200 | Drawdown: $1,800",
    payoutWindowOpen: true,
    payoutStatus: "not_requested",
    username: "john_doe",
    avatarUrl: "/images/user/user-01.jpg",
  },
  {
    id: "ch-2",
    name: " $50K Challenge",
    profit: 2100,
    drawdown: 900,
    targetMet: false,
    rulesRespected: true,
    nextPayoutDate: new Date(
      Date.now() + 10 * 24 * 60 * 60 * 1000
    ).toISOString(),
    eligible: false,
    eligibilityReason: "Target not met",
    performanceSummary: "Profit: $2,100 | Drawdown: $900",
    payoutWindowOpen: false,
    payoutStatus: "not_requested",
    username: "alice_smith",
    avatarUrl: "/images/user/user-02.jpg",
  },
  {
    id: "ch-3",
    name: "Challenge 1",
    profit: 1200,
    drawdown: 200,
    targetMet: true,
    rulesRespected: true,
    nextPayoutDate: "2025-07-28",
    eligible: true,
    eligibilityReason: "",
    performanceSummary: "Profit: $1,200 | Drawdown: $200",
    payoutWindowOpen: true,
    payoutStatus: "not_requested",
    username: "michael_brown",
    avatarUrl: "/images/user/user-03.jpg",
  },
  {
    id: "ch-4",
    name: "Challenge 2",
    profit: 1500,
    drawdown: 300,
    targetMet: true,
    rulesRespected: true,
    nextPayoutDate: "2025-07-25",
    eligible: true,
    eligibilityReason: "",
    performanceSummary: "Profit: $1,500 | Drawdown: $300",
    payoutWindowOpen: true,
    payoutStatus: "requested",
    username: "emma_wilson",
    avatarUrl: "/images/user/user-04.jpg",
  },
  {
    id: "ch-5",
    name: "Challenge 3",
    profit: 900,
    drawdown: 100,
    targetMet: false,
    rulesRespected: false,
    nextPayoutDate: "2025-07-30",
    eligible: false,
    eligibilityReason: "Rules not respected",
    performanceSummary: "Profit: $900 | Drawdown: $100",
    payoutWindowOpen: true,
    payoutStatus: "paid",
    username: "liam_jones",
    avatarUrl: "/images/user/user-05.jpg",
  },
];

// Mock API: fetch challenges for the logged-in trader
export function fetchTraderChallenges(): Promise<Challenge[]> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(dummyChallenges), 800)
  );
}

// Mock API: fetch payout eligibility for an account
export function fetchPayoutEligibility(
  accountId: string
): Promise<PayoutEligibility> {
  const account = dummyChallenges.find((a) => a.id === accountId);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!account) return reject(new Error("Account not found"));
      resolve({
        eligible: account.eligible,
        reason: account.eligibilityReason,
        nextPayoutDate: account.nextPayoutDate,
        targetMet: account.targetMet,
        rulesRespected: account.rulesRespected,
      });
    }, 500);
  });
}

// Mock API: submit payout request
export function submitPayoutRequest(
  request: PayoutRequest
): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          success: true,
          message: "Payout request submitted successfully!",
        }),
      1000
    )
  );
}

// Mock API: fetch all funded trader challenges (admin view)
export function fetchAllFundedChallenges(): Promise<Challenge[]> {
  // In real API, this would return all traders' challenges
  return new Promise((resolve) =>
    setTimeout(() => resolve(dummyChallenges), 800)
  );
}

export interface Affiliate {
  id: string;
  fullName: string;
  email: string;
  status: "active" | "inactive" | "pending" | "bronze" | "silver" | "gold";
  clicks: number;
  signups: number;
  fundedAccounts: number;
  commissionsEarned: number;
  referralCode: string;
}

export type FilterType =
  | "all"
  | "active"
  | "inactive"
  | "pending"
  | "bronze"
  | "silver"
  | "gold";

export type SortField =
  | "fullName"
  | "email"
  | "status"
  | "clicks"
  | "signups"
  | "fundedAccounts"
  | "commissionsEarned";

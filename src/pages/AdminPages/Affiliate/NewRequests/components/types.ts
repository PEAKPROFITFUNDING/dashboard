export interface AffiliateRequest {
  id: number;
  fullName: string;
  email: string;
  strategy: string;
  appliedDate: string;
  socialMediaLink: string;
  websiteLink: string;
  status: "pending" | "approved" | "rejected";
  flag?: string;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  text: string;
  timestamp: string;
}

export const flagOptions = [
  { value: "", label: "No Flag" },
  { value: "suspicious", label: "Suspicious" },
  { value: "top_referrer", label: "Top Referrer" },
  { value: "blacklisted", label: "Blacklisted" },
];

export interface AffiliateRequest {
  id: number;
  _id?: string; // Add MongoDB ObjectId for API calls
  fullName: string;
  email: string;
  appliedDate: string;
  status: "pending" | "approved" | "rejected";
  strategy: string;
  socialMediaLink: string;
  websiteLink: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  comments?: Comment[];
  flag?: string;
}

export interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
}

export const flagOptions = [
  { value: "", label: "No Flag" },
  { value: "high-priority", label: "High Priority" },
  { value: "requires-review", label: "Requires Review" },
  { value: "suspicious", label: "Suspicious" },
  { value: "follow-up", label: "Follow Up" },
];

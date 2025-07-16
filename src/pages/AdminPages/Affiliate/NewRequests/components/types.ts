export interface AffiliateRequest {
  id: number;
  fullName: string;
  email: string;
  applicationNote: string;
  appliedDate: string;
  socialLink: string;
  status: "pending" | "approved" | "rejected";
  flag?: string;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  text: string;
  timestamp: string;
}

// Dummy data
export const dummyRequests: AffiliateRequest[] = [
  {
    id: 1,
    fullName: "John Smith",
    email: "john.smith@email.com",
    applicationNote:
      "I have a large following in the tech space and would love to promote your products. I've been in the industry for 5 years and have successfully promoted similar products.",
    appliedDate: "2024-01-15",
    socialLink: "https://instagram.com/johnsmith",
    status: "pending",
  },
  {
    id: 2,
    fullName: "Sarah Johnson",
    email: "sarah.j@email.com",
    applicationNote:
      "I'm a fitness influencer with 50K followers. I focus on health and wellness products. I believe your products would be a great fit for my audience.",
    appliedDate: "2024-01-14",
    socialLink: "https://youtube.com/sarahjohnson",
    status: "pending",
  },
  {
    id: 3,
    fullName: "Mike Chen",
    email: "mike.chen@email.com",
    applicationNote:
      "I run a successful blog about personal finance and investment. My readers are always looking for ways to improve their financial situation.",
    appliedDate: "2024-01-13",
    socialLink: "https://twitter.com/mikechen",
    status: "pending",
  },
  {
    id: 4,
    fullName: "Emily Davis",
    email: "emily.davis@email.com",
    applicationNote:
      "I'm a lifestyle blogger with a focus on sustainable living. I think your products align well with my values and audience.",
    appliedDate: "2024-01-12",
    socialLink: "https://tiktok.com/@emilydavis",
    status: "pending",
  },
  {
    id: 5,
    fullName: "David Wilson",
    email: "david.wilson@email.com",
    applicationNote:
      "I have a podcast about entrepreneurship and business. I'd love to feature your products to my listeners who are always looking for new opportunities.",
    appliedDate: "2024-01-11",
    socialLink: "https://linkedin.com/in/davidwilson",
    status: "pending",
  },
  {
    id: 6,
    fullName: "Lisa Brown",
    email: "lisa.brown@email.com",
    applicationNote:
      "I'm a travel vlogger with a global audience. I think your products would be perfect for travelers looking to make money while on the road.",
    appliedDate: "2024-01-10",
    socialLink: "https://instagram.com/lisabrown",
    status: "pending",
  },
  {
    id: 7,
    fullName: "Alex Thompson",
    email: "alex.thompson@email.com",
    applicationNote:
      "I have a gaming channel with 100K subscribers. I'm looking to diversify my income streams and think affiliate marketing would be perfect.",
    appliedDate: "2024-01-09",
    socialLink: "https://youtube.com/alext",
    status: "pending",
  },
  {
    id: 8,
    fullName: "Maria Garcia",
    email: "maria.garcia@email.com",
    applicationNote:
      "I'm a beauty influencer with a focus on skincare and wellness. I believe your products would resonate well with my audience.",
    appliedDate: "2024-01-08",
    socialLink: "https://instagram.com/mariagarcia",
    status: "pending",
  },
];

export const flagOptions = [
  { value: "", label: "No Flag" },
  { value: "suspicious", label: "Suspicious" },
  { value: "top_referrer", label: "Top Referrer" },
  { value: "blacklisted", label: "Blacklisted" },
];

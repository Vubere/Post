interface User {
  _id?: string;
  id?: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
  passwordChangedAt?: Date | null;
  dateOfBirth: Date;
  biography: string;
  location: string;
  interest?: Array<string>;
  coverPhoto: string;
  profilePhoto: string;
  active: boolean;
  profileSections?: { name: string; content: string }[];
  blogNotifications?: Array<"all" | "followers" | "mutuals" | "subscribers">;
  messageAccess?: Array<"all" | "followers" | "mutuals" | "subscribers">;
  notificationAccess?: Array<"all" | "followers" | "mutuals" | "subscribers">;
  subscribers?: Array<string>;
  subscriptions?: Array<string>;
  followers?: Array<string>;
  following?: Array<string>;
  viewedProfiles?: Array<string>;
  profileViews?: Array<string>;
  notifications?: Array<{ id: string; read: Boolean }>;
  likes?: Array<string>;
  posts?: Array<string>;
  bookmarks?: Array<string>;
  blockedBy?: Array<string>;
  blocked?: Array<string>;
  createdBy?: string | null;
}

interface Post extends Document {
  id?: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  status: "0" | "1"; //"Draft"|"Published"
  edited: boolean;
  title: string;
  synopsis: string;
  content: string;
  coverPhoto: string;
  likes?: Array<string>;
  views?: Array<string>;
  clicks?: Array<string>;
  reads?: Array<string>;
  categories?: Array<string>;
  isPaywalled: boolean;
  paywallFee?: string;
  paywallPayedBy?: Array<string>;
  paywalledUsers?: Array<"all" | "followers" | "mutuals" | "subscribers">;
  userAccess?: Array<"all" | "followers" | "mutuals" | "subscribers">;
  comments?: Array<{ id: string; userId: string }>;
  tips?: Array<{ userId: string; amount: Number }>;
  notifications?: boolean;
  resharedBy?: Array<string>;
  bookmarkedBy?: Array<string>;
  version?: number;
  deleted?: boolean;
}

export type { User, Post };

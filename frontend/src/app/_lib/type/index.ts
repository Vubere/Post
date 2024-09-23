import { FormState, UseFormGetValues, UseFormRegister } from "react-hook-form";

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
  postNotifications?: Array<"all" | "followers" | "subscribers">;
  messageAccess?: Array<"all" | "followers" | "subscribers">;
  notificationAccess?: Array<"all" | "followers" | "subscribers">;
  signUpMethod?: "google-auth" | "signup-form";

  subscribers?: Array<string>;
  subscriptions?: Array<string>;
  followers?: Array<string>;
  following?: Array<string>;
  viewedProfiles?: Array<string>;
  profileViews?: Array<string>;
  notifications?: Array<{ id: string; read: Boolean }>;
  praises?: Array<string>;
  posts?: Array<string>;
  bookmarks?: Array<string>;
  blockedBy?: Array<string>;
  blocked?: Array<string>;
  createdBy?: string | null;
}

interface Post {
  _id?: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  author?: string;
  authorDetails?: User;
  status?: 0 | 1; //"Draft"|"Published"
  edited?: boolean;
  title: string;
  synopsis?: string;
  content?: string;
  coverPhoto?: string;
  praises?: Array<string>;
  views?: Array<string>;
  clicks?: Array<string>;
  reads?: Array<string>;
  categories?: Array<string>;
  isPaywalled?: boolean;
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
  type?: "Post" | "Essay" | "Short story" | "Article";
  clicksCount?: number;
  viewsCount?: number;
  theme?: "Roboto" | "BreeSerif" | "Jacques" | "Merriweather" | "Default";
  readsCount?: number;
  praisesCount?: number;
  bookmarksCount?: number;
  commentsCount?: number;
  tipsCount?: number;
  sharesCount?: number;
}
interface Comments {
  createdAt?: Date;
  authorDetails?: User;
  updatedAt?: Date;
  id?: string;
  _id?: string;
  postId?: string;
  authorId: string;
  edited?: boolean;
  content: string;
  commentRepliedTo?: string | null;
  praises?: Array<string>;
  views?: number;
  clicks?: number;
  reads?: number;
  replies?: Array<{ id: string; userId: string }>;
  notifications?: boolean;
  bookmarkedBy?: Array<string>;
}
interface PostPayload {
  id?: string;
  author?: string;
  status: 0 | 1; //"Draft"|"Published"
  title: string;
  synopsis: string;
  paywalledUsers?: Array<"all" | "followers" | "subscribers">;
  isPaywalled?: boolean;
  userAccess?: Array<"all" | "followers" | "mutuals" | "subscribers">;
  content: string;
  coverPhoto: string;
}

type Multi = {
  value?: string[];
  onChange?: (v: string[]) => void;
  className?: string;
  multiSelect?: true;
  multiTextOptions?: string[];
};
type Option = {
  label: string | number;
  value: string | number;
};
type SingleOp = {
  options?: Option[];
  value?: string | number;
  onChange?: (v: string | number, o?: Option) => void;
  className?: string;
};

type MultiOp = {
  options?: Option[];
  value: (string | number)[];
  onChange?: (v: (string | number)[], o?: Option) => void;
  className?: string;
  multiSelect?: true;
};
type MultiSelect = SingleOp | MultiOp;
type InputProps = {
  className?: string;
  label: string;
  type?:
    | "text"
    | "select"
    | "textarea"
    | "multi-input"
    | "number"
    | "date"
    | "email";
  name: string;
  placeholder?: string;
  state: {
    formState: FormState<any>;
    getValues: UseFormGetValues<any>;
    register: UseFormRegister<any>;
    control: any;
    setValue?: any;
  };
  required?: boolean;
  defaultValue?: any;
  readonly?: boolean;
  onChange?: (...args: any[]) => any;
  options?: Option[];
  value?: any;
  extraProps?: Record<string, any>;
  twHeight?: string;
} & MultiSelect &
  Multi;

export type { User, Post, PostPayload, InputProps, Option, Comments };

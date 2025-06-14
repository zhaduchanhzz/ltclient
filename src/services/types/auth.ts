export type LoginRequest = { username: string; password: string };

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expireTime: number;
  tokenType: string;
};

export type RegisterRequest = {
  username: string;
  password: string;
  phoneNumber?: string;
  address?: string;
  email: string;
  fullName?: string;
};

export type UserInfo = {
  id: string;
  username: string;
  password: string;
  phone: string;
  address: string;
  email: string;
  name: string;
  accountType: "FREE" | "VIP";
  examsTaken: number;
  expirationVipDate?: string;
  gradeRequest: number;
  createdAt: string;
};

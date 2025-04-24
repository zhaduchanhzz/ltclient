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
  username: string;
  password: string;
  phoneNumber: string;
  address: string;
  email: string;
  fullName: string;
};

export interface CreateUserDtoRequest {
  id?: number;
  fullName?: string;
  email?: string;
  address?: string;
  phoneNumber?: string;
  username: string;
  password: string;
  role?: string;
  gradeRequest?: number;
  expirationVipDate?: string;
  isEnable?: boolean;
}

export interface CreateUserDtoResponse {
  id: number;
  fullName?: string;
  email?: string;
  address?: string;
  phoneNumber?: string;
  username: string;
  password: string;
  role?: string;
  gradeRequest?: number;
  expirationVipDate?: string;
  isEnable?: boolean;
}

export interface UpdateUserProfileDtoRequest {
  id?: number;
  fullName?: string;
  email?: string;
  address?: string;
  phoneNumber?: string;
  username?: string;
  role?: string;
  gradeRequest?: number;
  expirationVipDate?: string;
  isEnable?: boolean;
}

export interface UserProfileDto {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  username: string;
  accountType?: string;
  gradeRequest?: number;
  expirationVipDate?: string;
  examsTaken?: number;
  createdDate?: string;
  role?: string;
  isEnable?: boolean;
  address?: string;
}

export interface PaginationResponseUserProfileDto {
  content: UserProfileDto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface AdminUsersQueryParams {
  page?: number;
  size?: number;
  keyword?: string;
  role?: string;
  isEnable?: boolean;
}
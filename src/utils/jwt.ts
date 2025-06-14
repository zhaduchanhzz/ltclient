import { jwtDecode } from "jwt-decode";

export const decodeToken = (token: string) => {
  return jwtDecode<{ id: string; exp: number }>(token);
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded.exp) return true;
    
    // exp is in seconds, Date.now() is in milliseconds
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    // If there's any error decoding the token, consider it expired
    return true;
  }
};

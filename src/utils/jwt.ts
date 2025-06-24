import { jwtDecode } from "jwt-decode";

export const decodeToken = (token: string) => {
  return jwtDecode<{ id: string; exp: number }>(token);
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded.exp) return true;

    // exp is in seconds, Date.now() is in milliseconds
    // Add 5 minute buffer to prevent premature expiration
    const currentTime = Date.now() / 1000;
    const bufferTime = 5 * 60; // 5 minutes in seconds
    return decoded.exp < currentTime + bufferTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

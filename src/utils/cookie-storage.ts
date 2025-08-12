import Cookies from "js-cookie";

class CookieStorage {
  set(key: string, value: string, options?: Cookies.CookieAttributes): void {
    // Check if we're in a secure context (HTTPS)
    const isSecureContext =
      typeof window !== "undefined" && window.location?.protocol === "https:";

    const defaultOptions: Cookies.CookieAttributes = {
      expires: 7, // 7 days
      // Only set secure flag if we're actually using HTTPS
      secure: isSecureContext,
      sameSite: isSecureContext ? "lax" : "lax",
      path: "/",
      // Add domain configuration if needed for cross-origin
      ...(process.env.NEXT_PUBLIC_COOKIE_DOMAIN && {
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
      }),
    };

    Cookies.set(key, value, { ...defaultOptions, ...options });
  }

  get(key: string): string | undefined {
    return Cookies.get(key);
  }

  remove(key: string): void {
    Cookies.remove(key, { path: "/" });
  }

  clear(): void {
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach((cookieName) => {
      this.remove(cookieName);
    });
  }

  // Specific method for storing boolean values
  setBoolean(
    key: string,
    value: boolean,
    options?: Cookies.CookieAttributes,
  ): void {
    this.set(key, value.toString(), options);
  }

  getBoolean(key: string): boolean | undefined {
    const value = this.get(key);
    if (value === undefined) return undefined;
    return value === "true";
  }
}

const CookieStorageInstance = new CookieStorage();
export default CookieStorageInstance;

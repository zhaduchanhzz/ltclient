import Cookies from "js-cookie";

class CookieStorage {
  set(key: string, value: string, options?: Cookies.CookieAttributes): void {
    const defaultOptions: Cookies.CookieAttributes = {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
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
  setBoolean(key: string, value: boolean, options?: Cookies.CookieAttributes): void {
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
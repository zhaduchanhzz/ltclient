class LocalStorageFunction {
  private isClient = typeof window !== "undefined";

  public get(key: string, fallback: any = null) {
    if (!this.isClient) return fallback;

    try {
      const item = window.localStorage.getItem(key);
      return item;
    } catch (error) {
      console.log(error);
      return fallback;
    }
  }

  public set(key: string, value: object | string, callback?: () => void) {
    if (!this.isClient) return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));

      if (callback) {
        callback();
      }
    } catch (error) {
      console.log(error);
    }
  }

  public remove(key: string, callback?: () => void) {
    if (!this.isClient) return;

    try {
      window.localStorage.removeItem(key);

      if (callback) {
        callback();
      }
    } catch (error) {
      console.log(error);
    }
  }
}

const LocalStorage = new LocalStorageFunction();
export default LocalStorage;

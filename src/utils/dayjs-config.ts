// dayjsConfig.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Mở rộng dayjs với các plugin
dayjs.extend(utc);
dayjs.extend(timezone);

// Thiết lập múi giờ mặc định
const DEFAULT_TIMEZONE = "Asia/Ho_Chi_Minh";
dayjs.tz.setDefault(DEFAULT_TIMEZONE);

const customDayjs = (date?: dayjs.ConfigType) =>
  dayjs.tz(date, DEFAULT_TIMEZONE);

export default customDayjs;

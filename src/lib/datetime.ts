import { formatInTimeZone } from "date-fns-tz";
import { format as formatLocal } from "date-fns";

export const TIME_FORMATS = {
  SUPABASE_DATETIME: "yyyy-MM-dd HH:mm:ss.SSS",
  SUPABASE_DATE: "yyyy-MM-dd",
  DISPLAY_DATE: "dd/MM/yyyy",
};

export const formatUTCDate = (
  zonedDate: Date | string,
  formatStr: string = TIME_FORMATS.SUPABASE_DATETIME,
): string => {
  const d = new Date(zonedDate);
  const formatted = formatInTimeZone(d, "UTC", formatStr);
  return formatted;
};

export const formatLocalDate = (
  utcDate: Date | string,
  formatStr: string = TIME_FORMATS.SUPABASE_DATETIME,
): string => {
  const d = new Date(utcDate);
  const formatted = formatLocal(d, formatStr);
  return formatted;
};

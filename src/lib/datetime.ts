import { formatInTimeZone } from "date-fns-tz";

export const TIME_FORMATS = {
  SUPABASE_DATETIME: "yyyy-MM-dd HH:mm:ss.SSS",
  SUPABASE_DATE: "yyyy-MM-dd",
  DISPLAY_DATE: "dd/MM/yyyy",
};

export const formatUTCDate = (
  zonedDate: Date | string,
  format: string = TIME_FORMATS.SUPABASE_DATETIME,
): string => {
  const d = new Date(zonedDate);
  const formatted = formatInTimeZone(d, "UTC", format);
  return formatted;
};

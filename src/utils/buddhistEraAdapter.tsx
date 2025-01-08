import "dayjs/locale/th";
import Dayjs, { Dayjs as DayjsType } from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

Dayjs.extend(buddhistEra);

interface buddhistEraAdapterOptions {
  locale?: string;
  formats?: Record<string, string>;
}

export default class buddhistEraAdapter extends AdapterDayjs {
  constructor({ locale, formats }: buddhistEraAdapterOptions) {
    super({ locale, formats });
  }

  formatByString = (date: DayjsType, format: string): string => {
    const newFormat = format.replace(/\bYYYY\b/g, "BBBB");
    return this.dayjs(date).format(newFormat);
  };
}
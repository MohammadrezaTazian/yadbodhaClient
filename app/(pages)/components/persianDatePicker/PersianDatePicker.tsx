import dateFnsGenerateConfig from '../rc-picker/dateFnsJalali';
import generatePicker from 'antd/es/date-picker/generatePicker';
import 'antd/es/date-picker/style/index';
import { newDate, format } from 'date-fns-jalali';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import './PersianDatePicker.css';
const DatePicker = generatePicker<Date>(dateFnsGenerateConfig);

export const parseJalaliToDate = (jalaliDate: string | null) => {
  if (jalaliDate === null) return null;
  const jalaliArray = jalaliDate.split('/');
  const jalaliYear = parseInt(jalaliArray[0]);
  const jalaliMonth = parseInt(jalaliArray[1]);
  const jalaliDay = parseInt(jalaliArray[2]);
  return newDate(jalaliYear, jalaliMonth - 1, jalaliDay);
};

export const parseJalaliToMonth = (jalaliDate: string | null) => {
  if (jalaliDate === null) return null;
  const jalaliArray = jalaliDate.split('/');
  const jalaliYear = parseInt(jalaliArray[0]);
  const jalaliMonth = parseInt(jalaliArray[1]);
  return newDate(jalaliYear, jalaliMonth - 1, 1);
};

export const parseDateToJalali = (value: Date | null) => {
  if (value === null) return null;
  return format(value, 'yyyy/MM/dd');
};
export const parseMonthToJalali = (value: Date | null) => {
  if (value === null) return null;
  return format(value, 'yyyy/MM');
};

type Props = {
  value?: string | null;
  onChange?: (value: string | null) => void;
  allowClear?: boolean;
  picker?: 'date' | 'week' | 'month' | 'quarter' | 'year';
  className?: string;
  style?: React.CSSProperties;
  size?: SizeType;
  disabled?: boolean;
  disabledDate?: (date: Date) => boolean;
  clearIcon?: boolean;
  minDate?: Date;
};

const PersianDatePicker = ({ value, onChange, allowClear, picker, className, style, disabled, clearIcon, size, disabledDate, minDate }: Props) => {
  const handleChange = (date: Date, dateString: string | string[]) => {
    if (onChange && typeof dateString === 'string') {
      onChange(dateString);
    }
  };
  return (
    <DatePicker
      className={`${className} custom-placeholder`}
      picker={picker ? picker : 'date'}
      allowClear={allowClear}
      format={picker === 'date' ? 'YYYY/MM/DD' : picker === 'month' ? 'YYYY/MM' : picker === 'year' ? 'YYYY' : 'YYYY/MM/DD'}
      clearIcon={clearIcon}
      disabled={disabled}
      disabledDate={disabledDate}
      size={size}
      value={
        value === undefined
          ? undefined
          : value === null
          ? null
          : value === ''
          ? null
          : picker === 'date'
          ? parseJalaliToDate(value!)
          : picker === 'month'
          ? parseJalaliToMonth(value!)
          : parseJalaliToDate(value!)
      }
      onChange={handleChange}
      minDate={minDate}
    />
  );
};
export default PersianDatePicker;

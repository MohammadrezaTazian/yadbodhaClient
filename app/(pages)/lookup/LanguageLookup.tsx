'use client';
import { errorByMessage } from '@/app/helper/ErrorHandler';
import { LookupModel } from '@/app/models/shared/LookupModel';
import { lookupServices } from '@/app/services/lookupServices';
import { Select } from 'antd';
import React from 'react';
import './lookup.css';

type Props = {
  id?: string;
  allowClear?: boolean;
  showSearch?: boolean;
  value?: string | number | null;
  style?: React.CSSProperties;
  onChange?: (value: string | number | null) => void;
  onChangeText?: (Text: string | null) => void;
};
const LanguageLookup = (props: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [items, setItems] = React.useState<LookupModel[] | null>([]);
  const getLanguageList = async () => {
    setIsLoading(true);
    try {
      const result: LookupModel[] | null = await lookupServices.getLanguageList();
      if (result) {
        setItems([...result]);
        if (!result.find((item) => item.code === props.value?.toString())) {
          handleChange(props.value);
          if (props.onChange) props.onChange(null);
          if (props.onChangeText) props.onChangeText(null);
        }
      } else {
        setItems(null);
      }
    } catch (error) {
      errorByMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const initialLookup = async () => {
    await getLanguageList();
  };

  React.useEffect(() => {
    initialLookup();
  }, []);

  const handleChange = (value: string | number | null | undefined) => {
    if (props.onChange) {
      value && props.onChange(value.toString());
    }
    if (props.onChangeText && items) {
      const selectItem = items.find((item) => item.code == value);
      if (selectItem) props.onChangeText(selectItem.name);
      else props.onChangeText(null);
    }
  };

  return (
    <span id={props.id}>
      <Select
        loading={isLoading}
        value={props.value?.toString()}
        onChange={handleChange}
        allowClear={props.allowClear ?? true}
        showSearch={props.showSearch ?? true}
        optionFilterProp="label"
        filterOption={(input, option) => (option?.label as string).toLowerCase().includes(input.toLowerCase())}
        placeholder="زبان برای اشعار را انتخاب کنید"
        dropdownRender={(menu) => <div className="custom-dropdown">{menu}</div>}
      >
        {items &&
          items.map((item) => (
            <Select.Option key={item.code} label={item.name} value={item.code}>
              {item.name}
            </Select.Option>
          ))}
      </Select>
    </span>
  );
};

export default LanguageLookup;

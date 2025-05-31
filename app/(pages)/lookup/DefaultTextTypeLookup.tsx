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
  value?: number | string | null;
  style?: React.CSSProperties;
  onChange?: (value: string | number | null) => void;
  onChangeText?: (Text: string | null) => void;
  languageId: number | null | undefined;
};
const DefaultTextTypeLookup = (props: Props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [items, setItems] = React.useState<LookupModel[] | null>([]);
  const getDefaultTextTypeList = async () => {
    setIsLoading(true);
    try {
      const result: LookupModel[] | null = await lookupServices.getDefaultTextTypeList(props.languageId!);
      if (result) {
        setItems([...result]);
        if (!result.find((item) => item.code?.toString() === props.value?.toString())) {
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
    await getDefaultTextTypeList();
  };

  React.useEffect(() => {
    initialLookup();
  }, [props.languageId]);

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
        placeholder="نوع متون پیش فرض را انتخاب کنید"
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

export default DefaultTextTypeLookup;

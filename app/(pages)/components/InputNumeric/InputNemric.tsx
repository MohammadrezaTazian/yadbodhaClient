import React from 'react';
import { Input } from 'antd';
import type { InputRef, InputProps } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';

type Props = {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  size?: SizeType;
  maxLength?: number;
  prefix?: any;
  suffix?:any;

};

const InputNemric = React.forwardRef<InputRef, Props>(({ value, onChange, placeholder, className, style, size, maxLength, prefix , suffix}, ref) => (
  <Input
    size={size}
    placeholder={placeholder}
    className={className}
    style={style}
    value={value}
    onChange={onChange}
    ref={ref}
    maxLength={maxLength}
    prefix={prefix}
    suffix={suffix}

    onKeyDown={(e) => {
      if ('0123456789'.indexOf(e.key) === -1 && e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'Enter' && !e.ctrlKey) {
        e.preventDefault();
      }
    }}
  />
));

export default InputNemric;

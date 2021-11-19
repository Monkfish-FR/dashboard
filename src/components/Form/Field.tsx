import React from 'react';

import Input from './Input';
import Select from './Select';
import TextArea from './TextArea';

import { FieldUI } from './interfaces';

export default function Field(props: FieldUI) {
  const {
    label,
    name,
    type,
    value,
    options,
    children,
    onChange,
  } = props;

  /**
   * Render the field according its type
   * (input[text], input[email], select…)
   */
  const renderSwitch = (fieldType: string) => {
    switch (fieldType) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <Input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
          />
        );
      case 'list':
        return (
          <Input
            type="list"
            name={name}
            value={value}
            options={options}
            onChange={onChange}
          />
        );
      case 'select':
        return (
          <Select
            name={name}
            value={value}
            options={options}
            onChange={onChange}
          />
        );
      case 'textarea':
        return (
          <TextArea
            name={name}
            value={typeof value === 'number' ? `${value}` : value}
            onChange={onChange}
          />
        );
      default:
        return (
          <Input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
          />
        );
    }
  };

  return (
    <fieldset>
      <label htmlFor={name}>
        {`${label}:`}

        {renderSwitch(type)}

        {children}
      </label>
    </fieldset>
  );
}

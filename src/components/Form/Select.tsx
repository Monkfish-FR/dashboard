import React from 'react';

import { SelectUI } from './interfaces';

export default function Select(props: SelectUI) {
  const {
    name,
    value,
    options,
    choose,
    onChange,
  } = props;

  const defaultValue = value || value === 0
    ? value
    : '_none';

  return (
    <select
      id={name}
      name={name}
      value={defaultValue}
      onChange={onChange}
    >
      <option value="_none" hidden disabled>
        {choose || 'Select an option'}
      </option>

      {options && options.map(({ key, label }) => (
        <option
          key={key}
          value={key}
        >
          {label ?? key}
        </option>
      ))}
    </select>
  );
}

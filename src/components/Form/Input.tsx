import React from 'react';

import { InputUI } from './interfaces';

export default function Input(props: InputUI) {
  const {
    name,
    type,
    value,
    options,
    onChange,
  } = props;

  let defaultValue = !value || value === 0 ? '' : value;

  if (type === 'list' && options && value) {
    const option = options.find(({ key }) => key === value);

    if (option) {
      defaultValue = `${option.key}: ${option.label}`;
    }
  }

  const input = type === 'list'
    ? (
      <>
        <input
          type="text"
          name={name}
          list={name}
          value={defaultValue}
          onChange={onChange}
        />
        <span />
        <datalist id={name}>
          {options && options.map(({ key, label }) => (
            <option
              key={key}
              value={`${key}: ${label}`}
              label={label}
            />
          ))}
        </datalist>
      </>
    )
    : (
      <input
        type={type}
        id={name}
        name={name}
        value={defaultValue}
        onChange={onChange}
      />
    );

  return input;
}

import React from 'react';

import { TextAreaUI } from './interfaces';

export default function TextArea(props: TextAreaUI) {
  const {
    name,
    value,
    onChange,
  } = props;

  const defaultValue = !value ? '' : value;

  return (
    <textarea
      id={name}
      name={name}
      value={defaultValue}
      onChange={onChange}
    />
  );
}

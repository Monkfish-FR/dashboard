import React from 'react';

import { ButtonUI } from './interfaces';

export default function Button(props: ButtonUI) {
  const {
    type,
    op,
    icon,
    children,
    className,
    disabled,
    title,
    style,
    onClick,
  } = props;

  const classes = [
    'btn',
    `btn-${type}`,
    `btn-${op}`,
  ];

  if (className) classes.push(className);

  const value = type === 'icon'
    ? <span className={`icon icon-${icon}`} />
    : children;

  return (
    <button
      type="button"
      className={classes.join(' ')}
      onClick={onClick}
      disabled={disabled}
      title={title || ''}
      style={style}
    >
      {value}
    </button>
  );
}

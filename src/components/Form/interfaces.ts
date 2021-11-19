import {
  ChangeEventHandler,
  CSSProperties,
  MouseEventHandler,
  ReactNode,
} from 'react';

export interface FieldUI {
  label: string,
  name: string,
  type: string,
  value: string | number | null,
  options?: OptionUI[],
  children?: ReactNode,
  onChange: ChangeEventHandler<HTMLElement>,
}

export interface InputUI {
  name: string,
  type: string,
  value: string | number | null,
  options?: OptionUI[],
  onChange: ChangeEventHandler<HTMLInputElement>,
}

export interface SelectUI {
  name: string,
  value: string | number | null,
  options?: OptionUI[],
  choose?: string,
  onChange: ChangeEventHandler<HTMLSelectElement>,
}

export interface OptionUI {
  key: string | number,
  label?: string,
}

export interface TextAreaUI {
  name: string,
  value: string | null,
  onChange: ChangeEventHandler<HTMLTextAreaElement>,
}

export interface ButtonUI {
  type: string,
  op: string,
  icon?: string,
  children?: ReactNode,
  className?: string | null,
  disabled?: boolean,
  title?: string | null,
  style?: CSSProperties | undefined;
  onClick: MouseEventHandler<HTMLButtonElement>,
}

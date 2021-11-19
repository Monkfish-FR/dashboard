import { ReactNode } from 'react';

export interface FlashMessageUI {
  content: ReactNode,
  status: string,
}

export interface MessageUI {
  children: ReactNode,
  status: string,
}

import { RouteComponentProps } from 'react-router-dom';

import { ClientUI } from '../Clients/interfaces';
import { QuotationUI } from '../Quotations/interfaces';

export interface InvoiceUI {
  id: number,
  number: string,
  status: number,
  amount: number,
  discount: string | null,
  comment: string | null,
  client: number,
  clientData: ClientUI,
  quotation: number,
  quotationData: QuotationUI,
  depositData: InvoiceDepositUI,
  createdAt?: Date,
  [key: string]: any,
}

export interface InvoiceDepositUI {
  id: number | null,
  number: string | null,
  amount: number | null,
  createdAt: Date | null,
}

export interface InvoiceAddUI {
  number: string,
  type: string,
  amount: number,
  client: number,
  quotation: number,
}

export interface InvoiceDiscountUI {
  description: {
    title: string,
    content: string,
  },
  rate: number,
}

export interface InvoiceFormUI {
  invoice: number,
  reloadInvoices: Function,
}

export interface InvoicesListUI {
  invoices: InvoiceUI[],
  handleInvoiceDelete: (id: number) => void,
}

export interface InvoicesListRowUI {
  invoice: InvoiceUI,
  handleInvoiceDelete: (id: number) => void,
}

// If you modify these props,
// don't forget to forward the changes
// to the `/routes/index.ts` file.
export interface InvoicesProps extends RouteComponentProps { }

export interface InvoicesState {
  invoice: number,
  invoices: InvoiceUI[],
  loading: boolean,
  viewer: InvoiceUI | null,
  filters: {
    client: number | string | null,
    status: number | string | null,
  },
}

export interface InvoiceFormDiscountProps {
  discount: string | null,
  cb: Function,
}

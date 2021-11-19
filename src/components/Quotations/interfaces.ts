import { ClientUI } from '../Clients/interfaces';

export interface QuotationUI {
  id: number,
  number: string,
  project: string,
  work: string | null,
  subtitle: string | null,
  amount: number,
  items: string,
  comment: string | null,
  status: number,
  client: number,
  clientData: ClientUI,
  depositData: QuotationDepositUI,
  active: number,
  createdAt?: Date,
}

export interface QuotationDepositUI {
  id: number | null,
  number: string | null,
  amount: number | null,
}

export interface QuotationItemUI {
  description: {
    title: string,
    content: string,
  },
  quantity: number,
  price: number,
}

export interface QuotationFormUI {
  quotation: number,
  reloadQuotations: Function,
}

export interface QuotationsListUI {
  quotations: QuotationUI[],
  handleQuotationDelete: (id: number) => void,
}

export interface QuotationsListRowUI {
  quotation: QuotationUI,
  handleQuotationDelete: (id: number) => void,
}

// If you modify these props,
// don't forget to forward the changes
// to the `/routes/index.ts` file.
export interface QuotationsProps { }

export interface QuotationsState {
  quotation: number,
  quotations: QuotationUI[],
  loading: boolean,
  viewer: QuotationUI | null,
  filters: {
    client: number | string | null,
    status: number | string | null,
  },
}

export interface QuotationsFormItemsProps {
  items: string,
  cb: Function,
}

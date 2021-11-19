import { InvoiceDiscountUI, InvoiceUI } from './interfaces';
import { clientDefault } from '../Clients/defaultState';
import { quotationDefault } from '../Quotations/defaultState';

export const invoiceDefault: InvoiceUI = {
  id: 0,
  number: '',
  status: 0,
  amount: 0,
  discount: null,
  comment: null,
  client: 0,
  clientData: {
    ...clientDefault,
  },
  quotation: 0,
  quotationData: {
    ...quotationDefault,
  },
  depositData: {
    id: null,
    number: null,
    amount: null,
    createdAt: null,
  },
};

export const invoiceDiscountDefault: InvoiceDiscountUI = {
  description: {
    title: '',
    content: '',
  },
  rate: 0,
};

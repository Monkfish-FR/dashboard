import { QuotationItemUI, QuotationUI } from './interfaces';
import { clientDefault } from '../Clients/defaultState';

export const quotationDefault: QuotationUI = {
  id: 0,
  number: '',
  project: '',
  work: null,
  subtitle: null,
  amount: 0,
  items: '',
  comment: null,
  status: 0,
  active: 1,
  client: 0,
  clientData: {
    ...clientDefault,
  },
  depositData: {
    id: null,
    number: null,
    amount: null,
  },
};

export const quotationItemDefault: QuotationItemUI = {
  description: {
    title: '',
    content: '',
  },
  quantity: 0,
  price: 0,
};

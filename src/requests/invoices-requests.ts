import * as requests from './index';

import { InvoiceAddUI, InvoiceUI } from '../components/Invoices/interfaces';

const TABLE_NAME = 'invoices';

export async function allInvoices(): Promise<InvoiceUI[]> {
  return requests.all(TABLE_NAME);
}

export async function someInvoices(where: { [key: string]: any }): Promise<InvoiceUI[]> {
  return requests.some(TABLE_NAME, where);
}

export async function getInvoice(id: number): Promise<InvoiceUI> {
  return requests.one(TABLE_NAME, id);
}

export async function lastInvoice(): Promise<InvoiceUI> {
  return requests.last(TABLE_NAME);
}

export async function lastInvoiceNumber(): Promise<string> {
  return lastInvoice()
    .then(({ number }) => number);
}

// Create an invoice by form
export async function addInvoice(
  data: InvoiceUI,
  apiMessage: string = '',
  apiError: any = null,
): Promise<string> {
  return requests.add(TABLE_NAME, { data, apiMessage, apiError });
}

// Create an invoice automatically (when a quotation is validated)
// @see `Quotation/index.tsx::createInvoice()`
export async function insertInvoice(
  data: InvoiceAddUI,
  apiMessage: string = '',
  apiError: any = null,
): Promise<string> {
  return requests.add(TABLE_NAME, { data, apiMessage, apiError });
}

export async function editInvoice(
  id: number,
  data: InvoiceUI,
  apiMessage: string = '',
  apiError: any = null,
): Promise<string> {
  return requests.edit(TABLE_NAME, {
    id,
    data,
    apiMessage,
    apiError,
  });
}

export async function validateInvoice(
  id: number,
  apiMessage: string = '',
  apiError: any = null,
): Promise<string> {
  return requests.validate(TABLE_NAME, {
    id,
    apiMessage,
    apiError,
  });
}

export async function deleteInvoice(
  id: number,
  apiMessage: string = '',
  apiError: any = null,
): Promise<string> {
  return requests.del(TABLE_NAME, {
    id,
    apiMessage,
    apiError,
  });
}

export async function resetInvoices(
  apiMessage: string = '',
  apiError: any = null,
): Promise<string> {
  return requests.reset(TABLE_NAME, {
    apiMessage,
    apiError,
  });
}

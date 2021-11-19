import * as requests from './index';

import { QuotationUI } from '../components/Quotations/interfaces';

const TABLE_NAME = 'quotations';

export async function allQuotations(): Promise<QuotationUI[]> {
  return requests.all(TABLE_NAME);
}

export async function getQuotation(id: number): Promise<QuotationUI> {
  return requests.one(TABLE_NAME, id);
}

export async function lastQuotation(): Promise<QuotationUI> {
  return requests.last(TABLE_NAME);
}

export async function lastQuotationNumber(): Promise<string> {
  return lastQuotation()
    .then(({ number }) => number);
}

export async function averageQuotations(): Promise<number> {
  return requests.average(TABLE_NAME)
    .then(({ avg }) => avg);
}

export async function medianQuotations(): Promise<number> {
  return requests.median(TABLE_NAME)
    .then(({ median }) => median);
}

export async function addQuotation(
  data: QuotationUI,
  apiMessage: string = '',
  apiError: any = null,
): Promise<string> {
  return requests.add(TABLE_NAME, { data, apiMessage, apiError });
}

export async function editQuotation(
  id: number,
  data: QuotationUI,
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

export async function validateQuotation(
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

export async function deactivateQuotation(
  id: number,
  apiMessage: string = '',
  apiError: any = null,
): Promise<string> {
  return requests.deactivate(TABLE_NAME, {
    id,
    apiMessage,
    apiError,
  });
}

export async function deleteQuotation(
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

export async function resetQuotations(
  apiMessage: string = '',
  apiError: any = null,
): Promise<string> {
  return requests.reset(TABLE_NAME, {
    apiMessage,
    apiError,
  });
}

import * as requests from './index';

import { PaymentUI } from '../components/Payments/interfaces';

const TABLE_NAME = 'payments';

export async function getPaymentByInvoice(invoice: number): Promise<PaymentUI[]> {
  return requests.some(TABLE_NAME, { invoice });
}

export async function addPayment(
  data: PaymentUI,
  apiMessage: string = '',
  apiError: any = null,
): Promise<string> {
  return requests.add(TABLE_NAME, { data, apiMessage, apiError });
}

import React, { useEffect, useState } from 'react';

import { PaymentUI } from './interfaces';
import { paymentDefault } from './defaultState';

import { getPaymentByInvoice } from '../../requests/payments-requests';

import { dateToLong } from '../../utils';

export default function PaymentsView(props: { invoice: number }) {
  const { invoice } = props;

  const [payment, setPayment] = useState<PaymentUI>(paymentDefault);

  useEffect(() => {
    getPaymentByInvoice(invoice)
      .then((response) => {
        setPayment(response[0]);
      })
      .catch((error) => {
        window.flashMessage({
          content: (
            <>
              <p>{`${`There was an error retrieving the payment for invoice ${invoice}:`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Reference</th>
          <th>Created at</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{payment.type}</td>
          <td>{payment.reference}</td>
          <td>
            {payment.createdAt
              ? dateToLong(new Date(payment.createdAt))
              : null}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

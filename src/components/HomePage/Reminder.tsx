import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { InvoiceUI } from '../Invoices/interfaces';
import { someInvoices } from '../../requests/invoices-requests';

import { numberToAmount } from '../../utils';

import { payment } from '../../settings.json';

export default function Reminder() {
  const [invoices, setInvoices] = useState<InvoiceUI[]>();

  useEffect(() => {
    // Don't forget the table alias in the column name
    someInvoices({ 'i.status': 0 })
      .then((response) => {
        const limit = new Date();
        limit.setMonth(limit.getMonth() - payment.paymentTerm);

        return response.filter(({ createdAt }) => (
          createdAt && new Date(createdAt) < limit
        ));
      })
      .then((response) => {
        setInvoices(response);
      })
      .catch((error) => {
        window.flashMessage({
          content: (
            <>
              <p>There was an error retrieving the pending invoices:</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }, []);

  function Card(props: { invoice: InvoiceUI }) {
    const { invoice } = props;
    const {
      id,
      number,
      amount,
      clientData,
      quotationData,
    } = invoice;

    return (
      <div className="card" key={number}>
        <p>
          {clientData.structureData.alias}
          <strong className="card__block">{number}</strong>
          <em className="card__block card__too-long">{quotationData.project}</em>
          <span className="card__big">
            {numberToAmount(amount)}
          </span>
        </p>

        <NavLink
          className="button-like btn btn-submit btn-delete"
          activeClassName="nav__link--active"
          to={`/invoices/?view=${id}`}
          exact
        >
          View this invoice
        </NavLink>
      </div>
    );
  }

  return (
    <div className="reminder cards">
      {invoices?.length
        ? invoices.map((invoice) => <Card key={invoice.number} invoice={invoice} />)
        : (
          <div className="card">
            <p>All invoices are paid on time!</p>
          </div>
        )}
    </div>
  );
}

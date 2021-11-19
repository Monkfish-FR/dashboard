import React, { Component } from 'react';

import InvoicesListRow from './List-row';
import { InvoiceUI, InvoicesListUI } from './interfaces';

class InvoicesList extends Component<InvoicesListUI> {
  invoices: InvoiceUI[];

  handleInvoiceDelete: (id: number) => void;

  constructor(props: InvoicesListUI) {
    super(props);

    this.invoices = props.invoices;
    this.handleInvoiceDelete = props.handleInvoiceDelete;
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th aria-label="id" className="is-narrow">#</th>
            <th aria-label="number">Number</th>
            <th aria-label="client">Client</th>
            <th aria-label="amount" className="t-center">Amount</th>
            <th aria-label="actions" className="is-actions" />
          </tr>
        </thead>

        <tbody>
          {this.invoices.length > 0
            ? (
              this.invoices.map((invoice: InvoiceUI) => (
                <InvoicesListRow
                  key={invoice.id}
                  invoice={invoice}
                  handleInvoiceDelete={this.handleInvoiceDelete}
                />
              ))
            )
            : (
              <tr>
                <td
                  style={{ textAlign: 'center' }}
                  colSpan={5}
                >
                  There are no invoices recorded in the database. Add one!
                </td>
              </tr>
            )}
        </tbody>
      </table>
    );
  }
}

export default InvoicesList;

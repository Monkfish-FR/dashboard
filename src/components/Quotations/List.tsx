import React, { Component } from 'react';

import QuotationsListRow from './List-row';
import { QuotationUI, QuotationsListUI } from './interfaces';

class QuotationsList extends Component<QuotationsListUI> {
  quotations: QuotationUI[];

  handleQuotationDelete: (id: number) => void;

  constructor(props: QuotationsListUI) {
    super(props);

    this.quotations = props.quotations;
    this.handleQuotationDelete = props.handleQuotationDelete;
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
          {this.quotations.length > 0
            ? (
              this.quotations.map((quotation: QuotationUI) => (
                <QuotationsListRow
                  key={quotation.id}
                  quotation={quotation}
                  handleQuotationDelete={this.handleQuotationDelete}
                />
              ))
            )
            : (
              <tr>
                <td
                  style={{ textAlign: 'center' }}
                  colSpan={5}
                >
                  There are no quotations recorded in the database. Add one!
                </td>
              </tr>
            )}
        </tbody>
      </table>
    );
  }
}

export default QuotationsList;

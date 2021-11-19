import React, { Component } from 'react';

import PaymentsForm from '../Payments/Form';
import PaymentsView from '../Payments/View';
import { Button } from '../Form';

import Bus from '../../utils/bus';

import { InvoicesListRowUI, InvoiceUI } from './interfaces';
import { QuotationItemUI } from '../Quotations/interfaces';

import { dateToLong, numberToAmount } from '../../utils';

class InvoicesListRow extends Component<InvoicesListRowUI> {
  invoice: InvoiceUI;

  handleInvoiceDelete: (id: number) => void;

  constructor(props: InvoicesListRowUI) {
    super(props);

    this.invoice = props.invoice;
    this.handleInvoiceDelete = props.handleInvoiceDelete;

    this.handleInvoiceEdit = this.handleInvoiceEdit.bind(this);
    this.handleInvoiceValidate = this.handleInvoiceValidate.bind(this);
    this.handleInvoiceView = this.handleInvoiceView.bind(this);
    this.handleDetailsView = this.handleDetailsView.bind(this);
  }

  handleInvoiceEdit() {
    const { id } = this.invoice;

    Bus.emit('invoice:edit', id);
  }

  handleInvoiceValidate() {
    const { id, status } = this.invoice;

    if (!status) {
      // Bus.emit('invoice:validate', id);
      const content = <PaymentsForm invoice={id} />;
      window.openModal({ content });
    } else {
      const content = <PaymentsView invoice={id} />;
      window.openModal({ content });
    }
  }

  handleInvoiceView() {
    Bus.emit('viewer:open', this.invoice);
  }

  handleDetailsView() {
    const itemsContent = this.getQuotationItems();
    const { discount, quotationData, depositData } = this.invoice;
    const { amount } = quotationData;

    const reduction = discount ? JSON.parse(discount) : null;

    if (itemsContent.length > 0) {
      const content = (
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit price</th>
            </tr>
          </thead>
          <tbody>
            {itemsContent.map((item: QuotationItemUI) => (
              <tr key={item.description.content}>
                <td>
                  <h2>{item.description.title}</h2>
                  <p>{item.description.content}</p>
                </td>
                <td>
                  {item.quantity > 0 ? item.quantity : ''}
                </td>
                <td>
                  {item.price > 0 ? item.price : ''}
                </td>
              </tr>
            ))}

            {reduction
              ? (
                <tr className="border-warning">
                  <td>
                    <h2>{reduction.description.title}</h2>
                    <p>{reduction.description.content}</p>
                  </td>
                  <td>1</td>
                  <td>
                    {`- ${amount * (reduction.rate / 100)}`}
                  </td>
                </tr>
              )
              : null}

            {depositData.createdAt
              ? (
                <tr className="border-success">
                  <td>
                    <h2>{`Acompte n° ${depositData.number}`}</h2>
                    <p>{`Facture d'acompte du ${dateToLong(new Date(depositData.createdAt))}`}</p>
                  </td>
                  <td>1</td>
                  <td>
                    {`- ${depositData.amount}`}
                  </td>
                </tr>
              )
              : null}
          </tbody>
        </table>
      );

      window.openModal({ content });
    }
  }

  getQuotationItems(): QuotationItemUI[] {
    const { items } = this.invoice.quotationData;
    return JSON.parse(items);
  }

  render() {
    const {
      id,
      number,
      type,
      amount: iAmount,
      status,
      discount,
      clientData,
      quotationData,
      depositData,
    } = this.invoice;

    const reduction = discount ? JSON.parse(discount) : null;

    const {
      project,
      work,
      amount: qAmount,
    } = quotationData;

    const amount = type === 'invoice' ? qAmount : iAmount;

    let name = project;
    if (work) name += ` – ${work}`;

    return (
      <tr>
        <td className="is-narrow">{id}</td>

        <td>
          <h2>{number}</h2>

          <Button
            type="icon"
            icon="checkmark"
            op={status ? 'success' : 'validate'}
            title={status ? 'See the payment data' : 'Mark as paid'}
            onClick={() => this.handleInvoiceValidate()}
          />
        </td>

        <td>
          {clientData.structureData.alias}
          <br />
          {clientData.email}
          <br />
          {type === 'deposit' ? <span className="color-warning">ACOMPTE - </span> : null}
          {depositData.id ? <span className="color-success">SOLDE - </span> : null}

          <span className="color-lighter">{name}</span>
        </td>

        <td className="t-center">
          {numberToAmount(amount)}
          <br />
          {reduction
            && (
              <strong className="bg-warning">{`- ${reduction.rate} %`}</strong>
            )}
          {depositData.amount
            && (
              <strong className="bg-success">{`- ${numberToAmount(depositData.amount)}`}</strong>
            )}

          <Button
            type="text"
            op="details"
            onClick={this.handleDetailsView}
          >
            <span className="color-lighter">&gt; Details</span>
          </Button>
        </td>

        <td className="is-action">
          <div className="buttons">
            <Button
              type="icon"
              icon="eye"
              op="view"
              title="View this invoice"
              onClick={() => this.handleInvoiceView()}
            />

            <Button
              type="icon"
              icon="pencil"
              op="edit"
              disabled={status === 1}
              title="Edit this invoice"
              onClick={() => this.handleInvoiceEdit()}
            />

            <Button
              type="icon"
              icon="bin"
              op="delete"
              title="Delete this invoice"
              onClick={() => this.handleInvoiceDelete(id)}
            />
          </div>
        </td>
      </tr>
    );
  }
}

export default InvoicesListRow;

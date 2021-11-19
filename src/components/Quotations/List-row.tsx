import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { Button } from '../Form';

import Bus from '../../utils/bus';
import { numberToAmount } from '../../utils';

import { QuotationItemUI, QuotationsListRowUI, QuotationUI } from './interfaces';

import { mentions } from '../../settings.json';

class QuotationsListRow extends Component<QuotationsListRowUI> {
  quotation: QuotationUI;

  handleQuotationDelete: (id: number) => void;

  constructor(props: QuotationsListRowUI) {
    super(props);

    this.quotation = props.quotation;
    this.handleQuotationDelete = props.handleQuotationDelete;

    this.handleQuotationEdit = this.handleQuotationEdit.bind(this);
    this.handleQuotationValidate = this.handleQuotationValidate.bind(this);
    this.handleQuotationDeactivate = this.handleQuotationDeactivate.bind(this);
    this.handleQuotationView = this.handleQuotationView.bind(this);
    this.handleDetailsView = this.handleDetailsView.bind(this);
  }

  handleQuotationEdit() {
    const { id } = this.quotation;

    Bus.emit('quotation:edit', id);
  }

  handleQuotationValidate() {
    const {
      id,
      amount,
      status,
      client,
      depositData,
    } = this.quotation;

    if (!status) {
      const total = depositData.amount
        ? amount - depositData.amount
        : amount;

      Bus.emit('quotation:validate', {
        id,
        client,
        amount: total,
      });
    }
  }

  handleDeposit() {
    const {
      id,
      amount,
      status,
      client,
    } = this.quotation;

    if (!status) {
      Bus.emit('quotation:deposit', {
        id,
        client,
        amount: amount * mentions.payment.rate,
      });
    }
  }

  handleQuotationDeactivate() {
    const { id } = this.quotation;

    Bus.emit('quotation:deactivate', id);
  }

  handleQuotationView() {
    Bus.emit('viewer:open', this.quotation);
  }

  handleDetailsView() {
    const itemsContent = this.getItems();

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
          </tbody>
        </table>
      );

      window.openModal({ content });
    }
  }

  getItems(): QuotationItemUI[] {
    const { items } = this.quotation;
    return JSON.parse(items);
  }

  render() {
    const {
      id,
      number,
      project,
      work,
      amount,
      status,
      active,
      clientData,
      depositData,
    } = this.quotation;

    let name = project;

    if (work) name += ` – ${work}`;

    return (
      <tr className={!active ? 'inactive' : ''}>
        <td className="is-narrow">{id}</td>

        <td>
          <h2>{number}</h2>

          <Button
            type="icon"
            icon="checkmark"
            op={status ? 'success' : 'validate'}
            disabled={active === 0}
            title="Edit the facture"
            onClick={() => this.handleQuotationValidate()}
          />

          {depositData.id
            && (
              <NavLink
                className="button-like btn btn-text"
                activeClassName="nav__link--active"
                to={`/invoices/?view=${depositData.id}`}
                style={{
                  color: '#fa0',
                  marginTop: '0.5rem',
                  padding: 0,
                  textAlign: 'left',
                }}
                exact
              >
                <span
                  className="icon-eye"
                  style={{
                    display: 'inline-block',
                    marginRight: '4px',
                    verticalAlign: 'middle',
                  }}
                />
                {depositData.number}
              </NavLink>
            )}

          {!depositData.id && amount > mentions.payment.limit
            ? (
              <Button
                type="text"
                op="deposit"
                style={{
                  color: '#fa0',
                  marginTop: '0.5rem',
                  padding: 0,
                }}
                onClick={() => this.handleDeposit()}
              >
                <span
                  className="icon-plus"
                  style={{
                    fontSize: '0.625em',
                    display: 'inline-block',
                    marginRight: '4px',
                    verticalAlign: 'middle',
                  }}
                />
                Deposit
              </Button>
            )
            : null}
        </td>

        <td>
          {clientData.structureData.alias}
          <br />
          {clientData.email}
          <br />
          <span className="color-lighter">{name}</span>
        </td>

        <td className="t-center">
          {numberToAmount(amount)}

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
              title="View this quotation"
              onClick={() => this.handleQuotationView()}
            />

            <Button
              type="icon"
              icon="pencil"
              op="edit"
              disabled={status === 1 || active === 0}
              title="Edit this quotation"
              onClick={() => this.handleQuotationEdit()}
            />

            <Button
              type="icon"
              icon="cross"
              op="delete"
              disabled={active === 0}
              title="Deactivate this quotation"
              onClick={() => this.handleQuotationDeactivate()}
            />
          </div>

          <Button
            type="text"
            op="reset"
            onClick={() => this.handleQuotationDelete(id)}
          >
            Delete
          </Button>
        </td>
      </tr>
    );
  }
}

export default QuotationsListRow;

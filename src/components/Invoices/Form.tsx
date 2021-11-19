import React, { ChangeEvent, Component } from 'react';

import InvoiceFormDiscount from './FormDiscount';

import Bus from '../../utils/bus';

import { Button, Field, Input } from '../Form';

import { InvoiceUI, InvoiceFormUI } from './interfaces';
import { invoiceDefault } from './defaultState';
import { OptionUI } from '../Form/interfaces';

import {
  addInvoice,
  editInvoice,
  getInvoice,
  lastInvoiceNumber,
} from '../../requests/invoices-requests';
import { allClients } from '../../requests/clients-requests';
import { allQuotations } from '../../requests/quotations-requests';

class InvoicesForm extends Component<InvoiceFormUI, InvoiceUI> {
  /**
   * Propose an invoice number based on the current month
   * and existing numbers
   */
  static proposeInvoiceNumber = async () => {
    const lastBill = await lastInvoiceNumber() || '0000-00';
    const [lastPrefix, lastNumber] = lastBill.split('-');

    const date = new Date();
    const yy = date.getFullYear().toString().substring(2);
    const month = date.getMonth() + 1;
    const mm = month < 10 ? `0${month}` : month;
    const prefix = `${yy}${mm}`;

    let currentNumber = '01';

    if (lastPrefix === prefix) {
      const nb = parseInt(lastNumber, 10) + 1;
      currentNumber = nb < 10 ? `0${nb}` : `${nb}`;
    }

    return `${prefix}-${currentNumber}`;
  }

  invoice: number;

  reloadInvoices: Function;

  clients: OptionUI[];

  quotations: OptionUI[];

  constructor(props: InvoiceFormUI) {
    super(props);

    this.reloadInvoices = props.reloadInvoices;
    this.invoice = props.invoice;

    this.state = { ...invoiceDefault };

    this.clients = [];
    this.quotations = [];

    this.fetchClients()
      .then((response) => {
        this.clients = response;
      });

    this.fetchQuotations()
      .then((response) => {
        this.quotations = response;
      });

    this.getInvoiceData = this.getInvoiceData.bind(this);
  }

  componentDidMount() {
    if (this.invoice > 0) {
      this.fetchInvoice(this.invoice);
    } else {
      InvoicesForm.proposeInvoiceNumber()
        .then((number) => {
          this.setState({ number });
        });
    }
  }

  handleDiscountAdd = () => {
    const { discount } = this.state;
    const form = (
      <InvoiceFormDiscount discount={discount} cb={this.addDiscount} />
    );

    window.openModal({ content: form });
  }

  handleSubmit = (event: any): void => {
    const {
      id,
      number,
      amount,
      quotation,
    } = this.state;

    event.preventDefault();

    if (
      number !== ''
      && amount !== 0
      && quotation !== 0
    ) {
      if (id > 0) {
        this.handleInvoiceSubmitEdit();
      } else {
        this.handleInvoiceSubmitAdd();
      }

      this.handleInputsReset();
      InvoicesForm.proposeInvoiceNumber();
    } else {
      // validation?
    }
  }

  handleReset = (event: any) => {
    event.preventDefault();

    Bus.emit('invoice:edit', 0);
  }

  handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ): void => {
    const state = { ...this.state };

    this.setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  }

  handleInvoiceSubmitAdd = () => {
    const data = this.getInvoiceData();

    addInvoice(data)
      .then((response) => {
        // Refresh the list
        this.reloadInvoices();

        return response;
      })
      .then((response) => {
        // Display a message
        window.flashMessage({
          content: <p>{response}</p>,
          status: 'success',
        });
      })
      .catch((error) => {
        window.flashMessage({
          content: (
            <>
              <p>{`${`There was an error creating the invoice ${data.number}:`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  handleInvoiceSubmitEdit = () => {
    const { id } = this.state;
    const data = this.getInvoiceData();

    editInvoice(id, data)
      .then((response) => {
        // Refresh the list
        this.reloadInvoices();

        return response;
      })
      .then((response) => {
        // Display a message
        window.flashMessage({
          content: <p>{response}</p>,
          status: 'success',
        });
      })
      .catch((error) => {
        window.flashMessage({
          content: (
            <>
              <p>{`${`There was an error updating the invoice ${id}:`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  handleInputsReset = () => {
    this.setState({ ...invoiceDefault });
  }

  getInvoiceData() {
    // The quotation can have `id: fullName` as format to display
    // a readable value for foreign key
    // @see `Form/Input` component (datalist option value)
    const {
      client,
      discount,
      quotation,
      quotationData,
    } = this.state;

    const [clientId] = client.toString().split(':');
    const [quotationId] = quotation.toString().split(':');

    const reduction = discount ? JSON.parse(discount) : null;

    const amount = reduction
      ? quotationData.amount * (1 - (reduction.rate / 100))
      : quotationData.amount;

    return {
      ...this.state,
      amount,
      discount: discount || null,
      client: parseInt(clientId, 10),
      quotation: parseInt(quotationId, 10),
    };
  }

  fetchInvoice = (id: number) => {
    getInvoice(id)
      .then((response) => {
        this.setState(response);
      })
      .catch((error) => {
        window.flashMessage({
          content: (
            <>
              <p>{`${`There was an error retrieving the invoice ${id}:`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  fetchClients = async () => {
    const clientsList = await allClients();

    return clientsList.map((client) => {
      const { id, firstName, lastName } = client;

      return {
        key: id,
        label: `${lastName} ${firstName}`,
      };
    });
  }

  fetchQuotations = async () => {
    const quotationsList = await allQuotations();

    return quotationsList.map((quotation) => {
      const { id, number } = quotation;

      return {
        key: id,
        label: number,
      };
    });
  }

  addDiscount = (discount: string): void => {
    this.setState({ discount });

    window.closeModal();
  }

  render() {
    const {
      id,
      number,
      amount,
      discount,
      comment,
      client,
      quotation,
    } = this.state;

    let formTitle = 'Create a invoice';
    let formSubmit = 'Add the invoice';

    if (id > 0) {
      formTitle = `Update the invoice #${id}`;
      formSubmit = 'Update the invoice';
    }

    return (
      <>
        <h3>{formTitle}</h3>

        <form onSubmit={this.handleSubmit}>
          <Input
            type="hidden"
            name="invoice"
            value={id}
            onChange={this.handleChange}
          />

          <div>
            <Field
              label="Enter number"
              name="number"
              type="text"
              value={number}
              onChange={this.handleChange}
            />

            <Field
              label="Choose a quotation"
              name="quotation"
              type="list"
              value={quotation}
              options={this.quotations}
              onChange={this.handleChange}
            />
          </div>

          <div>
            <Field
              label="Enter amount"
              name="amount"
              type="text"
              value={amount}
              onChange={this.handleChange}
            />

            <Field
              label="Choose a client"
              name="client"
              type="list"
              value={client}
              options={this.clients}
              onChange={this.handleChange}
            />
          </div>

          <div className="large">
            <Field
              label="Enter discount"
              name="discount"
              type="textarea"
              value={discount}
              onChange={this.handleChange}
            >
              <Button
                type="icon"
                icon="plus"
                op="success"
                className="small"
                onClick={() => this.handleDiscountAdd()}
              />
            </Field>
          </div>

          <div className="large">
            <Field
              label="Enter comment"
              name="comment"
              type="textarea"
              value={comment}
              onChange={this.handleChange}
            />
          </div>

          <Button
            type="submit"
            op="add"
            onClick={this.handleSubmit}
          >
            {formSubmit}
          </Button>

          <Button
            type="submit"
            op="cancel"
            onClick={this.handleReset}
          >
            Cancel
          </Button>
        </form>
      </>
    );
  }
}

export default InvoicesForm;

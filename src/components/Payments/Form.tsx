import React, { ChangeEvent, Component } from 'react';

import { Button, Field, Input } from '../Form';

import Bus from '../../utils/bus';

import { PaymentUI, PaymentFormUI } from './interfaces';
import { OptionUI } from '../Form/interfaces';
import { paymentDefault } from './defaultState';

import { addPayment } from '../../requests/payments-requests';

class PaymentsForm extends Component<PaymentFormUI, PaymentUI> {
  invoice: number;

  types: OptionUI[];

  constructor(props: PaymentFormUI) {
    super(props);

    this.invoice = props.invoice;

    this.types = [
      { key: 'transfer' },
      { key: 'check' },
    ];

    this.state = {
      ...paymentDefault,
      invoice: this.invoice,
    };
  }

  handleSubmit = (event: any): void => {
    const {
      type,
      reference,
    } = this.state;

    event.preventDefault();

    if (type !== '' && reference !== '') {
      const { invoice } = this.state;

      addPayment(this.state)
        .then((response) => {
          // Display a message
          window.flashMessage({
            content: <p>{response}</p>,
            status: 'success',
          });

          window.closeModal();

          Bus.emit('invoice:validate', invoice);
        })
        .catch((error) => {
          window.flashMessage({
            content: (
              <>
                <p>{`${`There was an error creating the payment for invoice ${invoice}:`}`}</p>
                <pre>{`${error}`}</pre>
              </>
            ),
            status: 'error',
          });
        });
    }

    this.handleInputsReset();
  }

  handleReset = (event: any) => {
    event.preventDefault();
    // eslint-disable-next-line no-console
    console.log('paymentForm:reset:49', this.state);
  }

  handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const state = { ...this.state };

    this.setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  }

  handleInputsReset = () => {
    this.setState({
      ...paymentDefault,
      invoice: this.invoice,
    });
  }

  render() {
    const {
      type,
      reference,
      invoice,
    } = this.state;

    return (
      <>
        <h3>Create a payment</h3>

        <form onSubmit={this.handleSubmit}>
          <Input
            type="hidden"
            name="invoice"
            value={invoice}
            onChange={this.handleChange}
          />

          <div>
            <Field
              label="Choose the payment method"
              name="type"
              type="select"
              value={type}
              options={this.types}
              onChange={this.handleChange}
            />
          </div>

          <div>
            <Field
              label="Enter reference"
              name="reference"
              type="text"
              value={reference}
              onChange={this.handleChange}
            />
          </div>

          <Button
            type="submit"
            op="add"
            onClick={this.handleSubmit}
          >
            Add the payment
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

export default PaymentsForm;

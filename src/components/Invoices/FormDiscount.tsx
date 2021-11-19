import React, { ChangeEvent, Component } from 'react';

import { Button, Field } from '../Form';

import { InvoiceFormDiscountProps, InvoiceDiscountUI } from './interfaces';
import { invoiceDiscountDefault } from './defaultState';

class QuotationsFormItems extends Component<InvoiceFormDiscountProps, InvoiceDiscountUI> {
  addDiscount: Function;

  constructor(props: InvoiceFormDiscountProps) {
    super(props);

    this.addDiscount = props.cb;

    this.state = props.discount
      ? JSON.parse(props.discount)
      : { ...invoiceDiscountDefault };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const state = { ...this.state };

    const fieldName = event.target.name;

    if (fieldName.includes('.')) {
      const [, property] = fieldName.split('.');

      this.setState((prevState) => ({
        ...state,
        description: {
          ...prevState.description,
          [property]: event.target.value,
        },
      }));
    } else {
      this.setState({
        ...state,
        [fieldName]: event.target.value,
      });
    }
  }

  handleSubmit = (event: any): void => {
    event.preventDefault();

    this.addDiscount(JSON.stringify(this.state));
  }

  render() {
    const {
      description,
      rate,
    } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <Field
            label="Enter title"
            name="description.title"
            type="text"
            value={description.title}
            onChange={this.handleChange}
          />
        </div>

        <div className="large">
          <Field
            label="Enter content"
            name="description.content"
            type="text"
            value={description.content}
            onChange={this.handleChange}
          />
        </div>

        <div>
          <Field
            label="Enter rate (in %)"
            name="rate"
            type="number"
            value={rate}
            onChange={this.handleChange}
          />
        </div>

        <Button
          type="submit"
          op="add"
          onClick={this.handleSubmit}
        >
          Add the discount
        </Button>
      </form>
    );
  }
}

export default QuotationsFormItems;

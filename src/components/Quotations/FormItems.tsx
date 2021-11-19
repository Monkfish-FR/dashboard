import React, { ChangeEvent, Component } from 'react';

import { Button, Field } from '../Form';

import { QuotationsFormItemsProps, QuotationItemUI } from './interfaces';
import { quotationItemDefault } from './defaultState';

class QuotationsFormItems extends Component<QuotationsFormItemsProps, QuotationItemUI> {
  items: QuotationItemUI[];

  addItem: Function;

  constructor(props: QuotationsFormItemsProps) {
    super(props);

    this.items = props.items !== '' ? JSON.parse(props.items) : [];
    this.addItem = props.cb;

    this.state = { ...quotationItemDefault };

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

  handleSubmit = (event: any, close: boolean = true): void => {
    event.preventDefault();

    this.items.push(this.state);
    this.addItem(JSON.stringify(this.items), close);

    this.setState({ ...quotationItemDefault });
  }

  render() {
    const {
      description,
      quantity,
      price,
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
            label="Enter description"
            name="description.content"
            type="textarea"
            value={description.content}
            onChange={this.handleChange}
          />
        </div>

        <div>
          <Field
            label="Enter quantity"
            name="quantity"
            type="number"
            value={quantity}
            onChange={this.handleChange}
          />

          <Field
            label="Enter unit price"
            name="price"
            type="number"
            value={price}
            onChange={this.handleChange}
          />
        </div>

        <Button
          type="submit"
          op="add"
          onClick={this.handleSubmit}
        >
          Add the item
        </Button>

        <Button
          type="submit"
          op="success"
          onClick={(e) => { this.handleSubmit(e, false); }}
        >
          Add this item and add another one
        </Button>
      </form>
    );
  }
}

export default QuotationsFormItems;

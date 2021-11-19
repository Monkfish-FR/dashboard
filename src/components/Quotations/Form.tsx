import React, { ChangeEvent, Component } from 'react';

import Bus from '../../utils/bus';

import QuotationsFormItems from './FormItems';
import { Button, Field, Input } from '../Form';

import { QuotationUI, QuotationFormUI, QuotationItemUI } from './interfaces';
import { quotationDefault } from './defaultState';
import {
  addQuotation,
  editQuotation,
  getQuotation,
  lastQuotationNumber,
} from '../../requests/quotations-requests';

import { allClients } from '../../requests/clients-requests';
import { OptionUI } from '../Form/interfaces';

class QuotationsForm extends Component<QuotationFormUI, QuotationUI> {
  quotation: number;

  reloadQuotations: Function;

  clients: OptionUI[];

  constructor(props: QuotationFormUI) {
    super(props);

    this.reloadQuotations = props.reloadQuotations;
    this.quotation = props.quotation;

    this.state = { ...quotationDefault };

    this.clients = [];

    this.fetchClients()
      .then((response) => {
        this.clients = response;
      });

    this.getQuotationData = this.getQuotationData.bind(this);
  }

  componentDidMount() {
    if (this.quotation > 0) {
      this.fetchQuotation(this.quotation);
    } else {
      this.proposeQuotationNumber();
    }
  }

  getAmount = () => {
    const { items } = this.state;
    const data = JSON.parse(items);

    return data.reduce((previous: number, current: QuotationItemUI) => (
      previous + (current.quantity * current.price)
    ), 0);
  }

  getQuotationData() {
    // The client can have `id: fullName` as format to display
    // a readable value for foreign key
    // @see `Form/Input` component (datalist option value)
    const { client } = this.state;
    const [clientId] = client.toString().split(':');

    const amount = this.getAmount();

    return {
      ...this.state,
      client: parseInt(clientId, 10),
      amount,
    };
  }

  handleItemsAdd = () => {
    const { items } = this.state;
    const form = (
      <QuotationsFormItems items={items} cb={this.addItem} />
    );

    window.openModal({ content: form });
  }

  handleSubmit = (event: any): void => {
    const {
      id,
      number,
      project,
      client,
    } = this.state;

    event.preventDefault();

    if (
      number !== ''
      && project !== ''
      && client !== 0
    ) {
      if (id > 0) {
        this.handleQuotationSubmitEdit();
      } else {
        this.handleQuotationSubmitAdd();
      }

      this.handleInputsReset();
      this.proposeQuotationNumber();
    } else {
      // validation?
    }
  }

  handleReset = (event: any) => {
    event.preventDefault();

    Bus.emit('quotation:edit', 0);
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

  handleQuotationSubmitAdd = () => {
    const data = this.getQuotationData();

    addQuotation(data)
      .then((response) => {
        // Refresh the list
        this.reloadQuotations();

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
              <p>{`${`There was an error creating the quotation ${data.number}:`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  handleQuotationSubmitEdit = () => {
    const { id } = this.state;
    const data = this.getQuotationData();

    editQuotation(id, data)
      .then((response) => {
        // Refresh the list
        this.reloadQuotations();

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
              <p>{`${`There was an error updating the quotation ${id}:`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  handleInputsReset = () => {
    this.setState({ ...quotationDefault });
  }

  fetchQuotation = (id: number) => {
    getQuotation(id)
      .then((response) => {
        this.setState(response);
      })
      .catch((error) => {
        window.flashMessage({
          content: (
            <>
              <p>{`${`There was an error retrieving the quotation ${id}:`}`}</p>
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

  proposeQuotationNumber = async () => {
    const lastQuote = await lastQuotationNumber() || '0000-00';
    const [lastPrefix, lastNumber] = lastQuote.split('-');

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

    this.setState({ number: `${prefix}-${currentNumber}` });
  }

  addItem = (items: string, close: boolean = true): void => {
    this.setState({ items });

    if (close) window.closeModal();
  }

  render() {
    const {
      id,
      number,
      project,
      work,
      subtitle,
      items,
      comment,
      client,
    } = this.state;

    let formTitle = 'Create a quotation';
    let formSubmit = 'Add the quotation';

    if (id > 0) {
      formTitle = `Update the quotation #${id}`;
      formSubmit = 'Update the quotation';
    }

    return (
      <>
        <h3>{formTitle}</h3>

        <form onSubmit={this.handleSubmit}>
          <Input
            type="hidden"
            name="quotation"
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
              label="Choose a client"
              name="client"
              type="list"
              value={client}
              options={this.clients}
              onChange={this.handleChange}
            />
          </div>

          <div>
            <Field
              label="Enter project"
              name="project"
              type="text"
              value={project}
              onChange={this.handleChange}
            />

            <Field
              label="Enter work"
              name="work"
              type="text"
              value={work}
              onChange={this.handleChange}
            />
          </div>

          <div className="large">
            <Field
              label="Enter subtitle"
              name="subtitle"
              type="textarea"
              value={subtitle}
              onChange={this.handleChange}
            />
          </div>

          <div className="x-large">
            <Field
              label="Enter items"
              name="items"
              type="textarea"
              value={items}
              onChange={this.handleChange}
            >
              <Button
                type="icon"
                icon="plus"
                op="success"
                className="small"
                onClick={() => this.handleItemsAdd()}
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

export default QuotationsForm;

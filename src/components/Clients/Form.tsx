import React, { ChangeEvent, Component } from 'react';

import { Button, Field, Input } from '../Form';
import Bus from '../../utils/bus';

import { ClientUI, ClientFormUI } from './interfaces';
import { clientDefault } from './defaultState';
import { addClient, editClient, getClient } from '../../requests/clients-requests';

import { allStructures } from '../../requests/structures-requests';
import { OptionUI } from '../Form/interfaces';

class ClientsForm extends Component<ClientFormUI, ClientUI> {
  client: number;

  reloadClients: Function;

  structures: OptionUI[];

  constructor(props: ClientFormUI) {
    super(props);

    this.reloadClients = props.reloadClients;
    this.client = props.client;

    this.state = { ...clientDefault };

    this.structures = [];

    this.getClientData = this.getClientData.bind(this);
  }

  componentDidMount() {
    if (this.client > 0) {
      this.fetchClient(this.client);
    }

    this.fetchStructures()
      .then((response) => {
        this.structures = response;
      });

    Bus.addListener('client:edit', this.handleClickOutside);
  }

  componentWillUnmount() {
    Bus.removeListener('client:edit', this.handleClickOutside);
  }

  getClientData() {
    // The structure can have `id: title` as format to display
    // a readable value for foreign key
    // @see `Form/Input` component (datalist option value)
    const { structure } = this.state;
    const [structureId] = structure.toString().split(':');

    return {
      ...this.state,
      structure: parseInt(structureId, 10),
    };
  }

  handleClickOutside = (id: number) => {
    this.fetchClient(id);
  }

  handleSubmit = (event: any): void => {
    const {
      id,
      firstName,
      lastName,
      email,
    } = this.state;

    if (
      firstName !== ''
      && lastName !== ''
      && email !== ''
    ) {
      event.preventDefault();

      if (id > 0) {
        this.handleClientSubmitEdit();
      } else {
        this.handleClientSubmitAdd();
      }

      this.handleInputsReset();
    } else {
      // validation?
    }
  }

  handleReset = (event: any) => {
    event.preventDefault();

    this.setState({ ...clientDefault });
  }

  handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const state = { ...this.state };

    this.setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  }

  handleClientSubmitAdd = () => {
    const data = this.getClientData();

    addClient(data)
      .then((response) => {
        // Refresh the list
        this.reloadClients();

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
              <p>{`${`There was an error creating the client ${data.email}:`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  handleClientSubmitEdit = () => {
    const { id } = this.state;
    const data = this.getClientData();

    editClient(id, data)
      .then((response) => {
        // Refresh the list
        this.reloadClients();

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
              <p>{`${`There was an error updating the client ${id}:`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  handleInputsReset = () => {
    this.setState({ ...clientDefault });
  }

  fetchClient = (id: number) => {
    getClient(id)
      .then((response) => {
        this.setState(response);
      })
      .catch((error) => {
        window.flashMessage({
          content: (
            <>
              <p>{`${`There was an error retrieving the client ${id}:`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  fetchStructures = async () => {
    const structuresList = await allStructures();

    return structuresList.map((structure) => {
      const { id, title, alias } = structure;

      return {
        key: id,
        label: `${title !== alias ? `${alias} – ${title}` : title}`,
      };
    });
  }

  render() {
    const {
      id,
      firstName,
      lastName,
      email,
      phone,
      structure,
    } = this.state;

    let formTitle = 'Create a client';
    let formSubmit = 'Add the client';

    if (id > 0) {
      formTitle = `Update the client #${id}`;
      formSubmit = 'Update the client';
    }

    return (
      <>
        <h3>{formTitle}</h3>

        <form onSubmit={this.handleSubmit}>
          <Input
            type="hidden"
            name="client"
            value={id}
            onChange={this.handleChange}
          />

          <div>
            <Field
              label="Enter firstname"
              name="firstName"
              type="text"
              value={firstName}
              onChange={this.handleChange}
            />

            <Field
              label="Enter lastname"
              name="lastName"
              type="text"
              value={lastName}
              onChange={this.handleChange}
            />
          </div>

          <div>
            <Field
              label="Enter email"
              name="email"
              type="email"
              value={email}
              onChange={this.handleChange}
            />

            <Field
              label="Enter phone"
              name="phone"
              type="text"
              value={phone}
              onChange={this.handleChange}
            />
          </div>

          <div>
            <Field
              label="Choose a structure"
              name="structure"
              type="list"
              value={structure}
              options={this.structures}
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

export default ClientsForm;

import React, { Component } from 'react';

import ClientsForm from './Form';
import ClientsList from './List';
import { Button } from '../Form';

import { ClientsProps, ClientsState } from './interfaces';
import { allClients, deleteClient, resetClients } from '../../requests/clients-requests';

class Clients extends Component<ClientsProps, ClientsState> {
  constructor(props: ClientsProps) {
    super(props);

    this.state = {
      client: 0,
      clients: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchClients();
  }

  handleClientDelete = (id: number) => {
    deleteClient(id)
      .then((response) => {
        // Refresh the list
        this.fetchClients();

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
              <p>{`${`There was an error deleting the client "${id}":`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  handleClientsReset = () => {
    resetClients()
      .then((response) => {
        // Refresh the list
        this.fetchClients();

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
              <p>There was an error resetting the clients table:</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  fetchClients = () => {
    allClients()
      .then((response) => {
        this.setState(() => ({
          loading: true,
        }));

        return response;
      })
      .then((clients) => {
        this.setState(() => ({
          clients,
          loading: false,
        }));
      })
      .catch((error) => {
        window.flashMessage({
          content: <p>{`There was an error retrieving the clients list: ${error}`}</p>,
          status: 'error',
        });
      });
  }

  render() {
    const {
      client,
      clients,
      loading,
    } = this.state;

    return (
      <div className="wrapper wrapper--cols-2 wrapper-client">
        <div className="wrapper__col wrapper__col--left">
          {/* Render client list component */}
          {loading && <p>Loading…</p>}
          {!loading
            && (
              <ClientsList
                clients={clients}
                handleClientDelete={this.handleClientDelete}
              />
            )}
        </div>

        <div className="wrapper__col wrapper__col--right">
          <div className="sticky">
            {/* Form for creating a client */}
            {client >= 0
              && (
                <ClientsForm
                  client={client}
                  reloadClients={this.fetchClients}
                />
              )}

            {/* Show reset button if necessary */}
            {clients.length > 0 && (
              <Button
                type="text"
                op="reset"
                onClick={this.handleClientsReset}
              >
                Delete all clients
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Clients;

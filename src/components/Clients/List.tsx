import React, { Component } from 'react';

import ClientsListRow from './List-row';
import { ClientUI, ClientsListUI } from './interfaces';

class ClientsList extends Component<ClientsListUI> {
  clients: ClientUI[];

  handleClientDelete: (id: number) => void;

  constructor(props: ClientsListUI) {
    super(props);

    this.clients = props.clients;
    this.handleClientDelete = props.handleClientDelete;
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th aria-label="id" className="is-narrow">#</th>
            <th aria-label="contact">Contact</th>
            <th aria-label="structure">Structure</th>
            <th aria-label="actions" className="is-actions" />
          </tr>
        </thead>

        <tbody>
          {this.clients.length > 0
            ? (
              this.clients.map((client: ClientUI) => (
                <ClientsListRow
                  key={client.id}
                  client={client}
                  handleClientDelete={this.handleClientDelete}
                />
              ))
            )
            : (
              <tr>
                <td
                  style={{ textAlign: 'center' }}
                  colSpan={5}
                >
                  There are no clients recorded in the database. Add one!
                </td>
              </tr>
            )}
        </tbody>
      </table>
    );
  }
}

export default ClientsList;

import React, { Component } from 'react';

import { Button } from '../Form';

import Bus from '../../utils/bus';

import { ClientsListRowUI, ClientUI } from './interfaces';

class ClientsListRow extends Component<ClientsListRowUI> {
  client: ClientUI;

  handleClientDelete: (id: number) => void;

  constructor(props: ClientsListRowUI) {
    super(props);

    this.client = props.client;
    this.handleClientDelete = props.handleClientDelete;

    this.handleClientEdit = this.handleClientEdit.bind(this);
  }

  handleClientEdit() {
    const { id } = this.client;
    Bus.emit('client:edit', id);
  }

  render() {
    const {
      id,
      firstName,
      lastName,
      email,
      phone,
      structureData,
    } = this.client;

    return (
      <tr>
        <td className="is-narrow">{id}</td>

        <td>
          <h2>{`${lastName} ${firstName}`}</h2>
          {email}
          <br />
          <span className="color-lighter">{phone}</span>
        </td>

        <td>
          {structureData.alias}
          <br />
          {`${structureData.address}, ${structureData.locality}`}
        </td>

        <td className="is-action">
          <div className="buttons">
            <Button
              type="icon"
              icon="pencil"
              op="edit"
              onClick={() => this.handleClientEdit()}
            />

            <Button
              type="icon"
              icon="bin"
              op="delete"
              onClick={() => this.handleClientDelete(id)}
            />
          </div>
        </td>
      </tr>
    );
  }
}

export default ClientsListRow;

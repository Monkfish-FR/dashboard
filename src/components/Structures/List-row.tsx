import React, { Component } from 'react';

import { Button } from '../Form';

import Bus from '../../utils/bus';

import { StructuresListRowUI, StructureUI } from './interfaces';

class StructuresListRow extends Component<StructuresListRowUI> {
  structure: StructureUI;

  handleStructureDelete: (id: number, title: string) => void;

  constructor(props: StructuresListRowUI) {
    super(props);

    this.structure = props.structure;
    this.handleStructureDelete = props.handleStructureDelete;

    this.handleStructureEdit = this.handleStructureEdit.bind(this);
  }

  handleStructureEdit() {
    const { id } = this.structure;
    Bus.emit('structure:edit', id);
  }

  render() {
    const {
      id,
      title,
      subtitle,
      siret,
      address,
      locality,
    } = this.structure;

    return (
      <tr>
        <td className="is-narrow">{id}</td>

        <td>
          <h2>{title}</h2>
          {subtitle}
          <br />
          <span className="color-lighter">{siret}</span>
        </td>

        <td>
          {address}
          <br />
          {locality}
        </td>

        <td className="is-action">
          <div className="buttons">
            <Button
              type="icon"
              icon="pencil"
              op="edit"
              onClick={() => this.handleStructureEdit()}
            />

            <Button
              type="icon"
              icon="bin"
              op="delete"
              onClick={() => this.handleStructureDelete(id, title)}
            />
          </div>
        </td>
      </tr>
    );
  }
}

export default StructuresListRow;

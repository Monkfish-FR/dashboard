import React, { Component } from 'react';

import StructuresListRow from './List-row';
import { StructureUI, StructuresListUI } from './interfaces';

class StructuresList extends Component<StructuresListUI> {
  structures: StructureUI[];

  handleStructureDelete: (id: number, title: string) => void;

  constructor(props: StructuresListUI) {
    super(props);

    this.structures = props.structures;
    this.handleStructureDelete = props.handleStructureDelete;
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th aria-label="id" className="is-narrow">#</th>
            <th aria-label="title">Title</th>
            <th aria-label="address">Address</th>
            <th aria-label="actions" className="is-actions" />
          </tr>
        </thead>

        <tbody>
          {this.structures.length > 0
            ? (
              this.structures.map((structure: StructureUI) => (
                <StructuresListRow
                  key={structure.id}
                  structure={structure}
                  handleStructureDelete={this.handleStructureDelete}
                />
              ))
            )
            : (
              <tr>
                <td
                  style={{ textAlign: 'center' }}
                  colSpan={5}
                >
                  There are no structures recorded in the database. Add one!
                </td>
              </tr>
            )}
        </tbody>
      </table>
    );
  }
}

export default StructuresList;

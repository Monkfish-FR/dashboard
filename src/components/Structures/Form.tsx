import React, { Component } from 'react';

import { Button, Field, Input } from '../Form';
import Bus from '../../utils/bus';

import { StructureUI, StructureFormUI } from './interfaces';
import { structureDefault } from './defaultState';
import { addStructure, editStructure, getStructure } from '../../requests/structures-requests';

class StructuresForm extends Component<StructureFormUI, StructureUI> {
  structure: number;

  reloadStructures: Function;

  constructor(props: StructureFormUI) {
    super(props);

    this.reloadStructures = props.reloadStructures;
    this.structure = props.structure;

    this.state = { ...structureDefault };
  }

  componentDidMount() {
    if (this.structure > 0) {
      this.fetchStructure(this.structure);
    }

    Bus.addListener('structure:edit', this.handleClickOutside);
  }

  componentWillUnmount() {
    Bus.removeListener('structure:edit', this.handleClickOutside);
  }

  handleClickOutside = (id: number) => {
    this.fetchStructure(id);
  }

  handleSubmit = (event: any): void => {
    const {
      id,
      title,
      subtitle,
      address,
      locality,
    } = this.state;

    if (
      title !== ''
      && subtitle !== ''
      && address !== ''
      && locality !== ''
    ) {
      event.preventDefault();

      if (id > 0) {
        this.handleStructureSubmitEdit();
      } else {
        this.handleStructureSubmitAdd();
      }

      this.handleInputsReset();
    } else {
      // validation?
    }
  }

  handleReset = (event: any) => {
    event.preventDefault();

    this.setState({ ...structureDefault });
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const state = { ...this.state };

    this.setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  }

  handleStructureSubmitAdd = () => {
    const { title, alias } = this.state;
    const forceAlias = alias || title;
    const data = {
      ...this.state,
      alias: forceAlias,
    };

    addStructure(data)
      .then((response) => {
        // Refresh the list
        this.reloadStructures();

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
              <p>{`${`There was an error creating the structure ${data.title}:`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  handleStructureSubmitEdit = () => {
    const { id } = this.state;
    const data = { ...this.state };

    editStructure(id, data)
      .then((response) => {
        // Refresh the list
        this.reloadStructures();

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
              <p>{`${`There was an error updating the structure ${id}:`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  handleInputsReset = () => {
    this.setState({ ...structureDefault });
  }

  fetchStructure = (id: number) => {
    getStructure(id)
      .then((response) => {
        this.setState(response);
      })
      .catch((error) => {
        window.flashMessage({
          content: (
            <>
              <p>{`${`There was an error retrieving the structure ${id}:`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  render() {
    const {
      id,
      title,
      subtitle,
      alias,
      siret,
      address,
      locality,
    } = this.state;

    let formTitle = 'Create a structure';
    let formSubmit = 'Add the structure';

    if (id > 0) {
      formTitle = `Update the structure #${id}`;
      formSubmit = 'Update the structure';
    }

    return (
      <>
        <h3>{formTitle}</h3>

        <form onSubmit={this.handleSubmit}>
          <Input
            type="hidden"
            name="structure"
            value={id}
            onChange={this.handleChange}
          />

          <div>
            <Field
              label="Enter title"
              name="title"
              type="text"
              value={title}
              onChange={this.handleChange}
            />

            <Field
              label="Enter alias"
              name="alias"
              type="text"
              value={alias}
              onChange={this.handleChange}
            />
          </div>

          <div>
            <Field
              label="Enter subtitle"
              name="subtitle"
              type="text"
              value={subtitle}
              onChange={this.handleChange}
            />

            <Field
              label="Enter siret"
              name="siret"
              type="text"
              value={siret}
              onChange={this.handleChange}
            />
          </div>

          <div>
            <Field
              label="Enter address"
              name="address"
              type="text"
              value={address}
              onChange={this.handleChange}
            />

            <Field
              label="Enter locality"
              name="locality"
              type="text"
              value={locality}
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

export default StructuresForm;

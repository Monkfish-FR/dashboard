import React, { Component } from 'react';

import StructuresForm from './Form';
import StructuresList from './List';
import { Button } from '../Form';

import { StructuresProps, StructuresState } from './interfaces';
import { allStructures, deleteStructure, resetStructures } from '../../requests/structures-requests';

class Structures extends Component<StructuresProps, StructuresState> {
  constructor(props: StructuresProps) {
    super(props);

    this.state = {
      structure: 0,
      structures: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchStructures();
  }

  handleStructureDelete = (id: number, title: string) => {
    deleteStructure(id)
      .then((response) => {
        // Refresh the list
        this.fetchStructures();

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
              <p>{`${`There was an error deleting the structure "${title}":`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  handleStructuresReset = () => {
    resetStructures()
      .then((response) => {
        // Refresh the list
        this.fetchStructures();

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
              <p>There was an error resetting the structures table:</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  fetchStructures = () => {
    allStructures()
      .then((response) => {
        this.setState(() => ({
          loading: true,
        }));

        return response;
      })
      .then((structures) => {
        this.setState(() => ({
          structures,
          loading: false,
        }));
      })
      .catch((error) => {
        window.flashMessage({
          content: <p>{`There was an error retrieving the structures list: ${error}`}</p>,
          status: 'error',
        });
      });
  }

  render() {
    const {
      structure,
      structures,
      loading,
    } = this.state;

    return (
      <div className="wrapper wrapper--cols-2 wrapper-structure">
        <div className="wrapper__col wrapper__col--left">
          {/* Render structure list component */}
          {loading && <p>Loading…</p>}
          {!loading
            && (
              <StructuresList
                structures={structures}
                handleStructureDelete={this.handleStructureDelete}
              />
            )}
        </div>

        <div className="wrapper__col wrapper__col--right">
          <div className="sticky">
            {/* Form for creating a structure */}
            {structure >= 0
              && (
                <StructuresForm
                  structure={structure}
                  reloadStructures={this.fetchStructures}
                />
              )}

            {/* Show reset button if necessary */}
            {structures.length > 0 && (
              <Button
                type="text"
                op="reset"
                onClick={this.handleStructuresReset}
              >
                Delete all structures
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Structures;

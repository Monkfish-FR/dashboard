import React, { Component } from 'react';

import Bus from '../../utils/bus';

import QuotationsForm from './Form';
import QuotationsList from './List';
import InvoicesForm from '../Invoices/Form';
import { Button, Select } from '../Form';
import Viewer from '../PDFTemplate';

import { QuotationsProps, QuotationsState, QuotationUI } from './interfaces';
import { OptionUI } from '../Form/interfaces';

import {
  allQuotations,
  deleteQuotation,
  resetQuotations,
  validateQuotation,
  deactivateQuotation,
} from '../../requests/quotations-requests';
import { insertInvoice } from '../../requests/invoices-requests';
import { allClients } from '../../requests/clients-requests';

class Quotations extends Component<QuotationsProps, QuotationsState> {
  quotations: QuotationUI[];

  clients: OptionUI[];

  statuses: OptionUI[];

  constructor(props: QuotationsProps) {
    super(props);

    this.state = {
      quotation: 0,
      quotations: [],
      loading: true,
      viewer: null,
      filters: {
        client: '_none',
        status: '_none',
      },
    };

    this.quotations = [];
    this.clients = [];
    this.statuses = [
      { key: '_none', label: '-- all --' },
      { key: 0, label: 'WIP' },
      { key: 1, label: 'Done' },
      { key: 99, label: 'Cancelled' },
    ];

    this.fetchClients()
      .then((response) => {
        const options = [
          { key: '_none', label: '-- all --' },
          ...response,
        ];
        this.clients = options;
      });
  }

  componentDidMount() {
    this.fetchQuotations();

    Bus.addListener('viewer:open', this.handleOpenPDF);
    Bus.addListener('viewer:close', this.handleClosePDF);

    Bus.addListener('quotation:edit', this.handleEditQuotation);
    Bus.addListener('quotation:validate', this.handleValidateQuotation);
    Bus.addListener('quotation:deposit', this.handleAcceptQuotation);
    Bus.addListener('quotation:deactivate', this.handleDeactivateQuotation);
  }

  componentWillUnmount() {
    Bus.removeListener('viewer:open', this.handleOpenPDF);
    Bus.removeListener('viewer:close', this.handleClosePDF);

    Bus.removeListener('quotation:edit', this.handleEditQuotation);
    Bus.removeListener('quotation:validate', this.handleValidateQuotation);
    Bus.removeListener('quotation:deposit', this.handleAcceptQuotation);
    Bus.removeListener('quotation:deactivate', this.handleDeactivateQuotation);
  }

  handleQuotationDelete = (id: number) => {
    this.setState({
      quotation: 0,
      viewer: null,
    });

    deleteQuotation(id)
      .then((response) => {
        // Refresh the list
        this.fetchQuotations();

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
              <p>{`${`There was an error deleting the quotation "${id}":`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  handleValidateQuotation = (
    { id, client, amount }: { id: number, client: number, amount: number },
  ) => {
    this.setState({
      quotation: 0,
      viewer: null,
    });

    this.createInvoice(id, client, amount)
      .then(() => {
        // Update the status of this quotation
        validateQuotation(id)
          .then((res) => {
            // Refresh the list
            this.fetchQuotations();

            return res;
          })
          .then((res) => {
            // Display a message
            window.flashMessage({
              content: <p>{res}</p>,
              status: 'success',
            });
          })
          .catch((error) => {
            window.flashMessage({
              content: (
                <>
                  <p>{`${`There was an error validating the quotation "${id}":`}`}</p>
                  <pre>{`${error}`}</pre>
                </>
              ),
              status: 'error',
            });
          });
      })
      .catch((error) => {
        window.flashMessage({
          content: (
            <>
              <p>{`${`There was an error validating the quotation "${id}":`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  handleAcceptQuotation = (
    { id, client, amount }: { id: number, client: number, amount: number },
  ) => {
    this.setState({
      quotation: 0,
      viewer: null,
    });

    this.createInvoice(id, client, amount, 'deposit')
      .then(() => {
        // Display a message
        window.flashMessage({
          content: <p>The deposit was created</p>,
          status: 'success',
        });
      })
      .catch((error) => {
        window.flashMessage({
          content: (
            <>
              <p>There was an error creating the deposit:</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  handleDeactivateQuotation = (id: number) => {
    this.setState({
      quotation: 0,
      viewer: null,
    });

    deactivateQuotation(id)
      .then((res) => {
        // Refresh the list
        this.fetchQuotations();

        return res;
      })
      .then((res) => {
        // Display a message
        window.flashMessage({
          content: <p>{res}</p>,
          status: 'success',
        });
      })
      .catch((error) => {
        window.flashMessage({
          content: (
            <>
              <p>{`${`There was an error validating the quotation "${id}":`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  handleQuotationsReset = () => {
    resetQuotations()
      .then((response) => {
        // Refresh the list
        this.fetchQuotations();

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
              <p>There was an error resetting the quotations table:</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  handleOpenPDF = (quotation: QuotationUI) => {
    this.setState({ viewer: quotation });
  }

  handleClosePDF = () => {
    this.setState({ viewer: null });
  }

  handleEditQuotation = (quotation: number) => {
    this.setState({
      quotation,
      viewer: null,
    });
  };

  handleFilterData = (value: string, on: string) => {
    const filter = new Promise<void>((resolve) => {
      const { filters } = this.state;
      const newValue = value === '_none' ? '_none' : parseInt(value, 10);

      const newFilters = {
        client: on === 'client' || on === 'reset' ? newValue : filters.client,
        status: on === 'status' || on === 'reset' ? newValue : filters.status,
      };

      this.setState(() => ({
        filters: newFilters,
        loading: true,
      }));

      resolve();
    });

    filter
      .then(() => {
        const quotations = this.filterQuotations();
        return quotations;
      })
      .then((quotations) => {
        this.setState(() => ({
          quotations,
          loading: false,
        }));
      });
  }

  fetchQuotations = () => {
    allQuotations()
      .then((response) => {
        this.setState(() => ({
          loading: true,
        }));

        return response;
      })
      .then((quotations) => {
        this.setState(() => ({
          quotations,
          loading: false,
        }));

        this.quotations = quotations;
      })
      .catch((error) => {
        window.flashMessage({
          content: <p>{`There was an error retrieving the quotations list: ${error}`}</p>,
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

  createInvoice = (
    quotation: number,
    client: number,
    amount: number,
    type = 'invoice',
  ) => InvoicesForm.proposeInvoiceNumber()
    .then((number) => insertInvoice({
      number,
      type,
      amount,
      client,
      quotation,
    }))
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
            <p>There was an error creating the invoice:</p>
            <pre>{`${error}`}</pre>
          </>
        ),
        status: 'error',
      });
    });

  filterQuotations = (): QuotationUI[] => {
    const { filters } = this.state;

    return this.quotations.filter(({ client, status, active }) => {
      if (filters.status === 99 && active) return false;

      if (filters.client !== '_none' && client !== filters.client) return false;

      if (filters.status !== '_none' && filters.status !== 99) {
        if (!active) return false;

        return status === filters.status;
      }

      return true;
    });
  }

  render() {
    const {
      quotation,
      quotations,
      loading,
      viewer,
      filters,
    } = this.state;

    return (
      <div className="wrapper wrapper--cols-2 wrapper-quotation">
        <div className="wrapper__col wrapper__col--left">
          <div className="wrapper__filters">
            Filter by:

            <Select
              name="filterClient"
              value={filters.client}
              options={this.clients}
              choose="Client"
              onChange={({ target }) => {
                this.handleFilterData(target.value, 'client');
              }}
            />

            <Select
              name="filterStatus"
              value={filters.status}
              options={this.statuses}
              choose="Status"
              onChange={({ target }) => {
                this.handleFilterData(target.value, 'status');
              }}
            />

            <Button
              type="text"
              op="filters"
              onClick={() => { this.handleFilterData('_none', 'reset'); }}
            >
              Reset
            </Button>
          </div>

          {/* Render quotation list component */}
          {loading && <p>Loading…</p>}
          {!loading
            && (
              <QuotationsList
                quotations={quotations}
                handleQuotationDelete={this.handleQuotationDelete}
              />
            )}
        </div>

        <div className="wrapper__col wrapper__col--right">
          <div className="sticky">
            {/* Form for creating a quotation */}
            {!viewer && quotation === 0
              && (
                <QuotationsForm
                  quotation={0}
                  reloadQuotations={this.fetchQuotations}
                />
              )}

            {/* Form for editing a quotation */}
            {!viewer && quotation > 0
              && (
                <QuotationsForm
                  quotation={quotation}
                  reloadQuotations={this.fetchQuotations}
                />
              )}

            {/* PDF Viewer */}
            {viewer
              && (
                <Viewer
                  type="devis"
                  data={viewer}
                  amount={viewer.amount}
                  close={this.handleClosePDF}
                />
              )}

            {/* Show reset button if necessary */}
            {quotations.length > 0 && (
              <Button
                type="text"
                op="reset"
                onClick={this.handleQuotationsReset}
              >
                Delete all quotations
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Quotations;

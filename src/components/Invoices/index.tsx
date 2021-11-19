import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';

import Bus from '../../utils/bus';

import InvoicesForm from './Form';
import InvoicesList from './List';
import { Button, Select } from '../Form';
import Viewer from '../PDFTemplate';

import {
  InvoicesProps,
  InvoicesState,
  InvoiceUI,
} from './interfaces';
import { OptionUI } from '../Form/interfaces';

import {
  allInvoices,
  deleteInvoice,
  resetInvoices,
  validateInvoice,
} from '../../requests/invoices-requests';
import { allClients } from '../../requests/clients-requests';

class Invoices extends Component<InvoicesProps, InvoicesState> {
  invoices: InvoiceUI[];

  clients: OptionUI[];

  statuses: OptionUI[];

  constructor(props: InvoicesProps) {
    super(props);

    this.state = {
      invoice: 0,
      invoices: [],
      loading: true,
      viewer: null,
      filters: {
        client: '_none',
        status: '_none',
      },
    };

    this.invoices = [];
    this.clients = [];
    this.statuses = [
      { key: '_none', label: '-- all --' },
      { key: 0, label: 'Pending' },
      { key: 1, label: 'Paid' },
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
    this.fetchInvoices()
      .then(() => {
        const { location } = this.props;
        const qs = new URLSearchParams(location.search);
        const viewId = qs.get('view');

        if (viewId) {
          const viewInvoice = this.invoices.find(({ id }) => (
            id === parseInt(viewId, 10)
          ));

          if (viewInvoice) this.handleOpenPDF(viewInvoice);
        }
      });

    Bus.addListener('viewer:open', this.handleOpenPDF);
    Bus.addListener('viewer:close', this.handleClosePDF);

    Bus.addListener('invoice:edit', this.handleEditInvoice);
    Bus.addListener('invoice:validate', this.handleValidateInvoice);
  }

  componentWillUnmount() {
    Bus.removeListener('viewer:open', this.handleOpenPDF);
    Bus.removeListener('viewer:close', this.handleClosePDF);

    Bus.removeListener('invoice:edit', this.handleEditInvoice);
    Bus.removeListener('invoice:validate', this.handleValidateInvoice);
  }

  handleInvoiceDelete = (id: number) => {
    this.setState({
      invoice: 0,
      viewer: null,
    });

    deleteInvoice(id)
      .then((response) => {
        // Refresh the list
        this.fetchInvoices();

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
              <p>{`${`There was an error deleting the invoice "${id}":`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  handleValidateInvoice = (id: number) => {
    this.setState({
      invoice: 0,
      viewer: null,
    });

    validateInvoice(id)
      .then((response) => {
        // Refresh the list
        this.fetchInvoices();

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
              <p>{`${`There was an error validating the invoice "${id}":`}`}</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  handleInvoicesReset = () => {
    resetInvoices()
      .then((response) => {
        // Refresh the list
        this.fetchInvoices();

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
              <p>There was an error resetting the invoices table:</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }

  handleOpenPDF = (invoice: InvoiceUI) => {
    this.setState({ viewer: invoice });
  }

  handleClosePDF = () => {
    this.setState({ viewer: null });
  }

  handleEditInvoice = (invoice: number) => {
    this.setState({ invoice: 0 }); // Re-render edit form

    setTimeout(() => {
      this.setState({
        invoice,
        viewer: null,
      });
    }, 50);
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
        const invoices = this.filterInvoices();
        return invoices;
      })
      .then((invoices) => {
        this.setState(() => ({
          invoices,
          loading: false,
        }));
      });
  }

  fetchInvoices = () => (
    allInvoices()
      .then((response) => {
        this.setState(() => ({
          invoice: 0,
          loading: true,
        }));

        return response;
      })
      .then((invoices) => {
        this.setState(() => ({
          invoices,
          loading: false,
        }));

        this.invoices = invoices;
        return invoices;
      })
      .catch((error) => {
        window.flashMessage({
          content: <p>{`There was an error retrieving the invoices list: ${error}`}</p>,
          status: 'error',
        });
      })
  )

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

  filterInvoices = (): InvoiceUI[] => {
    const { filters } = this.state;

    return this.invoices.filter(({ client, status }) => {
      if (filters.client !== '_none' && client !== filters.client) return false;

      if (filters.status !== '_none' && status !== filters.status) return false;

      return true;
    });
  }

  render() {
    const {
      invoice,
      invoices,
      loading,
      viewer,
      filters,
    } = this.state;

    return (
      <div className="wrapper wrapper--cols-2 wrapper-invoice">
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

          {/* Render invoice list component */}
          {loading && <p>Loading…</p>}
          {!loading
            && (
              <InvoicesList
                invoices={invoices}
                handleInvoiceDelete={this.handleInvoiceDelete}
              />
            )}
        </div>

        <div className="wrapper__col wrapper__col--right">
          <div className="sticky">
            {/* Form for creating a invoice */}
            {!viewer && invoice === 0
              && (
                // <InvoicesForm invoice={0} reloadInvoices={this.fetchInvoices} />
                <div className="no-results">
                  <p>The invoice must have a quotation to be edited.</p>

                  <NavLink
                    className="button-like btn btn-submit btn-add"
                    activeClassName="nav__link--active"
                    to="/quotations/"
                    exact
                  >
                    Go to the Quotations
                  </NavLink>
                </div>
              )}

            {/* Form for editing a invoice */}
            {!viewer && invoice > 0
              && (
                <InvoicesForm
                  invoice={invoice}
                  reloadInvoices={this.fetchInvoices}
                />
              )}

            {/* PDF Viewer */}
            {viewer
              && (
                <Viewer
                  type={viewer.type === 'invoice' ? 'facture' : "facture d'acompte"}
                  data={viewer}
                  amount={viewer.type === 'invoice'
                    ? viewer.quotationData.amount
                    : viewer.amount}
                  close={this.handleClosePDF}
                />
              )}

            {/* Show reset button if necessary */}
            {invoices.length > 0 && (
              <Button
                type="text"
                op="reset"
                onClick={this.handleInvoicesReset}
              >
                Delete all invoices
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Invoices);

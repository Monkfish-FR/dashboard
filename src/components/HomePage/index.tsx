import React, { useEffect, useState } from 'react';

import InvoicesChart from './InvoicesChart';
import Reporting from './Reporting';
import Reminder from './Reminder';
import QuotationsSummary from './QuotationsSummary';

import { TotalDataUI, TotalUI } from './interfaces';
import { totalByMonth } from '../../requests/home-requests';

import monthsList from './months.json';

import './HomePage.scss';

export default function HomePage() {
  const [invoices, setInvoices] = useState<TotalDataUI | null>(null);

  /**
   * Format data to corresponds to Chart data
   *
   * @param values Raw values (from DB)
   */
  function formatData(values: TotalUI[]): TotalDataUI {
    const years = Array.from(new Set(values.map(({ year }) => year)));

    const formattedData: TotalDataUI = {};
    years.forEach((year) => {
      formattedData[year] = [];

      const yearValues = values.filter((value: TotalUI) => value.year === year);

      monthsList.forEach(({ abbreviation, text }, index) => {
        const monthValues = yearValues.filter(({ month }) => month === text);
        const paid = monthValues.find(({ status }) => status)?.total || 0;
        const pending = monthValues.find(({ status }) => !status)?.total || 0;

        formattedData[year][index] = {
          month: abbreviation,
          paid,
          pending,
        };
      });
    });

    return formattedData;
  }

  useEffect(() => {
    totalByMonth()
      .then((response) => {
        setInvoices(formatData(response));
      })
      .catch((error) => {
        window.flashMessage({
          content: (
            <>
              <p>There was an error retrieving the total by month:</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }, []);

  return (
    <div className="homepage">
      {invoices
        && (
          <>
            <div className="container" id="invoicesChart">
              <h2>Invoices</h2>
              <InvoicesChart invoices={invoices} />
            </div>

            <div className="container" id="reporting">
              <h2>Reporting Income</h2>
              <Reporting invoices={invoices} />
            </div>
          </>
        )}

      <div className="container" id="reminder">
        <h2>Reminder</h2>
        <Reminder />
      </div>

      <div className="container" id="quotationsSummary">
        <h2>Quotations summary</h2>
        <QuotationsSummary />
      </div>
    </div>
  );
}

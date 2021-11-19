import React, { useEffect, useState } from 'react';

import { QuotationsSummaryCardProps } from './interfaces';
import { QuotationUI } from '../Quotations/interfaces';
import { OptionUI } from '../Form/interfaces';
import { quotationDefault } from '../Quotations/defaultState';
import { allQuotations, averageQuotations, medianQuotations } from '../../requests/quotations-requests';

import { numberToAmount, rateToPercent } from '../../utils';
import { Select } from '../Form';

export default function QuotationsSummary() {
  const emptyQuotations = [
    {
      ...quotationDefault,
      createdAt: new Date('2000-01-01 00:00:00'),
    },
  ];
  const emptyFilterYear = [
    { key: '_none', label: '-- all --' },
  ];

  const [quotations, setQuotations] = useState<QuotationUI[]>(emptyQuotations);
  const [raw, setRaw] = useState<QuotationUI[]>(emptyQuotations);
  const [years, setYears] = useState<OptionUI[]>(emptyFilterYear);
  const [total, setTotal] = useState(0);
  const [year, setYear] = useState('_none');
  const [avg, setAvg] = useState(0);
  const [median, setMedian] = useState(0);

  function getFilterYears(data: QuotationUI[]): OptionUI[] {
    const uniqueYears = Array.from(new Set(data.map(({ createdAt }) => {
      if (!createdAt) return '9999'; // datum always has a createdAt property

      return new Date(createdAt).getFullYear().toString();
    })));

    return uniqueYears.map((item: string) => ({ key: item }));
  }

  function setData(data: QuotationUI[]) {
    setQuotations(data);
    setTotal(data.length);
  }

  useEffect(() => {
    allQuotations()
      .then((response) => {
        const filterYears = getFilterYears(response);

        setRaw(response);
        setData(response);
        setYears([
          ...emptyFilterYear,
          ...filterYears,
        ]);
      })
      .catch((error) => {
        window.flashMessage({
          content: (
            <>
              <p>There was an error retrieving the quotations:</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });

    averageQuotations()
      .then((response) => {
        setAvg(response);
      })
      .catch((error) => {
        window.flashMessage({
          content: (
            <>
              <p>There was an error retrieving the average amount of the quotations:</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });

    medianQuotations()
      .then((response) => {
        setMedian(response);
      })
      .catch((error) => {
        window.flashMessage({
          content: (
            <>
              <p>There was an error retrieving the median amount of the quotations:</p>
              <pre>{`${error}`}</pre>
            </>
          ),
          status: 'error',
        });
      });
  }, []);

  useEffect(() => {
    const filteredData = year === '_none'
      ? raw
      : raw.filter(({ createdAt }) => {
        if (createdAt) {
          return new Date(createdAt).getFullYear().toString() === year;
        }

        return false;
      });

    setData(filteredData);
  }, [year]);

  function countAcceptedQuotations(): number {
    return quotations.filter(({ status, active }) => active && status).length;
  }

  function countPendingQuotations(): number {
    return quotations.filter(({ status, active }) => active && !status).length;
  }

  function countCancelledQuotations(): number {
    return quotations.filter(({ active }) => !active).length;
  }

  function getRate(value: number): number {
    return total ? value / total : 0;
  }

  function Card(props: QuotationsSummaryCardProps) {
    const { type, title, count } = props;

    const classes = ['card', `card-${type}`];

    return (
      <div className={classes.join(' ')}>
        <p>
          {title}
          <strong className="card__block">
            {count}
            <small>{`/${total}`}</small>
          </strong>
          <span className="card__big">
            {rateToPercent(getRate(count))}
          </span>
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="filters">
        <Select
          name="filterYear"
          value={year}
          options={years}
          choose="Choose a year"
          onChange={({ target }) => {
            setYear(target.value);
          }}
        />
      </div>

      <div className="quotations-summary cards">
        <Card type="success" title="Accepted" count={countAcceptedQuotations()} />

        <Card type="warning" title="In progress" count={countPendingQuotations()} />

        <Card type="error" title="Cancelled" count={countCancelledQuotations()} />
      </div>

      <div className="quotations-stats">
        {`Avg.: ${numberToAmount(avg)} – Med.: ${numberToAmount(median)}`}
      </div>
    </>
  );
}

import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Select } from '../Form';

import { ChartProps, TotalDataUI, TotalMonthUI } from './interfaces';
import { OptionUI } from '../Form/interfaces';

import { numberToAmount } from '../../utils';

import monthsList from './months.json';

export default function InvoicesChart(props: ChartProps) {
  const { invoices } = props;

  const emptyFilterYear = [{ key: '' }];

  const [years, setYears] = useState<OptionUI[]>(emptyFilterYear);
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [data, setData] = useState<TotalMonthUI[] | null>(null);

  function getInvoices() {
    const currentYear = new Date().getFullYear().toString();

    if (Object.prototype.hasOwnProperty.call(invoices, currentYear)) {
      return invoices;
    }

    const emptyYear: any = [];
    monthsList.forEach(({ abbreviation }, index) => {
      emptyYear[index] = {
        month: abbreviation,
        paid: 0,
        pending: 0,
      };
    });

    return {
      ...invoices,
      [currentYear]: [...emptyYear],
    };
  }

  function getFilterYears(totals: TotalDataUI): OptionUI[] {
    return Object.keys(totals).map((item: string) => ({ key: item }));
  }

  function getTooltipLabel(label: string) {
    return monthsList.find(({ abbreviation }) => label === abbreviation)?.name;
  }

  function CustomTooltip({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) {
    if (active && payload && payload.length) {
      return (
        <div
          className="recharts-default-tooltip"
          style={{
            margin: 0,
            padding: '10px',
            backgroundColor: '#fff',
            border: '1px solid  #ccc',
            whiteSpace: 'nowrap',
          }}
        >
          <p
            className="recharts-tooltip-label"
            style={{
              borderBottom: '1px solid #2f2d2e',
              margin: 0,
            }}
          >
            {getTooltipLabel(label)}
          </p>
          <ul
            className="recharts-tooltip-item-list"
            style={{ margin: 0, padding: 0 }}
          >
            {payload.reverse().map(({ dataKey, value, color }) => (
              <li
                key={dataKey}
                className="recharts-tooltip-item"
                style={{
                  color,
                  display: 'block',
                  paddingBottom: '4px',
                  paddingTop: '4px',
                }}
              >
                {`${dataKey}: ${numberToAmount(parseInt(value?.toString() || '0', 10))}`}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return null;
  }

  useEffect(() => {
    const values = getInvoices();
    setData(values[year]);
  }, []);

  useEffect(() => {
    const values = getInvoices();

    const filterYears = getFilterYears(values);
    setYears([
      ...filterYears,
    ]);

    setData(values[year]);
  }, [invoices, year]);

  return (
    <>
      {data
        ? (
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

            <div className="chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={data}
                >
                  <CartesianGrid strokeDasharray="1 5" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="paid" stackId="a" fill="#04a821" />
                  <Bar dataKey="pending" stackId="a" fill="#fa0" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )
        : (
          <div className="chart cards">
            <div className="card">
              <p>
                No invoices to show
                <span className="card__big">Go to work!</span>
              </p>
            </div>
          </div>
        )}
    </>
  );
}

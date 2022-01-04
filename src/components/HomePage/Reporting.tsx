import React from 'react';

import { ReportingProps, TotalMonthUI } from './interfaces';

import { numberToAmount } from '../../utils';

import monthsList from './months.json';
import { reporting } from '../../settings.json';

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;

export default function Reporting(props: ReportingProps) {
  const { invoices } = props;

  const data: TotalMonthUI[] = invoices[CURRENT_YEAR] || [];

  /**
   * Get the amount to declare by month
   */
  function getMonthlyIncome() {
    const thisMonth = monthsList.find(({ numeric }) => numeric === CURRENT_MONTH);

    const thisAmount = data.find(({ month }) => (
      month === thisMonth?.abbreviation
    ))?.paid || 0;

    return (
      <p>
        Income to declare for
        <br />
        <strong className="card__block">{thisMonth?.name}</strong>
        <span className="card__big">{numberToAmount(thisAmount)}</span>
      </p>
    );
  }

  /**
   * Render the amount block for quarterly reporting
   *
   * @param totals The totals of invoice grouped by month
   * @param month The next month to report
   * @param concernedMonths The months concerned by the reporting
   * @param prevAmount The initial amount
   */
  function renderQuarterlyAmount(
    totals: TotalMonthUI[],
    month: string,
    concernedMonths: string[],
    prevAmount: number,
  ) {
    const amount = totals
      ? totals
        .filter((datum) => concernedMonths.includes(datum.month))
        .reduce((previous: number, current: TotalMonthUI) => (
          previous + current.paid
        ), prevAmount)
      : 0;

    return (
      <p>
        Income to declare in
        <strong className="card__block">{month}</strong>
        <em>{`for: ${concernedMonths.join(', ')}`}</em>
        <span className="card__big">{numberToAmount(amount)}</span>
      </p>
    );
  }

  /**
   * Get the amount to declare in January
   * (
   *  period: Nov Y-1, Dec Y-1, Jan Y – isJanuary = true
   *  or: Nov Y, Dec Y, Jan Y+1 – isJanuary = false
   * )
   */
  function getQuarterlyIncomeForJanuary(isJanuary = true) {
    let novDecData = data;
    let januaryAmount = 0;
    let concernedMonths = ['Nov', 'Dec'];

    if (isJanuary) {
      novDecData = invoices[CURRENT_YEAR - 1];
      januaryAmount = data.find(({ month }) => month === 'Jan')?.paid || 0;
      concernedMonths = ['Nov', 'Dec', 'Jan'];
    }

    return renderQuarterlyAmount(
      novDecData,
      'January',
      concernedMonths,
      januaryAmount,
    );
  }

  /**
   * Get the amount to declare by quarter
   */
  function getQuarterlyIncome() {
    if (CURRENT_MONTH === 1 || CURRENT_MONTH > 10) {
      return getQuarterlyIncomeForJanuary(CURRENT_MONTH === 1);
    }

    const nextMonthToDeclare = reporting.dueMonths.find((month) => (
      parseInt(month, 10) >= CURRENT_MONTH
    )) || '1';

    const thisMonth = monthsList.find(({ numeric }) => (
      numeric === parseInt(nextMonthToDeclare, 10)
    ));

    const months: { [key: string]: any } = reporting.concernedMonths;

    if (Object.prototype.hasOwnProperty.call(months, nextMonthToDeclare)) {
      const concernedMonths = months[nextMonthToDeclare.toString()];

      return renderQuarterlyAmount(data, thisMonth?.name || '', concernedMonths, 0);
    }

    return null;
  }

  /**
   * Get the annual income
   */
  function getAnnualIncome() {
    const thisYearIncome = data
      ? data.reduce((previous: number, current: TotalMonthUI) => (
        previous + current.paid
      ), 0)
      : 0;

    if (reporting.interval === 1) {
      return thisYearIncome;
    }

    return invoices[CURRENT_YEAR - 1]
      ? (
        invoices[CURRENT_YEAR - 1]
          .filter(({ month }) => ['Nov', 'Dec'].includes(month))
          .reduce((previous: number, current: TotalMonthUI) => (
            previous + current.paid
          ), thisYearIncome)
      )
      : thisYearIncome;
  }

  return (
    <div className="reporting">
      <div className="reporting__card card">
        {reporting.interval === 1
          ? getMonthlyIncome()
          : getQuarterlyIncome()}
      </div>

      <div className="reporting__annual">
        {`Annual income: ${numberToAmount(getAnnualIncome())}`}
      </div>
    </div>
  );
}

export interface TotalUI {
  status: boolean,
  month: string,
  year: string,
  total: number,
}

export interface TotalMonthUI {
  month: string,
  paid: number,
  pending: number,
}

export interface TotalDataUI {
  [key: string]: TotalMonthUI[],
}

export interface ChartProps {
  invoices: TotalDataUI,
}

export interface ReportingProps {
  invoices: TotalDataUI,
}

export interface QuotationsSummaryCardProps {
  type: string,
  title: string,
  count: number,
}

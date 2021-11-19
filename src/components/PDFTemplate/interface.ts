import { InvoiceUI } from '../Invoices/interfaces';
import { QuotationUI } from '../Quotations/interfaces';

export interface PDFTemplateProps {
  type: string,
  data: InvoiceUI | QuotationUI,
  amount: number | null,
}

export interface PDFViewerProps extends PDFTemplateProps {
  close: Function,
}

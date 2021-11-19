import React from 'react';
import { Document } from '@react-pdf/renderer';

import PDFPage from './Page';
import PDFHeader from './Header';
import PDFProject from './Project';
import PDFItems from './Items';
import PDFSignature from './Signature';
import PDFReference from './Reference';
import PDFModality from './Modality';
import PDFFooter from './Footer';

import { PDFTemplateProps } from './interface';

import { InvoiceUI } from '../Invoices/interfaces';
import { QuotationUI } from '../Quotations/interfaces';

import { dateToLong } from '../../utils';

import { mentions } from '../../settings.json';

const isInvoice = (data: InvoiceUI | QuotationUI): data is InvoiceUI => (
  'quotation' in data
);

// Create Document Component
export default function PDFTemplate(props: PDFTemplateProps) {
  const { type, data, amount } = props;
  const qData = isInvoice(data) ? data.quotationData : data;

  let discountData: string | null = null;

  if (isInvoice(data)) {
    const { depositData } = data;
    const { number, createdAt } = depositData;

    if (createdAt) {
      const discount = {
        description: {
          title: `Acompte n° ${number}`,
          content: `Facture d'acompte du ${dateToLong(new Date(createdAt))}`,
        },
        rate: mentions.payment.rate * 100,
      };
      discountData = JSON.stringify(discount);
    } else {
      discountData = data.discount;
    }
  }

  return (
    <Document
      author="TAVERNIER Fabien"
      creator="Monkfish"
      title={`${type} N° ${data.number}`}
    >
      <PDFPage>
        <PDFHeader
          type={type}
          number={data.number}
          createdAt={data.createdAt}
        />

        <PDFProject
          project={qData.project}
          work={qData.work}
          description={qData.subtitle}
        />

        {isInvoice(data)
          ? (
            <>
              <PDFReference
                description={qData.work || qData.project}
                reference={qData.number}
                type={data.type}
                amount={amount || 0}
                discount={discountData}
                comment={data.comment}
              />

              <PDFModality />
            </>
          )
          : (
            <>
              <PDFItems
                items={qData.items}
                amount={amount || 0}
                comment={qData.comment}
              />

              <PDFSignature />
            </>
          )}

        <PDFFooter
          type={type}
          client={data.clientData}
          amount={amount}
        />
      </PDFPage>
    </Document>
  );
}

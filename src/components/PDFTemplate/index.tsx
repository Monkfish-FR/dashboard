import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';

import PDFTemplate from './Template';
import { Button } from '../Form';

import { PDFViewerProps } from './interface';

import './PDFTemplate.scss';

export default function Viewer(props: PDFViewerProps) {
  const {
    type,
    data,
    amount,
    close,
  } = props;

  function Template() {
    return (
      <PDFTemplate
        type={type}
        data={data}
        amount={amount}
      />
    );
  }

  return (
    <>
      <div className="pdf__wrapper">
        <PDFViewer>
          <Template />
        </PDFViewer>
      </div>

      <Button
        type="close"
        op="close"
        onClick={() => close()}
      >
        [ Close ]
      </Button>
    </>
  );
}

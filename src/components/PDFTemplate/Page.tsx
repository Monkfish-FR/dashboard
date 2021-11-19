import React, { ReactNode } from 'react';
import {
  Page,
  Font,
  StyleSheet,
} from '@react-pdf/renderer';

import SourceSansRegular from '../../assets/fonts/sourcesanspro/SourceSans3-Regular.ttf.woff';

Font.register({
  family: 'Source Sans',
  format: 'woff',
  fonts: [
    { src: SourceSansRegular },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    color: '#2f2d2e',
    fontFamily: 'Source Sans',
    fontSize: 13,
    paddingHorizontal: '20mm',
    paddingVertical: '13mm',
  },
});

export default function PDFPage(props: { children: ReactNode[] }) {
  const { children } = props;

  return (
    <Page
      size="A4"
      style={styles.page}
    >
      {children}
    </Page>
  );
}

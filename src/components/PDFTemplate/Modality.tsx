import React from 'react';
import {
  View,
  Text,
  Font,
  StyleSheet,
} from '@react-pdf/renderer';

import { payment } from '../../settings.json';

import SourceSansRegular from '../../assets/fonts/sourcesanspro/SourceSans3-Regular.ttf.woff';
import SourceSansBold from '../../assets/fonts/sourcesanspro/SourceSans3-Bold.ttf.woff';
import SourceCode from '../../assets/fonts/sourcecodepro/SourceCodePro-Regular.ttf.woff';

Font.register({
  family: 'Source Sans',
  format: 'woff',
  fonts: [
    { src: SourceSansRegular },
    { src: SourceSansBold, fontWeight: 700 },
  ],
});

Font.register({
  family: 'Source Code',
  format: 'woff',
  src: SourceCode,
});

// Create styles
const styles = StyleSheet.create({
  modality: {
    bottom: '75mm',
    fontSize: 10,
    left: '20mm',
    position: 'absolute',
    right: '20mm',
  },
  iban: {
    fontFamily: 'Source Code',
    marginLeft: '6mm',
  },
  light: {
    color: '#666',
  },
});

export default function PDFModality() {
  return (
    <View style={styles.modality}>
      <View>
        <Text style={{ fontWeight: 700 }}>Mode de paiement</Text>
        <Text>
          par virement bancaire à
          <Text style={{ color: '#fff' }}>/</Text>
          <Text style={styles.iban}>
            {payment.iban}
            <Text style={{ color: '#fff' }}>/</Text>
            {`(BIC ${payment.bic})`}
          </Text>
        </Text>
        <Text style={styles.light}>
          {`ou par chèque à l'ordre de ${payment.order}`}
        </Text>
      </View>
    </View>
  );
}

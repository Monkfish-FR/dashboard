import React from 'react';
import {
  View,
  Text,
  Font,
  StyleSheet,
} from '@react-pdf/renderer';

import SourceSansRegular from '../../assets/fonts/sourcesanspro/SourceSans3-Regular.ttf.woff';
import SourceSansItalic from '../../assets/fonts/sourcesanspro/SourceSans3-It.ttf.woff';

Font.register({
  family: 'Source Sans',
  format: 'woff',
  fonts: [
    { src: SourceSansRegular },
    { src: SourceSansItalic, fontStyle: 'italic' },
  ],
});

// Create styles
const styles = StyleSheet.create({
  signature: {
    bottom: '85mm',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: '20mm',
    position: 'absolute',
    right: '20mm',
  },
  content: {
    borderBottom: 'solid #666',
    borderBottomWidth: 0.25,
    color: '#666',
    lineHeight: 1.8,
  },
});

export default function PDFSignature() {
  return (
    <View style={styles.signature}>
      <View style={[styles.content, { width: '40mm' }]}>
        <Text>Date</Text>
      </View>

      <View style={styles.content}>
        <Text>
          Signature
          <Text style={{ color: '#fff' }}>/</Text>
          <Text style={{ fontSize: 10, fontStyle: 'italic' }}>
            précédée de la mention « Bon pour accord »
          </Text>
        </Text>
      </View>
    </View>
  );
}

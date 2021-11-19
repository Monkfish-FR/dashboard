import React from 'react';
import {
  View,
  Text,
  Font,
  StyleSheet,
} from '@react-pdf/renderer';

import { dateToLong } from '../../utils';

import PlayfairDisplayBold from '../../assets/fonts/playfairdisplay/PlayfairDisplay-Bold.woff';
import SourceSansRegular from '../../assets/fonts/sourcesanspro/SourceSans3-Regular.ttf.woff';
import SourceSansBold from '../../assets/fonts/sourcesanspro/SourceSans3-Bold.ttf.woff';

Font.register({
  family: 'Playfair Display',
  format: 'woff',
  fonts: [
    { src: PlayfairDisplayBold, fontWeight: 700 },
  ],
});

Font.register({
  family: 'Source Sans',
  format: 'woff',
  fonts: [
    { src: SourceSansRegular },
    { src: SourceSansBold, fontWeight: 700 },
  ],
});

// Create styles
const styles = StyleSheet.create({
  header: {
    marginBottom: '12mm',
  },
  title: {
    fontFamily: 'Playfair Display',
    fontSize: 69,
    fontWeight: 700,
  },
  subtitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: -8,
  },
  number: {
    color: '#048ba8',
    fontWeight: 700,
    width: '40mm',
  },
});

export default function PDFHeader(props: {
  type: string,
  number: string,
  createdAt?: Date,
}) {
  const { type, number, createdAt } = props;

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>{type}</Text>
      </View>

      <View style={styles.subtitle}>
        <Text style={styles.number}>
          {`N° ${number}`}
        </Text>

        <Text>
          {createdAt ? dateToLong(new Date(createdAt)) : ''}
        </Text>
      </View>
    </View>
  );
}

PDFHeader.defaultProps = {
  createdAt: undefined,
};

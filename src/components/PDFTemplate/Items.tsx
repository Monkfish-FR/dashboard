import React from 'react';
import {
  View,
  Text,
  Font,
  StyleSheet,
} from '@react-pdf/renderer';

import { QuotationItemUI } from '../Quotations/interfaces';
import { numberToAmount } from '../../utils';

import SourceSansRegular from '../../assets/fonts/sourcesanspro/SourceSans3-Regular.ttf.woff';

Font.register({
  family: 'Source Sans',
  format: 'woff',
  src: SourceSansRegular,
});

// Create styles
const styles = StyleSheet.create({
  items: {
    marginLeft: '40mm',
  },
  table: {
    marginBottom: '6mm',
  },
  thead: {
    borderBottom: 'solid #666',
    borderBottomWidth: 0.25,
    color: '#666',
    lineHeight: 1.8,
  },
  tr: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  td: {
    paddingRight: '4mm',
    width: '18%',
  },
  wide: {
    paddingRight: '4mm',
    width: '64%',
  },
  xWide: {
    paddingRight: '4mm',
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    marginTop: '6mm',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: '6mm',
  },
  comment: {
    paddingRight: '4mm',
    marginBottom: '6mm',
  },
});

export default function PDFItems(props: {
  items: string,
  amount: number,
  comment: string | null,
}) {
  const { items, amount, comment } = props;
  const data = JSON.parse(items);

  return (
    <View style={styles.items}>
      <View style={styles.table}>
        <View style={styles.thead}>
          <View style={[styles.tr, { marginTop: 0 }]}>
            <Text style={styles.wide}>Description</Text>
            <Text style={styles.td}>Qté</Text>
            <Text style={styles.td}>Prix unit.</Text>
          </View>
        </View>

        <View>
          {data.map((item: QuotationItemUI) => (
            <View key={item.description.content} style={styles.tr}>
              {item.quantity === 0 && item.price === 0
                ? (
                  <View style={styles.xWide}>
                    <Text style={styles.title}>{item.description.title}</Text>
                    <Text style={styles.subtitle}>{item.description.content}</Text>
                  </View>
                )
                : (
                  <>
                    <View style={styles.wide}>
                      {item.description.title
                        ? <Text style={styles.title}>{item.description.title}</Text>
                        : null}

                      <Text>{item.description.content}</Text>
                    </View>
                    <Text style={styles.td}>{item.quantity > 0 ? item.quantity : ''}</Text>
                    <Text style={styles.td}>{item.price > 0 ? item.price : ''}</Text>
                  </>
                )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.comment}>
        <Text>{comment}</Text>
      </View>

      <View style={[styles.tr, { fontSize: 16, fontWeight: 700 }]}>
        <Text style={styles.td}>Total</Text>
        <Text style={styles.td}>{numberToAmount(amount)}</Text>
      </View>
    </View>
  );
}

import React from 'react';
import {
  View,
  Text,
  Font,
  StyleSheet,
} from '@react-pdf/renderer';

import { numberToAmount, rateToPercent } from '../../utils';

import { mentions } from '../../settings.json';

import SourceSansRegular from '../../assets/fonts/sourcesanspro/SourceSans3-Regular.ttf.woff';

Font.register({
  family: 'Source Sans',
  format: 'woff',
  src: SourceSansRegular,
});

// Create styles
const styles = StyleSheet.create({
  reference: {
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
    marginTop: '6mm',
  },
  trDiscount: {
    alignItems: 'flex-end',
    backgroundColor: '#fa0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: '6mm',
  },
  td: {
    paddingRight: '4mm',
    width: '20%',
  },
  wide: {
    paddingRight: '4mm',
    width: '80%',
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
  },
  comment: {
    fontSize: 16,
    marginTop: '12mm',
  },
});

export default function PDFReference(props: {
  description: string,
  reference: string,
  type: string,
  amount: number,
  discount: string | null,
  comment: string | null,
}) {
  const {
    description,
    reference,
    type,
    amount,
    discount,
    comment,
  } = props;

  const reduction = discount ? JSON.parse(discount) : null;
  const discountAmount = reduction
    ? amount * (reduction.rate / 100)
    : 0;

  const total = reduction
    ? amount - discountAmount
    : amount;

  const deposit = type === 'deposit'
    ? ` – Acompte de ${rateToPercent(mentions.payment.rate)}`
    : '';
  const textReference = `Réf. Devis n° ${reference}${deposit}`;

  return (
    <>
      <View style={styles.reference}>
        <View style={styles.table}>
          <View style={styles.thead}>
            <View style={[styles.tr, { marginTop: 0 }]}>
              <Text style={styles.wide}>Description</Text>
              <Text style={styles.td}>Prix unit.</Text>
            </View>
          </View>

          <View>
            <View key={description} style={styles.tr}>
              <View style={styles.wide}>
                <Text style={styles.title}>{description}</Text>
                <Text>{textReference}</Text>
              </View>
              <Text style={styles.td}>{amount}</Text>
            </View>

            {reduction
              ? (
                <View style={styles.trDiscount}>
                  <View style={styles.wide}>
                    <Text style={styles.title}>{reduction.description.title}</Text>
                    <Text>{reduction.description.content}</Text>
                  </View>
                  <Text style={styles.td}>{discountAmount * -1}</Text>
                </View>
              )
              : null}
          </View>
        </View>

        <View style={[styles.tr, { fontSize: 16, fontWeight: 700 }]}>
          <Text style={styles.td}>Total</Text>
          <Text style={styles.td}>{numberToAmount(total)}</Text>
        </View>
      </View>

      {comment
        && (
          <View style={styles.comment}>
            <Text>{comment}</Text>
          </View>
        )}
    </>
  );
}

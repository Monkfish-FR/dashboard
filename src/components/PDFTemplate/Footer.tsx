import React from 'react';
import {
  View,
  Text,
  Font,
  StyleSheet,
} from '@react-pdf/renderer';

import { ClientUI } from '../Clients/interfaces';

import {
  name as myName,
  fullName as myFullName,
  email as myEmail,
  siret as mySiret,
  address as myAddress,
  locality as myLocality,
  mentions,
} from '../../settings.json';

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
  footer: {
    borderTop: '1pt solid #2f2d2e',
    bottom: '20mm',
    display: 'flex',
    flexDirection: 'row',
    fontSize: 10,
    justifyContent: 'space-between',
    left: '20mm',
    paddingTop: 10,
    position: 'absolute',
    right: '20mm',
  },
  contact: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  card: {
    lineHeight: 1.6,
    minWidth: '40mm',
    whiteSpace: 'nowrap',
  },
  title: {
    fontFamily: 'Playfair Display',
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1.4,
  },
  mentions: {
    lineHeight: 1.6,
    width: '60mm',
  },
  tva: {
    color: '#666',
    fontSize: 8,
    marginBottom: '6mm',
    marginTop: '11mm',
  },
  thx: {
    color: '#fa0',
    fontSize: 21,
    fontWeight: 700,
    marginTop: '7mm',
  },
});

export default function PDFFooter(props: {
  type: string,
  client: ClientUI,
  amount: number | null,
}) {
  const { type, client, amount } = props;

  return (
    <View style={styles.footer}>
      <View style={styles.contact}>
        <View style={styles.card}>
          <Text style={styles.title}>{myName}</Text>
          <Text>{myFullName}</Text>
          <Text>{mySiret}</Text>
          <Text>{myAddress}</Text>
          <Text>{myLocality}</Text>
          <Text>{myEmail}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{client.structureData.alias}</Text>
          <Text>{client.structureData.subtitle || `${client.firstName} ${client.lastName}`}</Text>
          <Text>{client.structureData.siret}</Text>
          <Text>{client.structureData.address}</Text>
          <Text>{client.structureData.locality}</Text>
          <Text>{client.email}</Text>
        </View>
      </View>

      <View style={styles.mentions}>
        <Text style={styles.tva}>{mentions.tva}</Text>

        {type === 'devis'
          ? (
            <>
              <Text>{mentions.validity}</Text>
              <Text>
                {amount && amount < mentions.payment.limit
                  ? mentions.payment.under
                  : mentions.payment.over}
              </Text>
            </>
          )
          : <Text style={styles.thx}>Merci.</Text>}
      </View>
    </View>
  );
}

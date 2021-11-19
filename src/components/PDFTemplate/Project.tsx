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

Font.registerHyphenationCallback((word) => [word]);

// Create styles
const styles = StyleSheet.create({
  project: {
    marginBottom: '9mm',
  },
  label: {
    color: '#666',
    lineHeight: 1.4,
  },
  title: {
    fontSize: 21,
    lineHeight: 1.4,
  },
  subtitle: {
    fontSize: 10,
  },
});

export default function PDFSignature(props: {
  project: string,
  work: string | null,
  description: string | null,
}) {
  const { project, work, description } = props;

  return (
    <View style={styles.project}>
      <Text style={styles.label}>Projet</Text>

      <Text style={styles.title}>
        {project}
        <Text style={{ color: '#fff' }}>/</Text>
        <Text>
          {work ? `– ${work}` : ''}
        </Text>
      </Text>

      <Text style={styles.subtitle}>
        {description || ''}
      </Text>
    </View>
  );
}

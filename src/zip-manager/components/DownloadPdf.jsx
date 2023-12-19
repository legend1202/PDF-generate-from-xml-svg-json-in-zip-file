import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles for the PDF document
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

// Create your PDF Document component
const DownloadPdf = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        {
            document.getElementById("business-card").innerHTML
        }
      </View>
    </Page>
  </Document>
);

export default DownloadPdf;

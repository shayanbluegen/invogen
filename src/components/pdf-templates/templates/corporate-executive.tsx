import React from 'react';
import { Document, Page, StyleSheet, View, Text, Line, Svg } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { InvoiceData } from '~/lib/types';
import { PDFTemplate, registerTemplate } from '../template-registry';

interface CorporateExecutiveTemplateProps {
  invoice: InvoiceData;
}

// Define the template colors
const colors = {
  primary: '#1f2937',
  secondary: '#f9fafb',
  accent: '#d1d5db',
  text: '#111827',
  muted: '#6b7280',
};

// Create the template component
const CorporateExecutiveTemplate: React.FC<CorporateExecutiveTemplateProps> = ({ invoice }) => {
  const formatCurrency = (amount: number) => {
    const safeAmount = Number(amount) || 0;
    if (isNaN(safeAmount)) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(safeAmount);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Executive Header with Border */}
          <View style={styles.headerContainer}>
            <View style={styles.headerBorder}>
              <View style={styles.headerContent}>
                <View style={styles.headerLeft}>
                  <Text style={styles.companyName}>{invoice.company.name}</Text>
                  <View style={styles.companyDetails}>
                    <Text style={styles.companyDetail}>{invoice.company.address}</Text>
                    <View style={styles.contactRow}>
                      <Text style={styles.companyDetail}>{invoice.company.email}</Text>
                      <Text style={styles.companyDetail}> • {invoice.company.phone}</Text>
                    </View>
                    <Text style={styles.companyDetail}>{invoice.company.website}</Text>
                  </View>
                </View>
                <View style={styles.headerRight}>
                  <Text style={styles.invoiceTitle}>INVOICE</Text>
                  <Text style={styles.invoiceNumber}>#{invoice.number}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Client and Invoice Details in Structured Boxes */}
          <View style={styles.detailsSection}>
            <View style={styles.detailBox}>
              <Text style={styles.boxTitle}>BILL TO</Text>
              <View style={styles.boxContent}>
                <Text style={styles.clientName}>{invoice.client.name}</Text>
                <Text style={styles.clientDetail}>{invoice.client.address}</Text>
                <Text style={styles.clientDetail}>{invoice.client.email}</Text>
              </View>
            </View>

            <View style={styles.detailBox}>
              <Text style={styles.boxTitle}>INVOICE DETAILS</Text>
              <View style={styles.boxContent}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Issue Date:</Text>
                  <Text style={styles.detailValue}>{format(invoice.issueDate, 'MMMM dd, yyyy')}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Due Date:</Text>
                  <Text style={styles.detailValue}>{format(invoice.dueDate, 'MMMM dd, yyyy')}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Professional Table with Strong Borders */}
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.descriptionColumn]}>DESCRIPTION</Text>
              <Text style={[styles.tableHeaderCell, styles.quantityColumn]}>QTY</Text>
              <Text style={[styles.tableHeaderCell, styles.priceColumn]}>UNIT PRICE</Text>
              <Text style={[styles.tableHeaderCell, styles.amountColumn]}>AMOUNT</Text>
            </View>

            {invoice.items.map((item, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : {}]}>
                <Text style={[styles.tableCell, styles.descriptionColumn]}>{item.description}</Text>
                <Text style={[styles.tableCell, styles.quantityColumn]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.priceColumn]}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={[styles.tableCell, styles.amountColumn]}>{formatCurrency(item.amount)}</Text>
              </View>
            ))}
          </View>

          {/* Executive Summary Box */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>INVOICE SUMMARY</Text>
              <View style={styles.summaryContent}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal:</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(invoice.subtotal)}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax ({invoice.taxRate}%):</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(invoice.taxAmount)}</Text>
                </View>

                <View style={styles.summaryDivider} />
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>TOTAL AMOUNT DUE:</Text>
                  <Text style={styles.totalValue}>{formatCurrency(invoice.total)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Notes Section */}
            <View style={styles.notesContainer}>
              <Text style={styles.notesTitle}>TERMS & CONDITIONS</Text>
              <Text style={styles.notesText}>{invoice.notes}</Text>
            </View>

          {/* Professional Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Thank you for your business. Payment is due within the terms specified above.</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Define the styles
const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontFamily: 'Helvetica',
    backgroundColor: 'white',
    fontSize: 10,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 30,
  },
  headerBorder: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'solid',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.secondary,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  companyDetails: {
    marginTop: 5,
  },
  companyDetail: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 2,
  },
  contactRow: {
    flexDirection: 'row',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 2,
    marginBottom: 5,
  },
  invoiceNumber: {
    fontSize: 14,
    color: colors.text,
    fontWeight: 'bold',
  },
  detailsSection: {
    flexDirection: 'row',
    marginBottom: 30,
    gap: 20,
  },
  detailBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.accent,
    borderStyle: 'solid',
  },
  boxTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: colors.primary,
    padding: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  boxContent: {
    padding: 15,
    backgroundColor: 'white',
  },
  clientName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  clientDetail: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 9,
    color: colors.muted,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 9,
    color: colors.text,
  },
  tableContainer: {
    marginBottom: 25,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'solid',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 12,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.accent,
    borderBottomStyle: 'solid',
  },
  evenRow: {
    backgroundColor: colors.secondary,
  },
  tableCell: {
    fontSize: 10,
    color: colors.text,
  },
  descriptionColumn: {
    flex: 3,
    textAlign: 'left',
  },
  quantityColumn: {
    flex: 0.8,
    textAlign: 'center',
  },
  priceColumn: {
    flex: 1.2,
    textAlign: 'right',
  },
  amountColumn: {
    flex: 1.2,
    textAlign: 'right',
  },
  fullWidth: {
    flex: 1,
    textAlign: 'center',
    fontStyle: 'italic',
    color: colors.muted,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 25,
  },
  summaryBox: {
    width: 250,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'solid',
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: colors.primary,
    padding: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  summaryContent: {
    padding: 15,
    backgroundColor: 'white',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 10,
    color: colors.muted,
  },
  summaryValue: {
    fontSize: 10,
    color: colors.text,
    fontWeight: 'bold',
  },
  summaryDivider: {
    height: 2,
    backgroundColor: colors.primary,
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  notesContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.accent,
    borderStyle: 'solid',
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: colors.primary,
    padding: 8,
    letterSpacing: 0.5,
  },
  notesText: {
    fontSize: 9,
    color: colors.text,
    lineHeight: 1.4,
    padding: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 35,
    right: 35,
    borderTopWidth: 1,
    borderTopColor: colors.accent,
    borderTopStyle: 'solid',
    paddingTop: 15,
  },
  footerText: {
    fontSize: 9,
    color: colors.muted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

// Register the template
const corporateExecutiveTemplate: PDFTemplate = {
  id: 'corporate-executive',
  name: 'Corporate Executive',
  description: 'Formal executive template with structured layout and professional borders',
  preview: '/templates/corporate-executive-preview.png',
  colors,
  component: CorporateExecutiveTemplate,
};

registerTemplate(corporateExecutiveTemplate);

export default CorporateExecutiveTemplate;

import React from 'react';
import { Document, Page, StyleSheet, View, Text } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { InvoiceData } from '~/lib/types';
import { PDFTemplate, registerTemplate } from '../template-registry';

interface ModernMinimalistTemplateProps {
  invoice: InvoiceData;
}

// Define the template colors
const colors = {
  primary: '#2563eb',
  secondary: '#f8fafc',
  accent: '#64748b',
  text: '#0f172a',
  muted: '#64748b',
};

// Create the template component
const ModernMinimalistTemplate: React.FC<ModernMinimalistTemplateProps> = ({ invoice }) => {
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
          {/* Minimalist Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.invoiceTitle}>Invoice</Text>
              <Text style={styles.invoiceNumber}>#{invoice.number}</Text>
            </View>
            <View style={styles.headerDivider} />
          </View>

          {/* Company and Client Info */}
          <View style={styles.infoSection}>
            <View style={styles.fromSection}>
              <Text style={styles.sectionLabel}>From</Text>
              <Text style={styles.companyName}>{invoice.company.name}</Text>
              {invoice.company.address && (
                <Text style={styles.infoText}>{invoice.company.address}</Text>
              )}
              {invoice.company.email && (
                <Text style={styles.infoText}>{invoice.company.email}</Text>
              )}
              {invoice.company.phone && (
                <Text style={styles.infoText}>{invoice.company.phone}</Text>
              )}
            </View>

            <View style={styles.toSection}>
              <Text style={styles.sectionLabel}>To</Text>
              <Text style={styles.clientName}>{invoice.client.name}</Text>
              {invoice.client.address && (
                <Text style={styles.infoText}>{invoice.client.address}</Text>
              )}
              {invoice.client.email && (
                <Text style={styles.infoText}>{invoice.client.email}</Text>
              )}
            </View>

            <View style={styles.dateSection}>
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Issue Date</Text>
                <Text style={styles.dateValue}>{format(invoice.issueDate, 'MMM dd, yyyy')}</Text>
              </View>
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>Due Date</Text>
                <Text style={styles.dateValue}>{format(invoice.dueDate, 'MMM dd, yyyy')}</Text>
              </View>
            </View>
          </View>

          {/* Items Table */}
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.descriptionColumn]}>Description</Text>
              <Text style={[styles.tableHeaderCell, styles.quantityColumn]}>Qty</Text>
              <Text style={[styles.tableHeaderCell, styles.priceColumn]}>Rate</Text>
              <Text style={[styles.tableHeaderCell, styles.amountColumn]}>Amount</Text>
            </View>

            {invoice.items && invoice.items.length > 0 ? (
              invoice.items.map((item, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.descriptionColumn]}>{item.description}</Text>
                  <Text style={[styles.tableCell, styles.quantityColumn]}>{item.quantity}</Text>
                  <Text style={[styles.tableCell, styles.priceColumn]}>{formatCurrency(item.unitPrice)}</Text>
                  <Text style={[styles.tableCell, styles.amountColumn]}>{formatCurrency(item.amount)}</Text>
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.fullWidth]}>No items</Text>
              </View>
            )}
          </View>

          {/* Totals */}
          <View style={styles.totalsContainer}>
            <View style={styles.totalsSection}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal)}</Text>
              </View>

              {(Number(invoice.taxRate) || 0) > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Tax ({Number(invoice.taxRate) || 0}%)</Text>
                  <Text style={styles.totalValue}>{formatCurrency(invoice.taxAmount)}</Text>
                </View>
              )}

              <View style={styles.totalDivider} />
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>Total</Text>
                <Text style={styles.grandTotalValue}>{formatCurrency(invoice.total)}</Text>
              </View>
            </View>
          </View>

          {/* Notes */}
          {invoice.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>{invoice.notes}</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

// Define the styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: 'white',
    fontSize: 10,
    lineHeight: 1.4,
  },
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  invoiceTitle: {
    fontSize: 32,
    fontWeight: 'normal',
    color: colors.text,
    letterSpacing: -0.5,
  },
  invoiceNumber: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: 'normal',
  },
  headerDivider: {
    height: 1,
    backgroundColor: colors.accent,
    opacity: 0.3,
  },
  infoSection: {
    flexDirection: 'row',
    marginBottom: 40,
    gap: 30,
  },
  fromSection: {
    flex: 1,
  },
  toSection: {
    flex: 1,
  },
  dateSection: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 10,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  clientName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 10,
    color: colors.muted,
    marginBottom: 2,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 10,
    color: colors.muted,
  },
  dateValue: {
    fontSize: 10,
    color: colors.text,
    fontWeight: 'bold',
  },
  tableContainer: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.text,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.accent,
    borderBottomStyle: 'solid',
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
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  totalsSection: {
    width: 200,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: colors.muted,
  },
  totalValue: {
    fontSize: 10,
    color: colors.text,
  },
  totalDivider: {
    height: 1,
    backgroundColor: colors.accent,
    marginVertical: 8,
    opacity: 0.3,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
  notesSection: {
    marginTop: 20,
  },
  notesLabel: {
    fontSize: 10,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.5,
  },
});

// Register the template
const modernMinimalistTemplate: PDFTemplate = {
  id: 'modern-minimalist',
  name: 'Modern Minimalist',
  description: 'Clean, minimal design with elegant typography and subtle accents',
  preview: '/templates/modern-minimalist-preview.png',
  colors,
  component: ModernMinimalistTemplate,
};

registerTemplate(modernMinimalistTemplate);

export default ModernMinimalistTemplate;

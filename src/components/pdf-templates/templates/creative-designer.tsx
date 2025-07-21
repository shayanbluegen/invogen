import React from 'react';
import { Document, Page, StyleSheet, View, Text } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { InvoiceData } from '~/lib/types';
import { PDFTemplate, registerTemplate } from '../template-registry';

interface CreativeDesignerTemplateProps {
  invoice: InvoiceData;
}

// Define the template colors
const colors = {
  primary: '#ec4899',
  secondary: '#fdf2f8',
  accent: '#f97316',
  text: '#0f172a',
  muted: '#64748b',
};

// Create the template component
const CreativeDesignerTemplate: React.FC<CreativeDesignerTemplateProps> = ({ invoice }) => {
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
          {/* Creative Asymmetric Header */}
          <View style={styles.headerSection}>
            <View style={styles.headerBackground}>
              <View style={styles.headerAccent} />
            </View>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <Text style={styles.invoiceLabel}>Invoice</Text>
                <Text style={styles.invoiceNumber}>#{invoice.number}</Text>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>Issued: {format(invoice.issueDate, 'MMM dd, yyyy')}</Text>
                  <Text style={styles.dateText}>Due: {format(invoice.dueDate, 'MMM dd, yyyy')}</Text>
                </View>
              </View>
              <View style={styles.headerRight}>
                <Text style={styles.companyName}>{invoice.company.name}</Text>
                <View style={styles.companyInfo}>
                  <Text style={styles.companyDetail}>{invoice.company.address}</Text>
                  <Text style={styles.companyDetail}>{invoice.company.email}</Text>
                  <Text style={styles.companyDetail}>{invoice.company.phone}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Client Section with Creative Layout */}
          <View style={styles.clientSection}>
            <View style={styles.clientCard}>
              <View style={styles.clientAccent} />
              <View style={styles.clientContent}>
                <Text style={styles.clientLabel}>Billed To</Text>
                <Text style={styles.clientName}>{invoice.client.name}</Text>
                <Text style={styles.clientDetail}>{invoice.client.address}</Text>
                <Text style={styles.clientDetail}>{invoice.client.email}</Text>
              </View>
            </View>
          </View>

          {/* Modern Table Design */}
          <View style={styles.tableSection}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.descriptionColumn]}>Description</Text>
              <Text style={[styles.tableHeaderText, styles.quantityColumn]}>Qty</Text>
              <Text style={[styles.tableHeaderText, styles.rateColumn]}>Rate</Text>
              <Text style={[styles.tableHeaderText, styles.amountColumn]}>Amount</Text>
            </View>

            {invoice.items.map((item, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 1 ? styles.alternateRow : {}]}>
                <Text style={[styles.tableCell, styles.descriptionColumn]}>{item.description}</Text>
                <Text style={[styles.tableCell, styles.quantityColumn]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.rateColumn]}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={[styles.tableCell, styles.amountColumn]}>{formatCurrency(item.amount)}</Text>
              </View>
            ))}
          </View>

          {/* Creative Totals Section */}
          <View style={styles.totalsSection}>
            <View style={styles.totalsCard}>
              <View style={styles.totalsAccent} />
              <View style={styles.totalsContent}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal</Text>
                  <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal)}</Text>
                </View>

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Tax ({invoice.taxRate}%)</Text>
                  <Text style={styles.totalValue}>{formatCurrency(invoice.taxAmount)}</Text>
                </View>

                <View style={styles.grandTotalSection}>
                  <View style={styles.grandTotalAccent} />
                  <View style={styles.grandTotalRow}>
                    <Text style={styles.grandTotalLabel}>Total</Text>
                    <Text style={styles.grandTotalValue}>{formatCurrency(invoice.total)}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Notes with Creative Styling */}
            <View style={styles.notesSection}>
              <View style={styles.notesCard}>
                <View style={styles.notesAccent} />
                <View style={styles.notesContent}>
                  <Text style={styles.notesLabel}>Notes</Text>
                  <Text style={styles.notesText}>{invoice.notes}</Text>
                </View>
              </View>
            </View>

          {/* Creative Footer */}
          <View style={styles.footer}>
            <View style={styles.footerAccent} />
            <Text style={styles.footerText}>Thank you for choosing us!</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Define the styles
const styles = StyleSheet.create({
  page: {
    padding: 25,
    fontFamily: 'Helvetica',
    backgroundColor: 'white',
    fontSize: 10,
  },
  container: {
    flex: 1,
  },
  headerSection: {
    position: 'relative',
    marginBottom: 35,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: colors.secondary,
  },
  headerAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 120,
    height: 80,
    backgroundColor: colors.primary,
    transform: 'skewX(-15deg)',
    transformOrigin: 'top right',
  },
  headerContent: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    zIndex: 1,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  invoiceLabel: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  invoiceNumber: {
    fontSize: 16,
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dateContainer: {
    marginTop: 5,
  },
  dateText: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 2,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
    textAlign: 'right',
  },
  companyInfo: {
    alignItems: 'flex-end',
  },
  companyDetail: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 2,
    textAlign: 'right',
  },
  clientSection: {
    marginBottom: 30,
  },
  clientCard: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.accent,
    borderStyle: 'solid',
  },
  clientAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 6,
    height: '100%',
    backgroundColor: colors.accent,
  },
  clientContent: {
    paddingLeft: 20,
    paddingRight: 15,
    paddingVertical: 15,
  },
  clientLabel: {
    fontSize: 10,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  clientName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  clientDetail: {
    fontSize: 10,
    color: colors.muted,
    marginBottom: 2,
  },
  tableSection: {
    marginBottom: 25,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
    borderBottomStyle: 'solid',
  },
  alternateRow: {
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
  rateColumn: {
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
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 25,
  },
  totalsCard: {
    position: 'relative',
    width: 220,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'solid',
  },
  totalsAccent: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 6,
    height: '100%',
    backgroundColor: colors.primary,
  },
  totalsContent: {
    paddingLeft: 15,
    paddingRight: 20,
    paddingVertical: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalLabel: {
    fontSize: 10,
    color: colors.muted,
  },
  totalValue: {
    fontSize: 10,
    color: colors.text,
    fontWeight: 'bold',
  },
  grandTotalSection: {
    position: 'relative',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    borderTopStyle: 'solid',
  },
  grandTotalAccent: {
    position: 'absolute',
    top: -2,
    left: -15,
    right: -20,
    height: 2,
    backgroundColor: colors.accent,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  notesSection: {
    marginBottom: 20,
  },
  notesCard: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.accent,
    borderStyle: 'solid',
  },
  notesAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 6,
    height: '100%',
    backgroundColor: colors.accent,
  },
  notesContent: {
    paddingLeft: 20,
    paddingRight: 15,
    paddingVertical: 15,
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
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    right: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerAccent: {
    width: 40,
    height: 3,
    backgroundColor: colors.primary,
    marginRight: 15,
  },
  footerText: {
    fontSize: 11,
    color: colors.muted,
    fontStyle: 'italic',
  },
});

// Register the template
const creativeDesignerTemplate: PDFTemplate = {
  id: 'creative-designer',
  name: 'Creative Designer',
  description: 'Modern creative template with asymmetric layout and bold geometric elements',
  preview: '/templates/creative-designer-preview.png',
  colors,
  component: CreativeDesignerTemplate,
};

registerTemplate(creativeDesignerTemplate);

export default CreativeDesignerTemplate;

import React from 'react';
import { Document, Page, StyleSheet, View, Text } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { InvoiceData } from '~/lib/types';
import { PDFTemplate, registerTemplate } from '../template-registry';

interface ClassicProfessionalTemplateProps {
  invoice: InvoiceData;
}

// Define the template colors
const colors = {
  primary: '#1e3a8a',
  secondary: '#f8fafc',
  accent: '#3b82f6',
  text: '#1e293b',
  muted: '#64748b',
};

// Create the template component
const ClassicProfessionalTemplate: React.FC<ClassicProfessionalTemplateProps> = ({ invoice }) => {
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
          {/* Classic Centered Header */}
          <View style={styles.headerSection}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <View style={styles.headerDivider} />
            <Text style={styles.invoiceNumber}>Invoice #{invoice.number}</Text>
          </View>

          {/* Company Information - Centered */}
          <View style={styles.companySection}>
            <Text style={styles.companyName}>{invoice.company.name}</Text>
            {invoice.company.address && (
              <Text style={styles.companyDetail}>{invoice.company.address}</Text>
            )}
            <View style={styles.contactRow}>
              {invoice.company.email && (
                <Text style={styles.companyDetail}>{invoice.company.email}</Text>
              )}
              {invoice.company.phone && invoice.company.email && (
                <Text style={styles.companyDetail}> | </Text>
              )}
              {invoice.company.phone && (
                <Text style={styles.companyDetail}>{invoice.company.phone}</Text>
              )}
            </View>
            {invoice.company.website && (
              <Text style={styles.companyDetail}>{invoice.company.website}</Text>
            )}
          </View>

          {/* Invoice Details in Classic Layout */}
          <View style={styles.detailsSection}>
            <View style={styles.detailsRow}>
              <View style={styles.billToSection}>
                <Text style={styles.sectionTitle}>BILL TO:</Text>
                <Text style={styles.clientName}>{invoice.client.name}</Text>
                {invoice.client.address && (
                  <Text style={styles.clientDetail}>{invoice.client.address}</Text>
                )}
                {invoice.client.email && (
                  <Text style={styles.clientDetail}>{invoice.client.email}</Text>
                )}
              </View>

              <View style={styles.invoiceDetailsSection}>
                <Text style={styles.sectionTitle}>INVOICE DETAILS:</Text>
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

          {/* Classic Table Design */}
          <View style={styles.tableSection}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.descriptionColumn]}>DESCRIPTION</Text>
              <Text style={[styles.tableHeaderCell, styles.quantityColumn]}>QUANTITY</Text>
              <Text style={[styles.tableHeaderCell, styles.priceColumn]}>UNIT PRICE</Text>
              <Text style={[styles.tableHeaderCell, styles.amountColumn]}>AMOUNT</Text>
            </View>

            {invoice.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.descriptionColumn]}>{item.description}</Text>
                <Text style={[styles.tableCell, styles.quantityColumn]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, styles.priceColumn]}>{formatCurrency(item.unitPrice)}</Text>
                <Text style={[styles.tableCell, styles.amountColumn]}>{formatCurrency(item.amount)}</Text>
              </View>
            ))}
          </View>

          {/* Classic Totals Section */}
          <View style={styles.totalsSection}>
            <View style={styles.totalsContainer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal:</Text>
                <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal)}</Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tax ({invoice.taxRate}%):</Text>
                <Text style={styles.totalValue}>{formatCurrency(invoice.taxAmount)}</Text>
              </View>

              <View style={styles.grandTotalDivider} />
              <View style={styles.grandTotalRow}>
                <Text style={styles.grandTotalLabel}>TOTAL:</Text>
                <Text style={styles.grandTotalValue}>{formatCurrency(invoice.total)}</Text>
              </View>
            </View>
          </View>

          {/* Notes Section */}
          {invoice.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>NOTES:</Text>
              <Text style={styles.notesText}>{invoice.notes}</Text>
            </View>
          )}

          {/* Classic Footer */}
          <View style={styles.footer}>
            <View style={styles.footerDivider} />
            <Text style={styles.footerText}>Thank you for your business!</Text>
          </View>
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
  },
  container: {
    flex: 1,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  invoiceTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 3,
    marginBottom: 10,
  },
  headerDivider: {
    width: 200,
    height: 3,
    backgroundColor: colors.primary,
    marginBottom: 10,
  },
  invoiceNumber: {
    fontSize: 14,
    color: colors.text,
    fontWeight: 'bold',
  },
  companySection: {
    alignItems: 'center',
    marginBottom: 35,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: colors.accent,
    borderBottomColor: colors.accent,
    borderTopStyle: 'solid',
    borderBottomStyle: 'solid',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  companyDetail: {
    fontSize: 10,
    color: colors.muted,
    marginBottom: 3,
    textAlign: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsSection: {
    marginBottom: 35,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  billToSection: {
    flex: 1,
    paddingRight: 30,
  },
  invoiceDetailsSection: {
    flex: 1,
    paddingLeft: 30,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  clientName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  clientDetail: {
    fontSize: 10,
    color: colors.muted,
    marginBottom: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 10,
    color: colors.muted,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 10,
    color: colors.text,
  },
  tableSection: {
    marginBottom: 30,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'solid',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
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
    flex: 1,
    textAlign: 'center',
  },
  priceColumn: {
    flex: 1.5,
    textAlign: 'right',
  },
  amountColumn: {
    flex: 1.5,
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
    marginBottom: 30,
  },
  totalsContainer: {
    width: 250,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'solid',
    backgroundColor: colors.secondary,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 11,
    color: colors.text,
    fontWeight: 'bold',
  },
  grandTotalDivider: {
    height: 2,
    backgroundColor: colors.primary,
    marginVertical: 10,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  notesSection: {
    marginBottom: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: colors.secondary,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderLeftStyle: 'solid',
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  notesText: {
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    alignItems: 'center',
  },
  footerDivider: {
    width: 150,
    height: 2,
    backgroundColor: colors.primary,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

// Register the template
const classicProfessionalTemplate: PDFTemplate = {
  id: 'classic-professional',
  name: 'Classic Professional',
  description: 'Traditional business template with centered layout and timeless design',
  preview: '/templates/classic-professional-preview.png',
  colors,
  component: ClassicProfessionalTemplate,
};

registerTemplate(classicProfessionalTemplate);

export default ClassicProfessionalTemplate;

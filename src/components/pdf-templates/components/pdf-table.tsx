import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { InvoiceData } from '~/lib/types';
import { formatCurrency as formatCurrencyUtil } from '~/lib/currency';

interface PDFTableProps {
  invoice: InvoiceData;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    muted: string;
  };
}

export const PDFTable: React.FC<PDFTableProps> = ({ invoice, colors }) => {
  const formatCurrency = (amount: number) => {
    const safeAmount = Number(amount) || 0;
    if (isNaN(safeAmount)) {
      return formatCurrencyUtil(0, invoice.currency || 'USD');
    }
    return formatCurrencyUtil(safeAmount, invoice.currency || 'USD');
  };

  return (
    <View style={styles.tableContainer}>
      {/* Table Header */}
      <View style={[styles.tableHeader, { backgroundColor: colors.primary }]}>
        <Text style={[styles.tableHeaderCell, styles.descriptionColumn]}>Description</Text>
        <Text style={[styles.tableHeaderCell, styles.quantityColumn]}>Qty</Text>
        <Text style={[styles.tableHeaderCell, styles.priceColumn]}>Unit Price</Text>
        <Text style={[styles.tableHeaderCell, styles.amountColumn]}>Amount</Text>
      </View>

      {/* Table Body */}
      {invoice.items && invoice.items.length > 0 ? (
        invoice.items.map((item, index) => (
          <View 
            key={index} 
            style={[
              styles.tableRow, 
              index % 2 === 0 ? { backgroundColor: colors.secondary } : {}
            ]}
          >
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

      {/* Table Footer - Totals */}
      <View style={styles.totalsContainer}>
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.subtotal)}</Text>
          </View>
          
          {(Number(invoice.taxRate) || 0) > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax ({Number(invoice.taxRate) || 0}%):</Text>
              <Text style={styles.totalValue}>{formatCurrency(invoice.taxAmount)}</Text>
            </View>
          )}
          
          <View style={[styles.totalRow, styles.grandTotalRow, { backgroundColor: colors.primary }]}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(invoice.total)}</Text>
          </View>
        </View>
      </View>

      {/* Notes Section */}
      {invoice.notes && (
        <View style={styles.notesContainer}>
          <Text style={[styles.notesTitle, { color: colors.primary }]}>Notes:</Text>
          <Text style={styles.notesText}>{invoice.notes}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 12,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableCell: {
    fontSize: 10,
    color: '#374151',
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
    color: '#6B7280',
  },
  totalsContainer: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalsSection: {
    width: 200,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  totalLabel: {
    fontSize: 10,
    color: '#4B5563',
  },
  totalValue: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  grandTotalRow: {
    marginTop: 5,
    borderRadius: 5,
    paddingVertical: 8,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  grandTotalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  notesContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F9FAFB',
    borderRadius: 5,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#374151',
  },
});

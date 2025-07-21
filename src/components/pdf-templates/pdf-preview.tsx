'use client';

import React, { useMemo, useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { InvoiceData } from '~/lib/types';
import { getTemplate, getDefaultTemplate } from './templates';

// Dynamically import PDF components to avoid SSR issues
const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center p-8">Loading PDF viewer...</div>
  }
);



interface PDFPreviewProps {
  invoice: InvoiceData;
  templateId?: string;
  height?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  className?: string;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  invoice,
  templateId = 'modern-minimalist',
  height,
  minHeight,
  maxHeight,
  className = '',
}) => {
  const [isClient, setIsClient] = useState(false);
  const [containerHeight, setContainerHeight] = useState<string | number>('auto');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate optimal height for PDF preview
  useEffect(() => {
    if (!isClient) return;

    const calculateOptimalHeight = () => {
      // If height is explicitly provided, use it
      if (height) {
        setContainerHeight(height);
        return;
      }

      // A4 page dimensions at 96 DPI: ~794px width × ~1123px height
      // We want to show at least one full page when there's space
      const fullPageHeight = 1123;
      const minPageHeight = 600; // Minimum height for usability

      // Get available viewport height
      const viewportHeight = window.innerHeight;
      const availableHeight = viewportHeight - 200; // Account for headers, margins, etc.

      let optimalHeight: number;

      if (maxHeight) {
        const maxHeightNum = typeof maxHeight === 'string' ? parseInt(maxHeight) : maxHeight;
        optimalHeight = Math.min(availableHeight, maxHeightNum, fullPageHeight);
      } else if (availableHeight >= fullPageHeight) {
        // If we have enough space, show full page
        optimalHeight = fullPageHeight;
      } else if (availableHeight >= minPageHeight) {
        // Use available space but ensure minimum usability
        optimalHeight = Math.max(availableHeight, minPageHeight);
      } else {
        // Fallback to minimum height
        optimalHeight = minPageHeight;
      }

      // Apply minimum height if specified
      if (minHeight) {
        const minHeightNum = typeof minHeight === 'string' ? parseInt(minHeight) : minHeight;
        optimalHeight = Math.max(optimalHeight, minHeightNum);
      }

      setContainerHeight(optimalHeight);
    };

    calculateOptimalHeight();

    // Recalculate on window resize
    const handleResize = () => calculateOptimalHeight();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [isClient, height, minHeight, maxHeight]);

  // Get the template component
  const template = useMemo(() => {
    try {
      return getTemplate(templateId) || getDefaultTemplate();
    } catch (error) {
      console.error('Error getting template:', error);
      return null;
    }
  }, [templateId]);

  // Create a stable key for the PDFViewer based on invoice content
  const pdfViewerKey = useMemo(() => {
    const itemsLength = invoice.items?.length || 0;
    const itemsHash = invoice.items?.map((item, idx) => 
      `${idx}-${item.description}-${item.quantity}-${item.unitPrice}`
    ).join('|') || '';
    return `${templateId}-${itemsLength}-${itemsHash}`;
  }, [templateId, invoice.items]);

  // Create the PDF document component
  const PDFDocument = useMemo(() => {
    if (!template) return null;
    try {
      const TemplateComponent = template.component;
      // The template component is a React functional component that returns a Document
      return <TemplateComponent invoice={invoice} />;
    } catch (error) {
      console.error('Error creating PDF document:', error);
      return null;
    }
  }, [template, invoice, pdfViewerKey]);

  if (!isClient) {
    return (
      <div
        ref={containerRef}
        className={`flex flex-col items-center justify-center p-8 border rounded-lg bg-gray-100 text-center ${className}`}
        style={{ height: containerHeight }}
      >
        <h3 className="text-lg font-medium mb-2">Loading PDF Preview...</h3>
        <p className="text-sm text-gray-500">
          PDF preview will appear once loaded.
        </p>
      </div>
    );
  }

  if (!template || !PDFDocument) {
    return (
      <div
        ref={containerRef}
        className={`flex flex-col items-center justify-center p-8 border rounded-lg bg-red-50 text-center ${className}`}
        style={{ height: containerHeight }}
      >
        <h3 className="text-lg font-medium mb-2 text-red-600">Error Loading Template</h3>
        <p className="text-sm text-red-500">
          Could not load template: {templateId}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full border rounded-lg overflow-hidden ${className}`}
      style={{ height: containerHeight }}
    >
      {PDFViewer && (
        <PDFViewer
          key={pdfViewerKey}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        >
          {PDFDocument}
        </PDFViewer>
      )}
    </div>
  );
};



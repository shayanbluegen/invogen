import React from 'react';
import { InvoiceData } from '~/lib/types';

export interface PDFTemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  muted: string;
}

export interface PDFTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: PDFTemplateColors;
  component: React.ComponentType<{ invoice: InvoiceData }>;
}

// Template registry to store all available templates
const templateRegistry = new Map<string, PDFTemplate>();

/**
 * Register a new PDF template
 */
export function registerTemplate(template: PDFTemplate): void {
  templateRegistry.set(template.id, template);
}

/**
 * Get a template by ID
 */
export function getTemplate(templateId: string): PDFTemplate | undefined {
  return templateRegistry.get(templateId);
}

/**
 * Get the default template
 */
export function getDefaultTemplate(): PDFTemplate {
  // Return the first template or throw if none exists
  const firstTemplate = templateRegistry.values().next().value;
  
  if (!firstTemplate) {
    throw new Error('No templates registered');
  }
  
  return firstTemplate;
}

/**
 * Get all available templates
 */
export function getAllTemplates(): PDFTemplate[] {
  return Array.from(templateRegistry.values());
}

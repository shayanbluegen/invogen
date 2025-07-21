// Import all templates to ensure they're registered
import './modern-minimalist';
import './corporate-executive';
import './creative-designer';
import './classic-professional';

// Re-export from template registry
export { getTemplate, getDefaultTemplate, getAllTemplates } from '../template-registry';

'use client';

import React, { useState } from 'react';
import { Check, Palette } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { getAllTemplates } from './templates';
import { cn } from '~/lib/utils';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelectTemplate,
}) => {
  const [open, setOpen] = useState(false);

  // Get templates with error handling
  const templates = React.useMemo(() => {
    try {
      return getAllTemplates();
    } catch (error) {
      console.error('Error loading templates:', error);
      return [];
    }
  }, []);

  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  const handleTemplateSelect = (templateId: string) => {
    try {
      onSelectTemplate(templateId);
      setOpen(false);
    } catch (error) {
      console.error('Error selecting template:', error);
    }
  };

  // Show loading state if no templates are available
  if (templates.length === 0) {
    return (
      <Button variant="outline" className="gap-2 min-w-[140px] justify-start" disabled>
        <Palette className="h-4 w-4" />
        <span className="truncate">Loading...</span>
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 min-w-[140px] justify-start">
          <Palette className="h-4 w-4" />
          <span className="truncate">{currentTemplate?.name || 'Template'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          <h4 className="font-medium text-sm mb-3">Choose Template</h4>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-sm border',
                  selectedTemplate === template.id && 'ring-2 ring-primary border-primary'
                )}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: template.colors.primary }}
                    />
                    {selectedTemplate === template.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="text-sm font-medium mb-1">{template.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                  </div>
                  {/* Mini color palette */}
                  <div className="flex gap-1 mt-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: template.colors.primary }}
                    />
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: template.colors.secondary }}
                    />
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: template.colors.accent }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

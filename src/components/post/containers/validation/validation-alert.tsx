import { memo, useCallback, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { XIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { POST_MESSAGES } from '@/constants/post-messages';
import type { ValidationMessage } from './types/validation-interfaces';
import { cn } from '@/lib/utils';
import { useValidationAlert, alertVariants, alertTransition } from './hooks/validation-alert-hooks';

type AlertVariant = 'default' | 'error' | 'warning';

interface ValidationAlertProps {
  title: string;
  description?: string;
  messages: ValidationMessage[];
  onRetry?: () => void;
  onClose?: () => void;
  variant?: AlertVariant;
  showRetry?: boolean;
  showClose?: boolean;
  collapsible?: boolean;
  className?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

const getAlertVariant = (severity: ValidationMessage['severity']): AlertVariant => {
  switch (severity) {
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    default:
      return 'default';
  }
};

export const ValidationAlert = memo(({
  title,
  description,
  messages,
  onRetry,
  onClose,
  variant: propVariant,
  showRetry = true,
  showClose = false,
  collapsible = true,
  className,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby
}: ValidationAlertProps) => {
  const {
    isCollapsed,
    toggleCollapse,
    severityCount,
    hasMultipleMessages,
    hasMixedSeverity
  } = useValidationAlert({
    messages,
    defaultCollapsed: false
  });

  const titleId = ariaLabelledby || 'validation-alert-title';
  const descriptionId = ariaDescribedby || 'validation-alert-description';

  const variant = propVariant || (messages[0] && getAlertVariant(messages[0].severity)) || 'default';

  return (
    <motion.div
      variants={alertVariants.container}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={alertTransition}
    >
      <Alert 
        variant={variant} 
        role="alert"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn('relative overflow-hidden', className)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <AlertTitle id={titleId} className="mb-2 pr-8">
              {title}
            </AlertTitle>
            {description && (
              <AlertDescription id={descriptionId} className="mb-2 text-sm">
                {description}
              </AlertDescription>
            )}
          </div>
          <div className="flex items-center gap-1">
            {collapsible && hasMultipleMessages && (
              <IconButton
                variant="ghost"
                size="sm"
                onClick={toggleCollapse}
                aria-expanded={!isCollapsed}
                aria-controls="validation-messages"
                aria-label={isCollapsed ? 'Show messages' : 'Hide messages'}
              >
                {isCollapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
              </IconButton>
            )}
            {showClose && onClose && (
              <IconButton
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close alert"
              >
                <XIcon />
              </IconButton>
            )}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              variants={alertVariants.messages}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={alertTransition}
            >
              {messages.map((message, index) => (
                <motion.p
                  key={index}
                  custom={index}
                  variants={alertVariants.message}
                >
                  {message.message}
                </motion.p>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {showRetry && onRetry && (
          <motion.div
            variants={alertVariants.button}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="hover:bg-background/80"
            >
              {POST_MESSAGES.errors.boundary.retry}
            </Button>
          </motion.div>
        )}
      </Alert>
    </motion.div>
  );
});

ValidationAlert.displayName = 'ValidationAlert'; 
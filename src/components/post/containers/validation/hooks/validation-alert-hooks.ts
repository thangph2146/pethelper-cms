import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { ValidationMessage, ValidationSeverity } from '../types/validation-interfaces';

interface MessageGroup {
  severity: ValidationSeverity;
  messages: ValidationMessage[];
  expanded: boolean;
}

interface SeverityStats {
  error: number;
  warning: number;
  info: number;
  total: number;
  highestSeverity: ValidationSeverity;
  hasMixedSeverity: boolean;
}

interface AlertState {
  isCollapsed: boolean;
  autoCollapse: boolean;
  autoCollapseDelay: number;
  pauseAutoCollapse: boolean;
  lastInteraction: Date | null;
  focusedMessageIndex: number | null;
  messageGroups: Record<ValidationSeverity, MessageGroup>;
  config: Required<AlertConfig>;
  lastMessageCount: number;
}

interface MessageGroupActions {
  toggleGroup: (severity: ValidationSeverity) => void;
  expandAllGroups: () => void;
  collapseAllGroups: () => void;
}

interface AlertTimers {
  collapse?: NodeJS.Timeout;
  interaction?: NodeJS.Timeout;
  focus?: NodeJS.Timeout;
  autoExpand?: NodeJS.Timeout;
}

interface AlertConfig {
  autoExpandDelay?: number;
  autoCollapseAfterExpand?: boolean;
  expandOnNewMessages?: boolean;
  collapseEmptyGroups?: boolean;
}

interface UseValidationAlertProps {
  messages: ValidationMessage[];
  defaultCollapsed?: boolean;
  autoCollapse?: boolean;
  autoCollapseDelay?: number;
  interactionDelay?: number;
  focusDelay?: number;
  config?: AlertConfig;
  onCollapse?: () => void;
  onExpand?: () => void;
  onMessageClick?: (message: ValidationMessage) => void;
  onInteraction?: () => void;
  onFocus?: (message: ValidationMessage) => void;
  onGroupToggle?: (severity: ValidationSeverity, expanded: boolean) => void;
}

interface UseValidationAlertResult extends MessageGroupActions {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  expand: () => void;
  collapse: () => void;
  pauseAutoCollapse: () => void;
  resumeAutoCollapse: () => void;
  handleInteraction: () => void;
  handleMessageFocus: (index: number) => void;
  severityStats: SeverityStats;
  hasMultipleMessages: boolean;
  messagesByType: Record<ValidationSeverity, ValidationMessage[]>;
  handleMessageClick: (message: ValidationMessage) => void;
  focusedMessageIndex: number | null;
  messageGroups: Record<ValidationSeverity, MessageGroup>;
  visibleMessages: ValidationMessage[];
  hasEmptyGroups: boolean;
  nonEmptyGroups: ValidationSeverity[];
  toggleAutoExpand: (enabled: boolean) => void;
  resetGroups: () => void;
}

export const useValidationAlert = ({
  messages,
  defaultCollapsed = false,
  autoCollapse = false,
  autoCollapseDelay = 5000,
  interactionDelay = 2000,
  focusDelay = 500,
  config = {},
  onCollapse,
  onExpand,
  onMessageClick,
  onInteraction,
  onFocus,
  onGroupToggle
}: UseValidationAlertProps): UseValidationAlertResult => {
  const [state, setState] = useState<AlertState>({
    isCollapsed: defaultCollapsed,
    autoCollapse,
    autoCollapseDelay,
    pauseAutoCollapse: false,
    lastInteraction: null,
    focusedMessageIndex: null,
    messageGroups: {
      error: { severity: 'error', messages: [], expanded: true },
      warning: { severity: 'warning', messages: [], expanded: true },
      info: { severity: 'info', messages: [], expanded: true }
    },
    config: {
      autoExpandDelay: config.autoExpandDelay || 5000,
      autoCollapseAfterExpand: config.autoCollapseAfterExpand || false,
      expandOnNewMessages: config.expandOnNewMessages || false,
      collapseEmptyGroups: config.collapseEmptyGroups || false
    },
    lastMessageCount: messages.length
  });

  const timersRef = useRef<AlertTimers>({});

  const clearTimers = useCallback(() => {
    Object.values(timersRef.current).forEach(timer => {
      if (timer) clearTimeout(timer);
    });
    timersRef.current = {};
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      messageGroups: {
        error: { ...prev.messageGroups.error, messages: messagesByType.error || [] },
        warning: { ...prev.messageGroups.warning, messages: messagesByType.warning || [] },
        info: { ...prev.messageGroups.info, messages: messagesByType.info || [] }
      }
    }));
  }, [messagesByType]);

  const handleInteraction = useCallback(() => {
    setState(prev => ({
      ...prev,
      lastInteraction: new Date()
    }));

    if (timersRef.current.interaction) {
      clearTimeout(timersRef.current.interaction);
    }

    timersRef.current.interaction = setTimeout(() => {
      if (onInteraction) onInteraction();
    }, interactionDelay);
  }, [interactionDelay, onInteraction]);

  const toggleCollapse = useCallback(() => {
    setState(prev => {
      const nextCollapsed = !prev.isCollapsed;
      if (nextCollapsed && onCollapse) onCollapse();
      if (!nextCollapsed && onExpand) onExpand();
      return { ...prev, isCollapsed: nextCollapsed };
    });
  }, [onCollapse, onExpand]);

  const expand = useCallback(() => {
    setState(prev => {
      if (!prev.isCollapsed) return prev;
      if (onExpand) onExpand();
      return { ...prev, isCollapsed: false };
    });
  }, [onExpand]);

  const collapse = useCallback(() => {
    setState(prev => {
      if (prev.isCollapsed) return prev;
      if (onCollapse) onCollapse();
      return { ...prev, isCollapsed: true };
    });
  }, [onCollapse]);

  const pauseAutoCollapse = useCallback(() => {
    setState(prev => ({ ...prev, pauseAutoCollapse: true }));
    clearTimers();
  }, [clearTimers]);

  const resumeAutoCollapse = useCallback(() => {
    setState(prev => ({ ...prev, pauseAutoCollapse: false }));
    handleInteraction();
  }, [handleInteraction]);

  const handleMessageClick = useCallback((message: ValidationMessage) => {
    if (onMessageClick) onMessageClick(message);
  }, [onMessageClick]);

  const handleMessageFocus = useCallback((index: number) => {
    setState(prev => ({ ...prev, focusedMessageIndex: index }));

    if (timersRef.current.focus) {
      clearTimeout(timersRef.current.focus);
    }

    timersRef.current.focus = setTimeout(() => {
      if (onFocus && messages[index]) {
        onFocus(messages[index]);
      }
      setState(prev => ({ ...prev, focusedMessageIndex: null }));
    }, focusDelay);
  }, [messages, focusDelay, onFocus]);

  const severityStats = useMemo(() => {
    const stats = messages.reduce((acc, msg) => {
      acc[msg.severity]++;
      acc.total++;
      return acc;
    }, {
      error: 0,
      warning: 0,
      info: 0,
      total: 0
    } as Omit<SeverityStats, 'highestSeverity' | 'hasMixedSeverity'>);

    const highestSeverity = stats.error > 0 ? 'error' 
      : stats.warning > 0 ? 'warning' 
      : 'info';

    const hasMixedSeverity = (stats.error + stats.warning + stats.info) > 1;

    return {
      ...stats,
      highestSeverity,
      hasMixedSeverity
    };
  }, [messages]);

  const messagesByType = useMemo(() => {
    return messages.reduce((acc, msg) => {
      if (!acc[msg.severity]) acc[msg.severity] = [];
      acc[msg.severity].push(msg);
      return acc;
    }, {} as Record<ValidationSeverity, ValidationMessage[]>);
  }, [messages]);

  const toggleGroup = useCallback((severity: ValidationSeverity) => {
    setState(prev => ({
      ...prev,
      messageGroups: {
        ...prev.messageGroups,
        [severity]: {
          ...prev.messageGroups[severity],
          expanded: !prev.messageGroups[severity].expanded
        }
      }
    }));
  }, []);

  const expandAllGroups = useCallback(() => {
    setState(prev => ({
      ...prev,
      messageGroups: Object.entries(prev.messageGroups).reduce((acc, [key, group]) => ({
        ...acc,
        [key]: { ...group, expanded: true }
      }), {} as Record<ValidationSeverity, MessageGroup>)
    }));
  }, []);

  const collapseAllGroups = useCallback(() => {
    setState(prev => ({
      ...prev,
      messageGroups: Object.entries(prev.messageGroups).reduce((acc, [key, group]) => ({
        ...acc,
        [key]: { ...group, expanded: false }
      }), {} as Record<ValidationSeverity, MessageGroup>)
    }));
  }, []);

  const visibleMessages = useMemo(() => {
    return Object.values(state.messageGroups)
      .filter(group => group.expanded)
      .flatMap(group => group.messages);
  }, [state.messageGroups]);

  const hasEmptyGroups = useMemo(() => {
    return Object.values(state.messageGroups).every(group => group.messages.length === 0);
  }, [state.messageGroups]);

  const nonEmptyGroups = useMemo(() => {
    return Object.entries(state.messageGroups)
      .filter(([key, group]) => group.messages.length > 0)
      .map(([key, group]) => key);
  }, [state.messageGroups]);

  const toggleAutoExpand = useCallback((enabled: boolean) => {
    setState(prev => ({
      ...prev,
      config: {
        ...prev.config,
        autoExpandDelay: enabled ? prev.config.autoExpandDelay : undefined
      }
    }));
  }, [state.config.autoExpandDelay]);

  const resetGroups = useCallback(() => {
    setState(prev => ({
      ...prev,
      messageGroups: {
        error: { severity: 'error', messages: [], expanded: true },
        warning: { severity: 'warning', messages: [], expanded: true },
        info: { severity: 'info', messages: [], expanded: true }
      }
    }));
  }, []);

  return {
    isCollapsed: state.isCollapsed,
    toggleCollapse,
    expand,
    collapse,
    pauseAutoCollapse,
    resumeAutoCollapse,
    handleInteraction,
    handleMessageFocus,
    severityStats,
    hasMultipleMessages: severityStats.total > 1,
    messagesByType,
    handleMessageClick,
    focusedMessageIndex: state.focusedMessageIndex,
    messageGroups: state.messageGroups,
    visibleMessages,
    toggleGroup,
    expandAllGroups,
    collapseAllGroups,
    hasEmptyGroups,
    nonEmptyGroups,
    toggleAutoExpand,
    resetGroups
  };
};

export const alertVariants = {
  container: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
  },
  messages: {
    hidden: { height: 0, opacity: 0 },
    visible: { height: 'auto', opacity: 1 },
    exit: { height: 0, opacity: 0 }
  },
  message: {
    hidden: { x: -20, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.1 }
    })
  },
  button: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  }
};

export const alertTransition = {
  duration: 0.2,
  ease: 'easeInOut'
}; 
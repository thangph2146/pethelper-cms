export const TRACKING_EVENTS = {
  POST: {
    VIEW: 'post_view',
    INTERACTION: 'post_interaction',
    ERROR: 'post_error',
    LOADING: 'post_loading',
    STATE_CHANGE: 'post_state_change'
  }
} as const;

export const TRACKING_COMPONENTS = {
  POST_CARD: 'PostCard',
  POST_CONTENT: 'PostContent',
  POST_ACTIONS: 'PostActions',
  POST_DIALOGS: 'PostDialogs'
} as const;

export const TRACKING_ACTIONS = {
  LIKE: 'like',
  SAVE: 'save',
  SHARE: 'share',
  COMMENT: 'comment',
  DELETE: 'delete',
  REPORT: 'report'
} as const; 
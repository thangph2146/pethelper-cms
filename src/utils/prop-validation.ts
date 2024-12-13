import PropTypes from 'prop-types';
import type { PostPropTypes } from '@/types/post';

export const POST_PROP_TYPES = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    author: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string
    }).isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['need_help', 'helping', 'helped']).isRequired,
    urgency: PropTypes.oneOf(['high', 'medium', 'low']).isRequired,
    location: PropTypes.string,
    contactInfo: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    viewCount: PropTypes.number
  }).isRequired,
  className: PropTypes.string,
  disableInteractions: PropTypes.bool,
  showPreview: PropTypes.bool,
  showQuickActions: PropTypes.bool,
  showMenu: PropTypes.bool,
  onCardClick: PropTypes.func
} satisfies PropTypes.InferProps<PostPropTypes>;

export const POST_DEFAULT_PROPS = {
  className: '',
  disableInteractions: false,
  showPreview: true,
  showQuickActions: true,
  showMenu: true
} satisfies Partial<PostPropTypes>; 
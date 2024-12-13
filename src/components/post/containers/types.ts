import type { 
  ContentHandlers,
  HeaderHandlers,
  ContentDataHandlers,
  FooterHandlers,
  QuickActionHandlers 
} from './handlers';
import type {
  LoadingState,
  ContentStats
} from './states';
import type {
  HeaderData,
  ContentData,
  FooterData,
  QuickActionData,
  CardData
} from './data';

// Content component props
export interface RenderProps {
  header: HeaderData & HeaderHandlers;
  content: ContentData & ContentDataHandlers;
  footer: FooterData & FooterHandlers;
  quickActions: QuickActionData & QuickActionHandlers;
  loading: LoadingState;
}

export interface ContentProps {
  cardProps: CardData;
  renderProps: RenderProps;
} 
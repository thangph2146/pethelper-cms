export interface IPost {
  _id: string;
  title: string;
  content: string;
  category: 'dog' | 'cat' | 'other';
  status: 'need-help' | 'being-helped' | 'helped';
  urgency: 'high' | 'medium' | 'low';
  location: string;
  description: string;
  contactInfo: string;
  images: string[];
  author: {
    _id: string;
    name: string;
    email: string;
  };
  contact: {
    phone: string;
    email?: string;
  };
  likes: string[];
  comments: {
    _id: string;
    user: {
      _id: string;
      name: string;
    };
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
  animalType?: string;
  $assertPopulated?: <T>() => T;
  $clearModifiedPaths?: () => void;
  $clone?: () => IPost;
}

export interface CreatePostData {
  title: string;
  content: string;
  image_url?: string;
  category_id?: string;
  tags?: string[];
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  image_url?: string;
  category_id?: string;
  tags?: string[];
  status?: 'draft' | 'published' | 'archived';
}

export interface PostFilters {
  category?: string;
  tag?: string;
  user_id?: string;
  status?: 'draft' | 'published' | 'archived';
  search?: string;
}

export interface PostsResponse {
  data: IPost[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface PostStats {
  views: number;
  likes: number;
  comments: number;
  shares: number;
}
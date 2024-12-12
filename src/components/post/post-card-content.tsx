import { memo } from 'react';
import { Card } from '@/components/ui/card';
import { PostRender } from './post-render';
import type { PostRenderProps } from '@/types/post';

interface PostCardContentProps {
  cardProps: {
    className: string;
    onClick: () => void;
    'data-testid': string;
    'aria-disabled': boolean;
  };
  renderProps: PostRenderProps;
}

export const PostCardContent = memo(({
  cardProps,
  renderProps
}: PostCardContentProps) => {
  return (
    <Card {...cardProps}>
      <PostRender 
        props={renderProps}
        data-testid="post-render"
      />
    </Card>
  );
});

PostCardContent.displayName = 'PostCardContent'; 
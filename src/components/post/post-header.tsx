import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { POST_STATUS_LABELS } from '@/types/post';

interface PostHeaderProps {
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  date: string;
  status: string;
  statusColor: string;
}

export const PostHeader = memo(({ author, date, status, statusColor }: PostHeaderProps) => {
  const router = useRouter();
  
  const navigateToProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/profile/${author.id}`);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Avatar
          className="cursor-pointer hover:ring-2 ring-primary/20 transition-all"
          onClick={navigateToProfile}
        >
          <AvatarImage src={author.avatar} />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p 
            className="font-medium hover:text-primary transition-colors cursor-pointer"
            onClick={navigateToProfile}
          >
            {author.name}
          </p>
          <p className="text-sm text-muted-foreground">{date}</p>
        </div>
      </div>

      <Badge variant="secondary" className={cn("transition-colors", statusColor)}>
        {POST_STATUS_LABELS[status]}
      </Badge>
    </div>
  );
}); 
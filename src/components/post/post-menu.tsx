import { memo } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Trash, Flag, Share } from 'lucide-react';
import { POST_MENU_ACTIONS, POST_MENU_ITEMS } from '@/constants/post';

interface PostMenuProps {
  isAuthor: boolean;
  onAction: (action: string) => void;
  isLoading?: boolean;
}

export const PostMenu = memo(({ 
  isAuthor, 
  onAction,
  isLoading 
}: PostMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={isLoading}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isAuthor && (
          <DropdownMenuItem
            onClick={() => onAction(POST_MENU_ACTIONS.DELETE)}
            className="text-red-500 focus:text-red-500"
          >
            <Trash className="h-4 w-4 mr-2" />
            {POST_MENU_ITEMS.DELETE}
          </DropdownMenuItem>
        )}
        {!isAuthor && (
          <DropdownMenuItem onClick={() => onAction(POST_MENU_ACTIONS.REPORT)}>
            <Flag className="h-4 w-4 mr-2" />
            {POST_MENU_ITEMS.REPORT}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => onAction(POST_MENU_ACTIONS.SHARE)}>
          <Share className="h-4 w-4 mr-2" />
          {POST_MENU_ITEMS.SHARE}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}); 
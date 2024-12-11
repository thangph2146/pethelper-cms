import { 
  FacebookShareButton, 
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon
} from 'react-share';
import { toast } from 'react-hot-toast';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
}

export const ShareButtons = ({ 
  url, 
  title, 
  description = '', 
  hashtags = ['cứutrợđộngvật', 'helpanimals'] 
}: ShareButtonsProps) => {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Đã sao chép liên kết!');
    } catch (err) {
      toast.error('Không thể sao chép liên kết');
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <FacebookShareButton 
        url={url} 
        quote={`${title}\n\n${description}`}
        hashtag={`#${hashtags[0]}`}
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton 
        url={url} 
        title={title}
        hashtags={hashtags}
        related={['rescueanimals']}
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <TelegramShareButton 
        url={url} 
        title={title}
      >
        <TelegramIcon size={32} round />
      </TelegramShareButton>

      <WhatsappShareButton 
        url={url} 
        title={title}
        separator=" - "
      >
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
          />
        </svg>
        Sao chép liên kết
      </button>
    </div>
  );
}; 
import Image from 'next/image';
import type { IUser } from '@/types/post';

interface AvatarProps {
  user: IUser;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16'
};

export default function Avatar({ user, size = 'sm' }: AvatarProps) {
  return (
    <div className={`${sizes[size]} rounded-full bg-gray-200 relative overflow-hidden`}>
      {user.image ? (
        <Image
          src={user.image}
          alt={user.name}
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
          {user.name[0].toUpperCase()}
        </div>
      )}
    </div>
  );
} 
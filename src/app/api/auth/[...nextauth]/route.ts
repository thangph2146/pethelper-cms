import NextAuth from 'next-auth';
import { connectToMongoDB } from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';

// Kết nối MongoDB trước khi khởi tạo NextAuth
connectToMongoDB();
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export { authOptions };

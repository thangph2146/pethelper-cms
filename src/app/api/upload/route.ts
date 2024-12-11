import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { message: 'Không tìm thấy file' },
        { status: 400 }
      );
    }

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'Chỉ chấp nhận file ảnh' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    return NextResponse.json(
      { message: 'Lỗi khi upload ảnh' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { key } = await request.json();
    if (!key) {
      return NextResponse.json(
        { message: 'Thiếu key của ảnh' },
        { status: 400 }
      );
    }

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
      })
    );

    return NextResponse.json({ message: 'Xóa ảnh thành công' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Lỗi khi xóa ảnh' },
      { status: 500 }
    );
  }
} 
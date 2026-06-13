import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import sharp from 'sharp';
import { put } from '@vercel/blob';

const fontPath = join(process.cwd(), 'src/fonts/watermark-font.otf');

async function addWatermark(buffer: Buffer, width: number, height: number) {
  const fontSize = Math.round(Math.max(width, height) * 0.1);
  const text = '@都在这了';

  const textImage = await sharp({
    text: {
      text,
      fontfile: fontPath,
      fontSize: fontSize,
      rgba: true,
    },
  })
    .png()
    .toBuffer();

  const textMeta = await sharp(textImage).metadata();
  const tw = textMeta.width || 0;
  const th = textMeta.height || 0;

  const extended = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: textImage,
        left: Math.floor((width - tw) / 2),
        top: Math.floor((height - th) / 2),
      },
    ])
    .png()
    .toBuffer();

  const rotated = await sharp(extended)
    .rotate(-25, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  return sharp(buffer)
    .composite([{ input: rotated, top: 0, left: 0 }])
    .toBuffer();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: '没有上传文件' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const metadata = await sharp(buffer).metadata();
    const { width = 800, height = 600 } = metadata;

    const watermarked = await addWatermark(buffer, width, height);

    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

    if (blobToken) {
      try {
        const blob = await put(`uploads/${Date.now()}.png`, watermarked, {
          access: 'public',
          contentType: 'image/png',
        });
        return NextResponse.json({ success: true, url: blob.url });
      } catch (blobError) {
        const msg = blobError instanceof Error ? blobError.message : 'Blob upload failed';
        console.error('Blob 上传失败:', blobError);
        return NextResponse.json(
          { success: false, error: `Blob 上传失败: ${msg}` },
          { status: 500 }
        );
      }
    }

    if (process.env.VERCEL) {
      return NextResponse.json(
        { success: false, error: '未配置 Blob Storage，请在 Vercel 项目 Settings > Environment Variables 中添加 BLOB_READ_WRITE_TOKEN' },
        { status: 500 }
      );
    }

    const filename = `${Date.now()}-${file.name.replace(/\.[^.]+$/, '')}.png`;
    const publicDir = join(process.cwd(), 'public');

    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }

    const filepath = join(publicDir, filename);
    await writeFile(filepath, watermarked);

    return NextResponse.json({ success: true, url: `/${filename}` });
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知错误';
    console.error('上传失败:', error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { join } from 'path';
import sharp from 'sharp';

const fontPath = join(process.cwd(), 'src/fonts/watermark-font.otf');

export async function GET() {
  const results: Record<string, boolean | string | number> = {};

  results.hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;
  results.hasKvUrl = !!process.env.KV_REST_API_URL;
  results.isVercel = !!process.env.VERCEL;

  const { existsSync } = await import('fs');
  results.fontFileExists = existsSync(fontPath);

  try {
    // @ts-expect-error fontSize exists at runtime in sharp 0.33+
    const textImage = await sharp({
      text: {
        text: '@都在这了',
        fontfile: fontPath,
        fontSize: 48,
        rgba: true,
      },
    })
      .png()
      .toBuffer();
    results.textRenderWorks = textImage.length > 0;

    const meta = await sharp(textImage).metadata();
    results.textImageWidth = meta.width || 0;
    results.textImageHeight = meta.height || 0;
  } catch (e: any) {
    results.textRenderError = e.message || String(e);
  }

  return NextResponse.json(results);
}

import { NextResponse } from 'next/server';

export async function GET() {
  const results: Record<string, boolean | string> = {};

  results.hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;
  results.hasKvUrl = !!process.env.KV_REST_API_URL;
  results.hasUpstashUrl = !!process.env.UPSTASH_REDIS_REST_URL;

  try {
    const sharp = await import('sharp');
    results.sharpLoaded = true;
    results.sharpVersion = sharp.default?.versions?.sharp || 'unknown';

    const svg = `<svg width="100" height="100"><text x="10" y="50" font-size="20">test</text></svg>`;
    const result = await sharp.default(Buffer.from(svg)).png().toBuffer();
    results.sharpWorks = result.length > 0;
  } catch (e: any) {
    results.sharpError = e.message || String(e);
  }

  return NextResponse.json(results);
}

import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { RedeemCode } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, courseId } = body;

    const codeData = await kv.get<RedeemCode>(`code:${code}`);

    if (!codeData) {
      return NextResponse.json({ success: false, error: '兑换码无效' });
    }

    if (codeData.remainingUses <= 0) {
      return NextResponse.json({ success: false, error: '兑换码已用完' });
    }

    if (codeData.usedFiles.includes(courseId)) {
      return NextResponse.json({ success: false, error: '该课件已解锁，无需重复兑换' });
    }

    codeData.usedFiles.push(courseId);
    codeData.remainingUses -= 1;

    await kv.set(`code:${code}`, codeData);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '解锁失败' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ success: false, error: '缺少兑换码' }, { status: 400 });
    }

    const codeData = await kv.get<RedeemCode>(`code:${code}`);

    if (!codeData) {
      return NextResponse.json({ success: false, error: '兑换码无效' });
    }

    return NextResponse.json({ success: true, code: codeData });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '查询失败' },
      { status: 500 }
    );
  }
}
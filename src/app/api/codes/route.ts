import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { RedeemCode } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const adminPassword = searchParams.get('adminPassword');

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { success: false, error: '管理员密码错误' },
      { status: 401 }
    );
  }

  try {
    const keys = await kv.keys('code:*');
    const codes = await Promise.all(
      keys.map(async (key) => await kv.get<RedeemCode>(key as string))
    );

    const validCodes = codes.filter((c): c is RedeemCode => c !== null);

    return NextResponse.json({ success: true, codes: validCodes });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取兑换码列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, count, adminPassword } = body;

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: '管理员密码错误' },
        { status: 401 }
      );
    }

    const generatedCodes: string[] = [];

    for (let i = 0; i < count; i++) {
      const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      const code = `${type}${randomStr}`;

      const codeData: RedeemCode = {
        code,
        type,
        remainingUses: type === 'A' ? 1 : 2,
        usedFiles: [],
        createdAt: new Date().toISOString(),
      };

      await kv.set(`code:${code}`, codeData);
      generatedCodes.push(code);
    }

    return NextResponse.json({ success: true, codes: generatedCodes });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '生成兑换码失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const adminPassword = searchParams.get('adminPassword');

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: '管理员密码错误' },
        { status: 401 }
      );
    }

    await kv.del(`code:${code}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '删除兑换码失败' },
      { status: 500 }
    );
  }
}
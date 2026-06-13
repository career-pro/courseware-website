import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@/lib/kv';
import { Course } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || '';

  try {
    let courses = await kv.get<Course[]>('courses') || [];

    if (category) {
      courses = courses.filter((c) => c.category === category);
    }

    return NextResponse.json({ success: true, courses });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取课件列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { course, adminPassword } = body;

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: '管理员密码错误' },
        { status: 401 }
      );
    }

    const courses = await kv.get<Course[]>('courses') || [];
    courses.push({ ...course, id: Date.now().toString(), createdAt: new Date().toISOString() });
    await kv.set('courses', courses);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '添加课件失败' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { course, adminPassword } = body;

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: '管理员密码错误' },
        { status: 401 }
      );
    }

    const courses = await kv.get<Course[]>('courses') || [];
    const index = courses.findIndex((c) => c.id === course.id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: '课件不存在' },
        { status: 404 }
      );
    }

    courses[index] = course;
    await kv.set('courses', courses);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '更新课件失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const adminPassword = searchParams.get('adminPassword');

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: '管理员密码错误' },
        { status: 401 }
      );
    }

    const courses = await kv.get<Course[]>('courses') || [];
    const filteredCourses = courses.filter((c) => c.id !== id);

    await kv.set('courses', filteredCourses);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '删除课件失败' },
      { status: 500 }
    );
  }
}
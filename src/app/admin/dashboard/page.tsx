'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Ticket, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth !== 'true') {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-full flex flex-col">
      <div className="max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">管理后台</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>退出登录</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <a
            href="/admin/courses"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow block"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">课件管理</h2>
            </div>
            <p className="text-gray-600">添加、编辑、删除课件资源</p>
          </a>

          <a
            href="/admin/codes"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow block"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Ticket className="w-8 h-8 text-yellow-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">兑换码管理</h2>
            </div>
            <p className="text-gray-600">生成和管理兑换码</p>
          </a>
        </div>
      </div>
    </div>
  );
}
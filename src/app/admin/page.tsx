'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem('adminAuth', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('密码错误');
      setPassword('');
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Lock className="w-8 h-8 text-purple-500" />
          <h1 className="text-2xl font-bold text-gray-800">管理后台登录</h1>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              管理员密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="请输入管理员密码"
            />
          </div>

          {error && (
            <div className="mb-6 text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  );
}
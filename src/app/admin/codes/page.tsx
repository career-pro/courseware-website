'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, Copy, RefreshCw } from 'lucide-react';
import { RedeemCode } from '@/types';

export default function AdminCodes() {
  const router = useRouter();
  const [codes, setCodes] = useState<RedeemCode[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showGenerateForm, setShowGenerateForm] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth !== 'true') {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      fetchCodes();
    }
  }, [router]);

  const fetchCodes = async () => {
    try {
      const response = await fetch(`/api/codes?adminPassword=${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`);
      const data = await response.json();
      if (data.success) {
        setCodes(data.codes || []);
      }
    } catch (error) {
      console.error('获取兑换码列表失败:', error);
    }
  };

  const generateCodes = async (type: 'A' | 'B', count: number) => {
    setGenerating(true);
    try {
      const response = await fetch('/api/codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          count,
          adminPassword: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`成功生成 ${count} 个兑换码：\n${data.codes.join('\n')}`);
        setShowGenerateForm(false);
        fetchCodes();
      } else {
        alert('生成失败: ' + data.error);
      }
    } catch (error) {
      alert('生成失败，请重试');
    } finally {
      setGenerating(false);
    }
  };

  const deleteCode = async (code: string) => {
    if (!confirm('确定要删除这个兑换码吗？')) return;

    try {
      const response = await fetch(`/api/codes?code=${code}&adminPassword=${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchCodes();
      } else {
        alert('删除失败: ' + data.error);
      }
    } catch (error) {
      alert('删除失败，请重试');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-full flex flex-col">
      <div className="max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <a
            href="/admin/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </a>
          <button
            onClick={() => setShowGenerateForm(!showGenerateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            {showGenerateForm ? <RefreshCw className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showGenerateForm ? '收起' : '生成兑换码'}</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">兑换码管理</h1>

        {showGenerateForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">生成新兑换码</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">兑换码类型</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => generateCodes('A', 1)}
                    disabled={generating}
                    className="flex-1 p-4 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all disabled:opacity-50"
                  >
                    <div className="font-bold text-lg text-blue-600 mb-1">A码</div>
                    <div className="text-sm text-gray-600">解锁 1 个课件</div>
                  </button>

                  <button
                    onClick={() => generateCodes('B', 1)}
                    disabled={generating}
                    className="flex-1 p-4 border-2 border-yellow-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-all disabled:opacity-50"
                  >
                    <div className="font-bold text-lg text-yellow-600 mb-1">B码</div>
                    <div className="text-sm text-gray-600">解锁 2 个课件</div>
                  </button>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">批量生成</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => generateCodes('A', 10)}
                    disabled={generating}
                    className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
                  >
                    生成 10 个A码
                  </button>
                  <button
                    onClick={() => generateCodes('B', 10)}
                    disabled={generating}
                    className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50"
                  >
                    生成 10 个B码
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4">
          {codes.map((codeData) => (
            <div key={codeData.code} className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${codeData.type === 'A' ? 'bg-blue-100' : 'bg-yellow-100'}`}>
                    <span className={`font-bold text-xl ${codeData.type === 'A' ? 'text-blue-600' : 'text-yellow-600'}`}>
                      {codeData.type}码
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-lg font-bold text-gray-800">{codeData.code}</code>
                      <button
                        onClick={() => copyToClipboard(codeData.code)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      剩余次数: {codeData.remainingUses}
                      {codeData.usedFiles.length > 0 && ` | 已解锁: ${codeData.usedFiles.length} 个`}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteCode(codeData.code)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {codes.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-md">
            <p>暂无兑换码，点击上方按钮生成</p>
          </div>
        )}
      </div>
    </div>
  );
}
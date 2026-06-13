'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories } from '@/lib/constants';
import { BookOpen, MessageCircle, Copy, Check } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [showContact, setShowContact] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('Lunya955x');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <span className="text-lg font-bold text-gray-800">首页</span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={cat.path}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    pathname === cat.path
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 hover:bg-blue-100'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>

            <button
              onClick={() => setShowContact(true)}
              className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>联系我们</span>
            </button>
          </div>
        </div>
      </div>

      {showContact && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowContact(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">添加微信联系</h3>
            <p className="text-gray-500 text-sm mb-6">购买兑换码或咨询课件资源</p>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-400 mb-1">微信号</p>
              <p className="text-2xl font-bold text-gray-800 tracking-wide">Lunya955x</p>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? '已复制' : '复制微信号'}</span>
            </button>
            <button
              onClick={() => setShowContact(false)}
              className="mt-3 text-sm text-gray-400 hover:text-gray-500"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
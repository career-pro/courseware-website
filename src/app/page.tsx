import Link from 'next/link';
import { categories } from '@/lib/constants';

export default function Home() {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-12 py-12">
            <p className="text-xl md:text-2xl text-gray-700 mb-4">
              精选主题班会、课件和原创绘本资源
            </p>
            <p className="text-xl md:text-2xl text-gray-700">
              助力精彩课堂
            </p>
            <div className="h-0.5 w-16 bg-gray-300 rounded-full mx-auto mt-5"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.path}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <span className="text-6xl">{cat.emoji}</span>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{cat.name}</h2>
                  <p className="text-gray-600 text-sm">点击查看资源</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">如何获取资源？</h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start gap-3">
                <span className="text-green-500 font-bold text-xl">✓</span>
                <p>免费课件：直接点击下载链接获取</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 font-bold text-xl">⭐</span>
                <p>付费课件：输入兑换码后解锁下载链接</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 font-bold text-xl">💡</span>
                <p>支持搜索和标签筛选，快速找到需要的资源</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
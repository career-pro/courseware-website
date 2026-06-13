'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Unlock, Download, Filter } from 'lucide-react';
import { Course } from '@/types';

interface CategoryPageProps {
  category: 'meetings' | 'courseware' | 'picture-books';
  categoryName: string;
}

export default function CategoryPage({ category, categoryName }: CategoryPageProps) {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [unlockedFiles, setUnlockedFiles] = useState<Set<string>>(new Set());
  const [redeemCode, setRedeemCode] = useState('');
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [codeError, setCodeError] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [category]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`/api/courses?category=${category}`);
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('获取课件列表失败:', error);
    }
  };

  const allTags = Array.from(new Set(courses.flatMap((c) => c.tags)));

  const filteredCourses = courses.filter((course) => {
    const term = searchTerm.toLowerCase();
    const matchSearch = !term || (
      course.title.toLowerCase().includes(term) ||
      (course.detailInfo || '').toLowerCase().includes(term) ||
      course.tags.some((t: string) => t.toLowerCase().includes(term))
    );
    const matchTag = !selectedTag || course.tags.includes(selectedTag);
    return matchSearch && matchTag;
  });

  const handleUnlock = async () => {
    try {
      const response = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: redeemCode,
          courseId: selectedCourseId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUnlockedFiles((prev) => new Set(prev).add(selectedCourseId));
        setShowUnlockModal(false);
        setRedeemCode('');
        setCodeError('');
      } else {
        setCodeError(data.error || '兑换码无效');
      }
    } catch (error) {
      setCodeError('网络错误，请重试');
    }
  };

  const getUnlockCount = (code: string) => {
    const type = code.toUpperCase().startsWith('A') ? 1 : 2;
    return type;
  };

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">{categoryName}</h1>

          <div className="bg-white rounded-xl shadow-md p-4 mb-6 sticky top-20 z-10">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索标题、标签..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                    selectedTag
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">{selectedTag || '筛选'}</span>
                </button>
                {showFilter && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-2 w-48 z-20 max-h-64 overflow-y-auto">
                    <button
                      onClick={() => { setSelectedTag(''); setShowFilter(false); }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        !selectedTag ? 'text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      全部
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => { setSelectedTag(tag); setShowFilter(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          selectedTag === tag ? 'text-blue-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {selectedTag && (
              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-gray-500">当前筛选：</span>
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {selectedTag}
                  <button onClick={() => setSelectedTag('')} className="hover:text-blue-900">&times;</button>
                </span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => router.push(`/course/${course.id}`)}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-yellow-100 flex items-center justify-center">
                  <Image
                    src={course.coverImage}
                    alt={course.title}
                    width={0}
                    height={0}
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="w-full h-full object-contain p-2"
                  />
                  {course.isFree ? (
                    <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      免费
                    </span>
                  ) : (
                    <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      付费
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.detailInfo || course.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {course.isFree ? (
                    <div className="flex items-center justify-center gap-2 w-full bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-medium">
                      <Download className="w-4 h-4" />
                      <span>点击查看下载链接</span>
                    </div>
                  ) : unlockedFiles.has(course.id) ? (
                    <div className="flex items-center justify-center gap-2 w-full bg-green-50 text-green-600 py-2 rounded-lg text-sm font-medium">
                      <Download className="w-4 h-4" />
                      <span>已解锁 · 点击查看链接</span>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCourseId(course.id);
                        setShowUnlockModal(true);
                      }}
                      className="flex items-center justify-center gap-2 w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      <Unlock className="w-4 h-4" />
                      <span>输入兑换码解锁</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>没有找到相关课件</p>
            </div>
          )}
        </div>
      </div>

      {showUnlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4">输入兑换码</h2>

            <div className="mb-4">
              <input
                type="text"
                placeholder="请输入兑换码（如：A123456）"
                value={redeemCode}
                onChange={(e) => {
                  setRedeemCode(e.target.value.toUpperCase());
                  setCodeError('');
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {codeError && (
              <div className="text-red-500 text-sm mb-4">{codeError}</div>
            )}

            {redeemCode && !codeError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  此兑换码可使用 <strong>{getUnlockCount(redeemCode)}</strong> 次，确定解锁这个课件吗？
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUnlockModal(false);
                  setRedeemCode('');
                  setCodeError('');
                }}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleUnlock}
                disabled={!redeemCode}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                解锁
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
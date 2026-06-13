'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Unlock, X } from 'lucide-react';
import { useUnlocked } from '@/lib/useUnlocked';

export default function CourseDetail() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<any>(null);
  const [redeemCode, setRedeemCode] = useState('');
  const { unlock, isUnlocked } = useUnlocked();
  const [codeError, setCodeError] = useState('');
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      if (data.success) {
        const found = data.courses?.find((c: any) => c.id === courseId);
        if (found) {
          setCourse(found);
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('获取课件详情失败:', error);
      router.push('/');
    }
  };

  const handleUnlock = async () => {
    try {
      const response = await fetch('/api/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: redeemCode,
          courseId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        unlock(courseId);
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

  if (!course) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col">
      <div className="max-w-4xl mx-auto px-4 py-8 w-full">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回</span>
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div
            className="relative w-full cursor-pointer bg-gray-100 flex items-center justify-center"
            onClick={() => setLightboxImage(course.coverImage)}
          >
            <Image
              src={course.coverImage}
              alt={course.title}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto max-h-96 object-contain"
            />
            {course.isFree ? (
              <span className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                免费
              </span>
            ) : (
              <span className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                付费
              </span>
            )}
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{course.title}</h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {course.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {course.detailInfo && (
              <div className="mb-6">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{course.detailInfo}</p>
              </div>
            )}
            {!course.detailInfo && course.description && (
              <p className="text-gray-600 mb-6 leading-relaxed">{course.description}</p>
            )}

            {course.detailImages && course.detailImages.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-3">内容预览</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {course.detailImages.map((img: string, i: number) => (
                    <div
                      key={i}
                      className="bg-gray-100 rounded-lg overflow-hidden cursor-pointer flex items-center justify-center"
                      onClick={() => setLightboxImage(img)}
                    >
                      <Image
                        src={img}
                        alt={`${course.title} 预览 ${i + 1}`}
                        width={0}
                        height={0}
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="w-full h-auto max-h-72 object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 pt-6">
              {course.isFree || isUnlocked(courseId) ? (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <h3 className="text-sm font-medium text-blue-600 mb-2">下载链接</h3>
                  <p className="text-gray-800 whitespace-pre-wrap break-all text-sm leading-relaxed">
                    {course.downloadLink}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setShowUnlockModal(true)}
                  className="flex items-center justify-center gap-2 w-full bg-yellow-500 text-white py-4 rounded-lg hover:bg-yellow-600 transition-colors font-medium text-lg"
                >
                  <Unlock className="w-5 h-5" />
                  <span>输入兑换码解锁下载链接</span>
                </button>
              )}
            </div>
          </div>
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

      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxImage('')}
        >
          <button
            onClick={() => setLightboxImage('')}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightboxImage}
            alt="预览大图"
            className="max-w-full max-h-[90vh] object-contain select-none"
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
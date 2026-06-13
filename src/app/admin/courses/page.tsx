'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, ArrowLeft, Save, X, Upload } from 'lucide-react';
import { Course } from '@/types';

export default function AdminCourses() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth !== 'true') {
      router.push('/admin');
    } else {
      setIsAuthenticated(true);
      fetchCourses();
    }
  }, [router]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('获取课件列表失败:', error);
    }
  };

  const handleSave = async (course: Course) => {
    try {
      const response = await fetch('/api/courses', {
        method: course.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course: { ...course, tags: tagsInput.split(/[,，]/).map(t => t.trim()).filter(Boolean) },
          adminPassword: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEditingCourse(null);
        setIsAdding(false);
        setTagsInput('');
        fetchCourses();
      } else {
        alert('保存失败: ' + data.error);
      }
    } catch (error) {
      alert('保存失败，请重试');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个课件吗？')) return;

    try {
      const response = await fetch(`/api/courses?id=${id}&adminPassword=${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchCourses();
      } else {
        alert('删除失败: ' + data.error);
      }
    } catch (error) {
      alert('删除失败，请重试');
    }
  };

  const startEditing = (course: Course) => {
    setEditingCourse(course);
    setTagsInput(course.tags.join('，'));
  };

  const startAdding = () => {
    setEditingCourse({
      id: '',
      title: '',
      description: '',
      category: 'meetings',
      coverImage: '',
      detailImages: [],
      detailInfo: '',
      downloadLink: '',
      tags: [],
      isFree: false,
      createdAt: '',
    });
    setIsAdding(true);
    setTagsInput('');
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
            onClick={startAdding}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>添加课件</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">课件管理</h1>

        {isAdding && editingCourse && (
          <CourseForm
            course={editingCourse}
            tagsInput={tagsInput}
            setTagsInput={setTagsInput}
            onSave={handleSave}
            onCancel={() => {
              setEditingCourse(null);
              setIsAdding(false);
              setTagsInput('');
            }}
          />
        )}

        {editingCourse && !isAdding && (
          <CourseForm
            course={editingCourse}
            tagsInput={tagsInput}
            setTagsInput={setTagsInput}
            onSave={handleSave}
            onCancel={() => {
              setEditingCourse(null);
              setTagsInput('');
            }}
          />
        )}

        <div className="grid gap-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-gray-800">{course.title}</h3>
                    {course.isFree ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        免费
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                        付费
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {course.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(course)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && !isAdding && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-md">
            <p>暂无课件，点击上方按钮添加</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CourseForm({
  course,
  tagsInput,
  setTagsInput,
  onSave,
  onCancel,
}: {
  course: Course;
  tagsInput: string;
  setTagsInput: (value: string) => void;
  onSave: (course: Course) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(course);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData((prev) => ({ ...prev, coverImage: data.url }));
      } else {
        alert('上传失败: ' + data.error);
      }
    } catch (error) {
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const handleDetailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadForm = new FormData();
      uploadForm.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadForm,
      });

      const data = await response.json();

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          detailImages: [...(prev.detailImages || []), data.url],
        }));
      } else {
        alert('上传失败: ' + data.error);
      }
    } catch (error) {
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {formData.id ? '编辑课件' : '添加课件'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="meetings">主题班会</option>
            <option value="courseware">课件</option>
            <option value="picture-books">绘本</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">封面图片</label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="file"
                id="cover-upload"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
              <label
                htmlFor="cover-upload"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>上传图片</span>
              </label>
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="或输入图片URL"
              />
            </div>
            {formData.coverImage && (
              <img
                src={formData.coverImage}
                alt="预览"
                className="w-48 h-32 object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">详细信息</label>
          <textarea
            value={formData.detailInfo || ''}
            onChange={(e) => setFormData({ ...formData, detailInfo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="适用年级、课时数量、教学内容等..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">详情图片（可多张）</label>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {(formData.detailImages || []).map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt={`详情图 ${i + 1}`} className="w-24 h-24 object-cover rounded-lg" />
                  <button
                    onClick={() => {
                      const images = [...(formData.detailImages || [])];
                      images.splice(i, 1);
                      setFormData({ ...formData, detailImages: images });
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center"
                  >
                    x
                  </button>
                </div>
              ))}
              <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDetailUpload}
                  className="hidden"
                />
                <span className="text-gray-400 text-2xl">+</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">下载链接</label>
          <input
            type="text"
            value={formData.downloadLink}
            onChange={(e) => setFormData({ ...formData, downloadLink: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://pan.baidu.com/s/..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标签（用逗号分隔）</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="安全教育，小学，语文"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">是否免费</label>
          <select
            value={formData.isFree ? 'true' : 'false'}
            onChange={(e) => setFormData({ ...formData, isFree: e.target.value === 'true' })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="false">付费（需要兑换码）</option>
            <option value="true">免费</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => onSave(formData)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>保存</span>
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>取消</span>
          </button>
        </div>
      </div>
    </div>
  );
}
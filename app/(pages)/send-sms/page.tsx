'use client';

import React, { useEffect, useState } from 'react';
import { allCourse, getAllUser } from '@/app/api/service/api';
import axios from 'axios';

const CreateNotificationForm = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientType, setRecipientType] = useState<'global' | 'user' | 'course'>('global');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [courseId, setCourseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!title.trim() || !message.trim()) {
      setError('Title va Message maydonlari to‘ldirilishi shart');
      return;
    }

    const payload: any = {
      title,
      message,
      isGlobal: recipientType === 'global',
    };

    if (recipientType === 'user') payload.userIds = selectedUsers;
    if (recipientType === 'course') payload.courseId = courseId.trim();

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/notifications/create', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSuccessMsg('✅ Notification muvaffaqiyatli yaratildi!');
      setTitle('');
      setMessage('');
      setSelectedUsers([]);
      setCourseId('');
      setRecipientType('global');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Noma’lum xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    allCourse().then((res) => setCourses(res.data));
    getAllUser()
      .then((data) => setUsers(data))
      .catch((err) => console.error('User fetch xatolik:', err));
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-gradient-to-br from-[#101010] to-[#1c1c1c] text-white rounded-2xl shadow-xl p-8 border border-gray-700">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-400">📢 Notification Yaratish</h2>

      {error && <p className="text-red-400 mb-3 text-sm">{error}</p>}
      {successMsg && <p className="text-green-500 mb-3 text-sm">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Sarlavha (Title)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 bg-[#181818] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <textarea
          placeholder="Xabar (Message)"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-2 bg-[#181818] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
        ></textarea>

        <div>
          <label className="text-sm font-medium mb-2 block">Kimga yuborilsin?</label>
          <div className="flex gap-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                checked={recipientType === 'global'}
                onChange={() => setRecipientType('global')}
              />
              Barchaga
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                checked={recipientType === 'user'}
                onChange={() => setRecipientType('user')}
              />
              Tanlangan userlarga
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                checked={recipientType === 'course'}
                onChange={() => setRecipientType('course')}
              />
              Kurs foydalanuvchilari
            </label>
          </div>
        </div>

        {recipientType === 'user' && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Foydalanuvchilarni tanlang</label>
            <select
              multiple
              value={selectedUsers}
              onChange={(e) =>
                setSelectedUsers(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
              className="w-full h-40 px-4 py-2 bg-[#181818] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {users.map((user: any) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
        )}

        {recipientType === 'course' && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Kurs tanlang</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-4 py-2 bg-[#181818] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Kurs tanlang</option>
              {courses.map((course: any) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold transition duration-200 ease-in-out ${
            loading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {loading ? 'Yuborilmoqda...' : 'Yaratish'}
        </button>
      </form>
    </div>
  );
};

export default CreateNotificationForm;
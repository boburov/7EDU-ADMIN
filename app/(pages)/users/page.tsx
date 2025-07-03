'use client';

import { useEffect, useState } from 'react';
import { getAllUser, allCourse, GetCourseById } from '@/app/api/service/api';
import { Eye } from 'lucide-react';
import { Dialog } from '@headlessui/react';

interface Notification {
  notification: {
    title: string;
    message: string;
    createdAt: string;
    courseId: string | null;
  };
}

interface Course {
  courseId: string;
  isFinished: boolean;
}

interface User {
  id: string;
  email: string;
  name?: string;
  coins?: number;
  isVerified?: boolean;
  courses: Course[];
  showedLesson: LessonProgress[];
  notifications: Notification[];
}

interface CourseDetails {
  id: string;
  title: string;
}

interface LessonProgress {
  lessonId: string;
  watchedAt: string;
}


const UserDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [userCourses, setUserCourses] = useState<CourseDetails[]>([]);


  useEffect(() => {
    Promise.all([getAllUser(), allCourse()])
      .then(([userRes]) => {
        setUsers(userRes);
      })
      .finally(() => setLoading(false));
  }, []);

  const openModal = async (user: User) => {
    setSelectedUser(user);
    setOpen(true);

    if (user.courses?.length) {
      const courseDetails = await Promise.all(
        user.courses.map((c) => GetCourseById(c.courseId))
      );
      setUserCourses(courseDetails.map(res => res?.data));
    } else {
      setUserCourses([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] to-[#15161d] text-white p-8">
      <h1 className="text-3xl font-bold text-green-400 mb-8 text-center tracking-wide">
        👤 Foydalanuvchi Paneli
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Yuklanmoqda...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-[#1c1c2c] rounded-xl p-5 border border-gray-700 shadow-lg hover:shadow-green-600 transition"
            >
              <h2 className="text-xl font-semibold mb-1 truncate">{user.name || 'No name'}</h2>
              <p className="text-gray-300 text-sm mb-1">{user.email}</p>
              <p className="text-sm text-gray-400 mb-1">
                🔐 Holat: {user.isVerified ? 'Tasdiqlangan' : 'Tasdiqlanmagan'}
              </p>
              <p className="text-sm text-gray-400 mb-1">💰 Tangalar: {user.coins ?? 0}</p>
              <p className="text-sm text-gray-400 mb-2">🎓 Kurslar soni: {user.courses?.length ?? 0}</p>
              <button
                onClick={() => openModal(user)}
                className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-white font-medium"
              >
                <Eye className="w-4 h-4" /> Batafsil
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <Dialog.Panel className="bg-[#1a1a2a] text-white p-6 rounded-xl w-full max-w-lg border border-gray-700 shadow-xl">
            <Dialog.Title className="text-lg font-semibold mb-4 text-green-400">
              👁‍🗨 {selectedUser?.email} — Batafsil maʼlumot
            </Dialog.Title>
            <p className="mb-2 text-sm">🧾 Foydalanuvchi ID: {selectedUser?.id}</p>
            <p className="mb-2 text-sm">💰 Tangalar: {selectedUser?.coins ?? 0}</p>
            <p className="mb-2 text-sm">
              🔐 Holat: {selectedUser?.isVerified ? 'Tasdiqlangan' : 'Tasdiqlanmagan'}
            </p>

            <h3 className="font-semibold mb-2">🎓 Sotib olingan kurslar:</h3>
            <ul className="list-disc list-inside space-y-1 mb-4">
              {userCourses.length > 0 ? (
                userCourses.map((course, idx) => (
                  <li key={idx}>{course?.title || 'Nomaʼlum kurs'}</li>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Kurs mavjud emas.</p>
              )}
            </ul>

            <h3 className="font-semibold mb-2">📬 Oxirgi xabarlar:</h3>
            <ul className="list-disc list-inside space-y-1 mb-4">
              {selectedUser?.notifications?.length ? (
                selectedUser.notifications.map((n, idx) => (
                  <li key={idx} className="text-sm text-gray-300">
                    <strong>{n.notification.title}</strong>: {n.notification.message}
                  </li>
                ))
              ) : (
                <p className="text-gray-400 text-sm">Xabarlar mavjud emas.</p>
              )}
            </ul>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
            >
              Yopish
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default UserDashboard;

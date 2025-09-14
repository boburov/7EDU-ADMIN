"use client";

import { useEffect, useState } from "react";
import {
  allCourse,
  deleteCategory,
  updateCategory,
} from "@/app/api/service/api";
import { Trash, Pencil, BookPlus, ArrowUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CourseType {
  id: string;
  title: string;
  goal: string;
  shortName: string;
  thumbnail: string;
  lessons: {
    id: string,
    isVisible: boolean
  }[];
}


const Page = () => {
  const [course, setCourse] = useState<CourseType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: "", goal: "", shortName: "", file: null as File | null });
  const [showScrollTop, setShowScrollTop] = useState(false);

  const fetchData = async () => {
    const res = await allCourse();
    setCourse(res.data || []);
  };

  useEffect(() => {
    fetchData();
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleEdit = (c: CourseType) => {
    setEditingId(c.id);
    setEditData({ title: c.title, goal: c.goal, shortName: c.shortName, file: null });
  };

  const handleUpdateSubmit = async () => {
    if (!editingId) return;
    const formData = new FormData();
    formData.append("title", editData.title);
    formData.append("goal", editData.goal);
    formData.append("shortName", editData.shortName);
    if (editData.file) formData.append("file", editData.file);

    try {
      await updateCategory(editingId, formData);
      setEditingId(null);
      fetchData();
      alert("Muvaffaqiyatli tahrirlandi");
    } catch (err) {
      alert("Xatolik: " + err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Ushbu kursni o'chirmoqchimisiz?")) {
      await deleteCategory(id);
      fetchData();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0eafc] to-[#cfdef3] py-10 px-6 relative">
      {editingId && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Kursni tahrirlash</h2>
            <input
              type="text"
              placeholder="Title"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Goal"
              value={editData.goal}
              onChange={(e) => setEditData({ ...editData, goal: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Short Name"
              value={editData.shortName}
              onChange={(e) => setEditData({ ...editData, shortName: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="file"
              onChange={(e) => setEditData({ ...editData, file: e.target.files?.[0] || null })}
              className="w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingId(null)} className="bg-gray-300 px-4 py-1 rounded">Bekor qilish</button>
              <button onClick={handleUpdateSubmit} className="bg-blue-600 text-white px-4 py-1 rounded">Saqlash</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {course.map((c) => (
          <div
            key={c.id}
            className="bg-white/30 backdrop-blur-md border border-white/40 shadow-lg rounded-2xl transition-transform hover:scale-[1.015] duration-300 flex overflow-hidden"
          >
            <img
              src={c.thumbnail}
              alt={c.title}
              width={144}
              height={144}
              className="w-36 h-36 object-cover rounded-l-2xl"
            />
            <div className="flex flex-col justify-between p-4 flex-1">
              <div>
                <h3 className="text-base font-bold text-gray-900 truncate">
                  {c.shortName}: {c.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{c.goal}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Darslar soni: <strong>{c.lessons.filter(e => e.isVisible).length}</strong>
                </p>

              </div>
              <div className="flex justify-between items-center mt-4">
                <Link
                  href={`courses/${c.id}`}
                  className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-xs rounded-lg transition"
                >
                  <BookPlus size={14} />{"dars qo\u0027shish"}
                </Link>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Tahrirlash"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-600 hover:text-red-800"
                    title="O‘chirish"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
};

export default Page;

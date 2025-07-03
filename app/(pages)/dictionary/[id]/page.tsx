"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/app/api/service/api";
import jsonApi from "@/app/api/service/jsonAPI";

interface Lesson {
  id: string;
  title: string;
}

export default function AddDictionaryPage() {
  const { id: courseId } = useParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [inputs, setInputs] = useState<Record<string, { word: string; translated: string }>>({});

  useEffect(() => {
    if (courseId) {
      api.get(`/courses/category/${courseId}`).then((res) => {
        setLessons(res.data.lessons || []);
      });
    }
  }, [courseId]);

  const handleChange = (lessonId: string, field: "word" | "translated", value: string) => {
    setInputs((prev) => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (lessonId: string) => {
    const { word, translated } = inputs[lessonId] || {};

    if (!word || !translated) {
      alert("Iltimos, so‘z va tarjimani kiriting.");
      return;
    }

    try {
      await jsonApi.post(`/dictonary/${lessonId}/add`, {
        word: word.trim(),
        translated: translated.trim(),
      });

      alert("✅ So‘z muvaffaqiyatli qo‘shildi!");
      setInputs((prev) => ({
        ...prev,
        [lessonId]: { word: "", translated: "" },
      }));
    } catch (error) {
      console.error(error);
      alert("❌ So‘z qo‘shishda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.");
    }
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-br from-[#1e1e2f] to-[#15161d] text-white">
      <h1 className="text-3xl font-bold mb-10 text-center text-green-400 tracking-wide">
        📚 Darslarga Lug‘at Qo‘shish
      </h1>

      {lessons.length === 0 ? (
        <p className="text-center text-gray-400">Darslar hali mavjud emas.</p>
      ) : (
        <div className="space-y-6">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-[#212231] border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-green-500/40 transition-shadow"
            >
              <h2 className="text-xl font-semibold text-green-300 mb-4">
                🧠 {lesson.title}
              </h2>

              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input
                  type="text"
                  placeholder="So‘z (EN)"
                  value={inputs[lesson.id]?.word || ""}
                  onChange={(e) => handleChange(lesson.id, "word", e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-[#12131c] placeholder-gray-500 text-white focus:ring-2 focus:ring-green-500 outline-none shadow-sm"
                />

                <input
                  type="text"
                  placeholder="Tarjima (UZ)"
                  value={inputs[lesson.id]?.translated || ""}
                  onChange={(e) => handleChange(lesson.id, "translated", e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-[#12131c] placeholder-gray-500 text-white focus:ring-2 focus:ring-green-500 outline-none shadow-sm"
                />
              </div>

              <button
                onClick={() => handleSubmit(lesson.id)}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-xl font-semibold transition-all shadow-md hover:shadow-green-400"
              >
                ➕ Lug‘atni qo‘shish
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

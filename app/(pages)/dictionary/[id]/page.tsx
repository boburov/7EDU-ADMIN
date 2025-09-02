"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/app/api/service/api";
import jsonApi from "@/app/api/service/jsonAPI";
import { Pencil, Trash2 } from "lucide-react";

interface DictionaryWord {
  id: string;
  word: string;
  translated: string;
}

interface Lesson {
  id: string;
  title: string;
  dictonary?: DictionaryWord[];
}

interface Course {
  id: string;
  lessons: Lesson[];
}

export default function AddDictionaryPage() {
  const { id: courseId } = useParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [inputs, setInputs] = useState<Record<string, { word: string; translated: string }>>({});

  useEffect(() => {
    api.get("courses/all").then((data) => {
      const lessonData = data.data
        .filter((e: Course) => e.id === courseId)[0]
      setLessons(lessonData.lessons)
      console.log(lessonData);

    });
  }, [courseId]);

  const handleChange = (key: string, field: "word" | "translated", value: string) => {
    setInputs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
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
      setInputs((prev) => ({ ...prev, [lessonId]: { word: "", translated: "" } }));

      const updatedLesson = await api.get(`/courses/lessons/${lessonId}`);
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, dictonary: updatedLesson.data.dictonary } : lesson
        )
      );
    } catch (error) {
      console.error(error);
      alert("❌ So‘z qo‘shishda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.");
    }
  };

  const handleEdit = async (wordId: string, lessonId: string) => {
    const { word, translated } = inputs[wordId] || {};
    if (!word || !translated) return;
    try {
      await jsonApi.patch(`/dictonary/${wordId}`, {
        word: word.trim(),
        translated: translated.trim(),
      });
      alert("✅ Tahrir muvaffaqiyatli bajarildi");
      const updatedLesson = await api.get(`/courses/lessons/${lessonId}`);
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, dictonary: updatedLesson.data.dictonary } : lesson
        )
      );
    } catch (e) {
      console.error(e);
      alert("❌ Tahrir qilishda xatolik yuz berdi");
    }
  };

  const handleDelete = async (wordId: string, lessonId: string) => {
    if (!confirm("Bu so‘zni o‘chirib tashlamoqchimisiz?")) return;
    try {
      await jsonApi.delete(`/dictonary/${wordId}`);
      const updatedLesson = await api.get(`/courses/lessons/${lessonId}`);
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, dictonary: updatedLesson.data.dictonary } : lesson
        )
      );
    } catch (e) {
      console.error(e);
      alert("❌ O‘chirishda xatolik yuz berdi");
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
          {lessons.map((lesson, index) => (
            <div
              key={lesson.id + index}
              className="bg-[#212231] border border-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-green-500/40 transition-shadow"
            >
              <h2 className="text-xl font-semibold text-green-300 mb-4">
                🧠 {lesson.title}
              </h2>

              {lesson.dictonary?.map((word, index) => (
                <div key={`${word.id}-${index}`} className="flex flex-col md:flex-row gap-4 mb-2 items-center">
                  <input
                    type="text"
                    value={inputs[word.id]?.word ?? word.word}
                    onChange={(e) => handleChange(word.id, "word", e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-600 bg-[#12131c] placeholder-gray-500 text-white focus:ring-2 focus:ring-yellow-500 outline-none shadow-sm"
                  />
                  <input
                    type="text"
                    value={inputs[word.id]?.translated ?? word.translated}
                    onChange={(e) => handleChange(word.id, "translated", e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-600 bg-[#12131c] placeholder-gray-500 text-white focus:ring-2 focus:ring-yellow-500 outline-none shadow-sm"
                  />
                  <button
                    onClick={() => handleEdit(word.id, lesson.id)}
                    className="p-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white shadow hover:shadow-yellow-400"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(word.id, lesson.id)}
                    className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow hover:shadow-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <div className="flex flex-col md:flex-row gap-4 mt-6">
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
                className="mt-3 bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-xl font-semibold transition-all shadow-md hover:shadow-green-400"
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

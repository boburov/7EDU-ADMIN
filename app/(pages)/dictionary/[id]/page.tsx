"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/app/api/service/api";
import jsonApi from "@/app/api/service/jsonAPI";
import { Pencil, Trash2, Plus, BookOpen, Search, ChevronDown, ChevronUp } from "lucide-react";

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
  title: string;
  lessons: Lesson[];
}

export default function AddDictionaryPage() {
  const { id: courseId } = useParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [inputs, setInputs] = useState<Record<string, { word: string; translated: string }>>({});
  const [expandedLessons, setExpandedLessons] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    api.get("courses/all").then((data) => {
      const courseData = data.data.filter((e: Course) => e.id === courseId)[0];
      if (courseData) {
        setCourseTitle(courseData.title);
        setLessons(courseData.lessons || []);
        
        // Initialize all lessons as expanded by default
        const initialExpandedState: Record<string, boolean> = {};
        courseData.lessons.forEach((lesson: Lesson) => {
          initialExpandedState[lesson.id] = true;
        });
        setExpandedLessons(initialExpandedState);
      }
    });
  }, [courseId]);

  const toggleLesson = (lessonId: string) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }));
  };

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
      alert("Iltimos, so'z va tarjimani kiriting.");
      return;
    }

    try {
      await jsonApi.post(`/dictonary/${lessonId}/add`, {
        word: word.trim(),
        translated: translated.trim(),
      });
      alert("✅ So'z muvaffaqiyatli qo'shildi!");
      setInputs((prev) => ({ ...prev, [lessonId]: { word: "", translated: "" } }));

      const updatedLesson = await api.get(`/courses/lessons/${lessonId}`);
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === lessonId ? { ...lesson, dictonary: updatedLesson.data.dictonary } : lesson
        )
      );
    } catch (error) {
      console.error(error);
      alert("❌ So'z qo'shishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
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
    if (!confirm("Bu so&apos;zni o&apos;chirib tashlamoqchimisiz?")) return;
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
      alert("❌ O&apos;chirishda xatolik yuz berdi");
    }
  };

  const filteredLessons = lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lesson.dictonary?.some(word => 
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.translated.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-green-400 tracking-wide flex items-center gap-2">
              <BookOpen size={32} /> Lug&apos;at Boshqaruvi
            </h1>
            <p className="text-gray-400">{courseTitle} kursi</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Dars yoki so&apos;z bo&apos;yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-800 text-white w-full md:w-64"
            />
          </div>
        </div>

        {filteredLessons.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
            <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">Darslar topilmadi</h3>
            <p className="text-gray-500">
              {searchTerm ? "Qidiruv bo&apos;yicha hech narsa topilmadi" : "Hali darslar qo&apos;shilmagan"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLessons.map((lesson, index) => (
              <div
                key={lesson.id + index}
                className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden"
              >
                {/* Lesson Header */}
                <div 
                  className="flex items-center justify-between p-4 bg-gray-700 cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => toggleLesson(lesson.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">
                      {index + 1}
                    </div>
                    <h2 className="text-lg font-semibold text-white">
                      {lesson.title}
                    </h2>
                    <span className="bg-gray-600 text-gray-300 text-xs font-medium px-2 py-1 rounded-full">
                      {lesson.dictonary?.length || 0} so&apos;z
                    </span>
                  </div>
                  <div className="text-gray-400">
                    {expandedLessons[lesson.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Lesson Content */}
                {expandedLessons[lesson.id] && (
                  <div className="p-4">
                    {/* Dictionary Words Table */}
                    {lesson.dictonary && lesson.dictonary.length > 0 ? (
                      <div className="mb-6 overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b border-gray-700">
                              <th className="py-2 px-3 text-left text-gray-400 font-medium">So&apos;z (EN)</th>
                              <th className="py-2 px-3 text-left text-gray-400 font-medium">Tarjima (UZ)</th>
                              <th className="py-2 px-3 text-right text-gray-400 font-medium">Harakatlar</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lesson.dictonary.map((word) => (
                              <tr key={word.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                <td className="py-3 px-3">
                                  <input
                                    type="text"
                                    value={inputs[word.id]?.word ?? word.word}
                                    onChange={(e) => handleChange(word.id, "word", e.target.value)}
                                    className="w-full px-3 py-1.5 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                  />
                                </td>
                                <td className="py-3 px-3">
                                  <input
                                    type="text"
                                    value={inputs[word.id]?.translated ?? word.translated}
                                    onChange={(e) => handleChange(word.id, "translated", e.target.value)}
                                    className="w-full px-3 py-1.5 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                  />
                                </td>
                                <td className="py-3 px-3">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => handleEdit(word.id, lesson.id)}
                                      className="p-1.5 rounded bg-yellow-600 hover:bg-yellow-700 text-white transition-colors"
                                      title="Tahrirlash"
                                    >
                                      <Pencil size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(word.id, lesson.id)}
                                      className="p-1.5 rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
                                      title="O&apos;chirish"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">Bu darsda hali lug&apos;at so&apos;zlari mavjud emas.</p>
                    )}

                    {/* Add New Word Form */}
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                      <h3 className="text-md font-medium text-green-400 mb-3 flex items-center gap-2">
                        <Plus size={18} /> Yangi so&apos;z qo&apos;shish
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input
                          type="text"
                          placeholder="So&apos;z (EN)"
                          value={inputs[lesson.id]?.word || ""}
                          onChange={(e) => handleChange(lesson.id, "word", e.target.value)}
                          className="px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                          type="text"
                          placeholder="Tarjima (UZ)"
                          value={inputs[lesson.id]?.translated || ""}
                          onChange={(e) => handleChange(lesson.id, "translated", e.target.value)}
                          className="px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <button
                        onClick={() => handleSubmit(lesson.id)}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-all flex items-center gap-2"
                      >
                        <Plus size={18} /> So&apos;z qo&apos;shish
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
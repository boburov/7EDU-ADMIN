"use client";
import Link from "next/link";
import { deleteLesson, getLessons } from "@/app/api/service/api";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  isDemo: boolean;
  isVisible: boolean;
}

const LessonsPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);

  const { id } = useParams() as { id: string };

  const fetchLessons = useCallback(async () => {
    setLoading(true);
    const res = await getLessons(id);
    setLessons(res.data.lessons);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const handleDelete = async (lessonId: string) => {
    await deleteLesson(lessonId);
    fetchLessons();
  };

  return (
    <div className="px-4 py-10 lg:px-10 w-full text-gray-800 min-h-screen">
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="w-14 h-14 border-4 border-t-transparent border-white rounded-full animate-spin" />
        </div>
      )}

      <div className="mt-10 mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          📖 Darslar soni: {lessons.filter((lesson) => lesson.isVisible).length}
        </h3>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {lessons
          .filter((lesson) => lesson.isVisible)
          .map((lesson) => (
            <Link
              href={`${id + "/" + lesson.id}`}
              key={lesson.id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between gap-3 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-bold text-sky-700">
                  {lesson.title}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                    🟢 Ko&apos;rinadi
                  </span>
                  <span className="text-sm text-gray-500">
                    {lesson.isDemo ? "🎬 Demo" : "✅ To&apos;liq"}
                  </span>
                </div>
              </div>

              {lesson.videoUrl && (
                <video
                  width="100%"
                  height="240"
                  controls
                  className="rounded-lg"
                >
                  <source src={lesson.videoUrl} type="video/mp4" />
                </video>
              )}

              <div className="flex justify-end">
                <button
                  onClick={(e) => {
                    e.preventDefault(); // linkni to‘xtatmaslik uchun
                    handleDelete(lesson.id);
                  }}
                  className="text-red-500 font-medium hover:underline"
                >
                  🗑️ O&apos;chirish
                </button>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default LessonsPage;

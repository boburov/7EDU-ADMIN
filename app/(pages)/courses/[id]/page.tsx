"use client";
import { AxiosProgressEvent } from "axios";
import api, {
  deleteLesson,
  getLessons,
  updateLesson,
} from "@/app/api/service/api";
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
  const [title, setTitle] = useState("");
  const [isDemo, setIsDemo] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | 0>(0);
  const [file, setFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

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

  useEffect(() => {
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setVideoPreview(null);
    }
  }, [file]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const resetForm = () => {
    setTitle("");
    setFile(null);
    setVideoPreview(null);
    setIsDemo(false);
    setIsVisible(true);
    setEditMode(false);
    setEditId(null);
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) return alert("Dars nomi kiritilishi shart!");
    if (!file && !editMode) return alert("Video fayl yuklash shart!");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("isDemo", String(isDemo));
    formData.append("isVisible", String(isVisible));
    if (file) formData.append("video", file);

    setLoading(true);
    try {
      if (editMode && editId) {
        const res = await updateLesson(editId, formData);
        if (res.status === 200) {
          alert("Dars tahrirlandi!");
        }
      } else {
        const res = await api.post(`/courses/${id}/lesson`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const percent = Math.round(
              ((progressEvent.loaded || 0) * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percent);
          },
        });
        if (res.status === 201 || res.status === 200) {
          alert("Dars qo&apos;shildi!");
        }
      }
      resetForm();
      fetchLessons();
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lessonId: string) => {
    deleteLesson(lessonId);
    console.log(lessonId);
  };

  const handleEdit = (lesson: Lesson) => {
    setTitle(lesson.title);
    setIsDemo(lesson.isDemo);
    setIsVisible(lesson.isVisible);
    setEditId(lesson.id);
    setEditMode(true);
    setFile(null);
    if (lesson.videoUrl.startsWith("http")) {
      setVideoPreview(lesson.videoUrl);
    }
  };

  return (
    <div className="px-4 py-10 lg:px-10 w-full text-gray-800 min-h-screen">
      {loading && !editMode && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="w-14 h-14 border-4 border-t-transparent border-white rounded-full animate-spin" />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">
          📚 Dars qo&apos;shish yoki tahrirlash
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label
            htmlFor="upload"
            className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-sky-500 transition-colors rounded-xl flex flex-col items-center justify-center px-6 py-10"
          >
            <p className="text-base font-medium text-gray-600">
              🎥 Video fayl yuklash
            </p>
            <input
              type="file"
              id="upload"
              accept="video/*"
              className="hidden"
              onChange={onFileChange}
            />
          </label>

          {videoPreview && (
            <video
              width="100%"
              height="240"
              controls
              className="rounded-lg shadow"
            >
              <source src={videoPreview} type="video/mp4" />
            </video>
          )}

          {uploadProgress !== null && (
            <div className="w-full bg-gray-200 rounded-full h-4 mt-4 overflow-hidden">
              <div
                className="bg-sky-500 h-4 text-white text-sm text-center transition-all duration-300"
                style={{ width: `${uploadProgress ?? 0}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          )}

          <input
            type="text"
            placeholder="✏️ Dars nomi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
          />

          <div className="flex gap-6 items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="demo"
                checked={isDemo}
                onChange={() => setIsDemo(true)}
                className="peer hidden"
              />
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:border-sky-500 peer-checked:bg-sky-100">
                <div className="w-2 h-2 rounded-full bg-sky-500 opacity-0 peer-checked:opacity-100" />
              </div>
              <span className="text-gray-700">Demo dars</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="demo"
                checked={!isDemo}
                onChange={() => setIsDemo(false)}
                className="peer hidden"
              />
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center peer-checked:border-sky-500 peer-checked:bg-sky-100">
                <div className="w-2 h-2 rounded-full bg-sky-500 opacity-0 peer-checked:opacity-100" />
              </div>
              <span className="text-gray-700">To&apos;liq dars</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="w-4 h-4 text-sky-500 rounded focus:ring-sky-500"
              />
              <span className="text-gray-700">Ko&apos;rinadimi?</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3 bg-sky-500 text-white font-semibold rounded-xl transition ${loading
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-sky-600"
                }`}
            >
              {loading
                ? editMode
                  ? "Tahrirlanmoqda..."
                  : "Qo&apos;shilmoqda..."
                : editMode
                  ? "Tahrirlash"
                  : "Qo&apos;shish"}
            </button>

            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-3 bg-gray-300 text-gray-800 font-semibold rounded-xl hover:bg-gray-400"
              >
                Bekor qilish
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-10 mb-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">
          📖 Darslar soni:{" "}
          {lessons.filter((every_lessons) => every_lessons.isVisible === true)
            .length}
        </h3>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {lessons.map((lesson) => {
          if (lesson.isVisible === true) {
            return (
              <div
                key={lesson.id}
                className={`bg-white rounded-xl shadow-md p-4 flex flex-col justify-between gap-3 transition-all duration-300 ${!lesson.isVisible
                    ? "bg-gray-100 opacity-70 border-l-4 border-red-500 hidden"
                    : ""
                  }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-sky-700">
                    {lesson.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${lesson.isVisible
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {lesson.isVisible
                        ? "🟢 Ko&apos;rinadi"
                        : "🔴 O&apos;chirilgan"}
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

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => handleEdit(lesson)}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    ✏️ Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDelete(lesson.id)}
                    className="text-red-500 font-medium hover:underline"
                  >
                    🗑️ O&apos;chirish
                  </button>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default LessonsPage;

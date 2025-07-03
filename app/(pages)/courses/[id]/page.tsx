"use client";

import {
  addLesson,
  deleteLesson,
  getLessons,
  updateLesson,
} from "@/app/api/service/api";
import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  isDemo: boolean;
}

const LessonsPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [title, setTitle] = useState("");
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const { id } = useParams() as { id: string };

  const fetchLessons = useCallback(async () => {
    const res = await getLessons(id);
    setLessons(res.data.lessons);
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
    setEditMode(false);
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      return alert("Dars nomi kiritilishi shart!");
    }

    if (!file && !editMode) {
      return alert("Video fayl yuklash shart!");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("isDemo", String(isDemo));

    if (file) {
      formData.append("video", file);
    }

    setLoading(true);
    try {
      if (editMode && editId) {
        const res = await updateLesson(editId, formData);
        if (res.status === 200) {
          alert("Dars tahrirlandi!");
          resetForm();
          fetchLessons();
        }
      } else {
        const res = await addLesson(id, formData);
        if (res.status === 201 || res.status === 200) {
          alert("Dars qo‘shildi!");
          resetForm();
          fetchLessons();
        }
      }
    } catch (error) {
      console.error("Xatolik:", error);
      alert("Xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lessonId: string) => {
    await deleteLesson(lessonId);
    fetchLessons();
  };

  const handleEdit = (lesson: Lesson) => {
    setTitle(lesson.title);
    setIsDemo(lesson.isDemo);
    setEditId(lesson.id);
    setEditMode(true);
    setFile(null);
    if (lesson.videoUrl.startsWith("http")) {
      setVideoPreview(lesson.videoUrl);
    }
  };

  return (
    <div className="px-6 py-16 text-gray-800 w-full">
      <form onSubmit={handleSubmit} className="mb-8">
        <label
          htmlFor="upload"
          className="cursor-pointer border-2 border-dashed border-gray-400 hover:border-green-500 transition-colors rounded-2xl w-full max-w-md flex flex-col items-center justify-center gap-4 px-6 py-12 bg-white shadow-md hover:shadow-lg"
        >
          <p className="text-lg font-medium text-gray-600">Fayl yuklash uchun bosing</p>
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
            width="320"
            height="240"
            controls
            src={videoPreview}
            className="mt-4 rounded-md"
          />
        )}

        <input
          type="text"
          placeholder="Dars nomi"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-4 w-full max-w-md px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition"
        />

        <div className="mt-4 flex gap-6 mb-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="demo"
              checked={isDemo}
              onChange={() => setIsDemo(true)}
              className="peer hidden"
            />
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all peer-checked:border-green-600 peer-checked:bg-green-100">
              <div className="w-2.5 h-2.5 rounded-full bg-green-600 opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <span className="text-gray-700 font-medium">Demo dars</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="demo"
              checked={!isDemo}
              onChange={() => setIsDemo(false)}
              className="peer hidden"
            />
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all peer-checked:border-green-600 peer-checked:bg-green-100">
              <div className="w-2.5 h-2.5 rounded-full bg-green-600 opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <span className="text-gray-700 font-medium">To‘liq dars</span>
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="py-3 bg-sky-500 text-white rounded-xl w-1/4"
          >
            <strong>{editMode ? "Darsni tahrirlash" : "Darsni qo'shish"}</strong>
          </button>

          {editMode && (
            <button
              type="button"
              onClick={resetForm}
              className="py-3 bg-red-400 text-white rounded-xl w-1/4"
            >
              Bekor qilish
            </button>
          )}
        </div>
      </form>

      <div className="mt-4 bg-white shadow-2xl rounded-xl p-3">
        <p>
          <strong>Darslar Soni :</strong> {lessons.length}
        </p>
      </div>

      <div className="mt-4 bg-white shadow-2xl rounded-xl p-3 w-full">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="w-full mb-4">
            <h1 className="text-xl font-bold">{lesson.title}</h1>
            {lesson.videoUrl && (
              <video width="320" height="240" controls>
                <source src={lesson.videoUrl} type="video/mp4" />
              </video>
            )}
            <p>{lesson.isDemo ? "Demo dars" : "To‘liq dars"}</p>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => handleEdit(lesson)}
                className="text-blue-600"
              >
                ✏️ Tahrirlash
              </button>
              <button
                onClick={() => handleDelete(lesson.id)}
                className="text-red-500"
              >
                🗑️ O‘chirish
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonsPage;

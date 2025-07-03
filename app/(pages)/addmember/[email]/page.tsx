"use client";

import { useEffect, useState } from "react";
import { allCourse, addMemeberToCourse } from "@/app/api/service/api";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";

interface Course {
  id: string;
  name: string;
  goal: string;
  thumbnail: string;
}

const Page = () => {
  const path=useParams()
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const email= decodeURIComponent(String(path.email))
console.log(email);

  useEffect(() => {
    allCourse()
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => {
        toast.error("Kurslarni olishda xatolik");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddMember = async (courseId: string) => {
    console.log(courseId,email);
    
    try {
      await addMemeberToCourse(email, courseId);
      toast.success("Kursga muvaffaqiyatli qo‘shildingiz!");
    } catch (error) {
      toast.error("Qo‘shishda xatolik yuz berdi");
      console.log(error);
      
    }
  };

  console.log(courses);
  
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Mavjud Kurslar</h1>

      {loading ? (
        <p className="text-gray-500">Yuklanmoqda...</p>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">Hozircha kurslar mavjud emas.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl border border-gray-200 bg-white/80 shadow-md hover:shadow-lg transition p-5 space-y-3"
            >
              <img
                src={course.thumbnail}
                alt={course.name}
                className="w-full h-40 object-cover rounded-xl"
              />
              <h2 className="text-xl font-bold text-gray-800">{course.name}</h2>
              <p className="text-gray-600">{course.goal}</p>

              <button
                onClick={() => handleAddMember(course.id)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                ➕ Kursga qo‘shilish
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;

'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { GetCourseById } from "@/app/api/service/api";
import Link from "next/link";

interface Lesson {
    id: string;
    title: string;
    isDemo: boolean;
    videoUrl: string;
    coursesCategoryId: string;
}

export default function LessonsPage() {
    const { category } = useParams();
    const [course, setCourse] = useState<{id:string, title: string; lessons: Lesson[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!category) return;
        GetCourseById(category as string)
            .then((res) => {
                setCourse(res?.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Xatolik:", err);
                setLoading(false);
            });
    }, [category]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin h-10 w-10 text-purple-600" />
            </div>
        );
    }

    if (!course) {
        return <div className="text-center text-red-600 mt-10">Kurs topilmadi</div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-center mb-8 text-white">{course.title}</h1>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {course.lessons.map((lesson: Lesson) => (
                    <Link
                        href={course.id+"/"+lesson.id}
                        key={lesson.id}
                        className="bg-[#1e1e2f] rounded-2xl shadow-lg p-5 hover:scale-105 transition-transform duration-300"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold text-white">{lesson.title}</h2>
                            <span className="text-xs px-2 py-1 bg-purple-700 text-white rounded-full">
                                {lesson.isDemo ? "Demo" : "Full"}
                            </span>
                        </div>
                        {lesson.videoUrl && (
                            <video
                                className="rounded-lg w-full h-36 object-cover"
                                src={lesson.videoUrl}
                                controls
                            />
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}

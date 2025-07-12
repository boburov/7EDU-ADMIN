"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/api/service/api";
import { toast } from "react-toastify";

export default function AddQuizPage() {
  const router = useRouter();
  const { lessonid } = useParams<{ lessonid: string }>();
  const [form, setForm] = useState({
    quession: "",
    option1: "",
    option2: "",
    option3: "",
    current: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { quession, option1, option2, option3, current } = form;

    if (!quession || !option1 || !option2 || !option3 || !current) {
      toast.error("Barcha maydonlarni to‘ldiring!");
      return;
    }

    if (![option1, option2, option3].includes(current)) {
      toast.error("To‘g‘ri javob variantlardan biri bo‘lishi kerak");
      return;
    }

    try {
      await api.post(`/quizs/${lessonid}/create`, form);
      toast.success("Test muvaffaqiyatli qo‘shildi!");
      router.back();
    } catch {
      toast.error("Xatolik yuz berdi");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white/5 border border-white/10 rounded-2xl shadow-lg backdrop-blur-lg">
      <h1 className="text-2xl font-bold text-white mb-6">📝 Yangi test qo‘shish</h1>

      <div className="space-y-4 text-white">
        <textarea
          name="quession"
          placeholder="Savol matni..."
          value={form.quession}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none"
        />

        <input
          name="option1"
          placeholder="1-variant"
          value={form.option1}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none"
        />

        <input
          name="option2"
          placeholder="2-variant"
          value={form.option2}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none"
        />

        <input
          name="option3"
          placeholder="3-variant"
          value={form.option3}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none"
        />

        <select
          name="current"
          value={form.current}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-green-900 border border-green-700 focus:outline-none"
        >
          <option value="">To‘g‘ri javobni tanlang</option>
          {form.option1 && <option value={form.option1}>{form.option1}</option>}
          {form.option2 && <option value={form.option2}>{form.option2}</option>}
          {form.option3 && <option value={form.option3}>{form.option3}</option>}
        </select>

        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-semibold"
        >
          Testni Saqlash
        </button>
      </div>
    </div>
  );
}

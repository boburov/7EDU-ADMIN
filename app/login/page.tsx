"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn } from "lucide-react";

const allowedCredentials = [
  { email: "sevenedu.founder@gmail.com", password: "sevenedu.founder.777" },
  { email: "sevenedu.admin@gmail.com", password: "sevenedu.admin.2022" },
];

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // allowedCredentials ichida email+password juftligini tekshiradi
    const found = allowedCredentials.some(
      (c) => c.email === email.trim() && c.password === password
    );

    if (found) {
      // localStorage ga saqlash olib tashlandi (so'roving bo'yicha)
      router.push("/");
    } else {
      alert("Email yoki parol noto‘g‘ri!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2">
          <LogIn className="w-10 h-10 text-indigo-600" />
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Kirish
          </h2>
        </div>

        <div className="space-y-4">
          {/* Email input */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400 transition">
            <Mail className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="Email"
              className="w-full outline-none bg-transparent text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password input */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-400 transition">
            <Lock className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Parol"
              className="w-full outline-none bg-transparent text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition shadow-md flex items-center justify-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          Kirish
        </button>

        <p className="text-center text-sm text-gray-500">
          Hisobingiz yo‘qmi?{" "}
          <a href="#" className="text-indigo-600 hover:underline font-medium">
            Ro‘yxatdan o‘tish
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

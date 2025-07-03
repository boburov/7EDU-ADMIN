"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // 🧪 Oldindan belgilangan email va password
    const correctEmail = "sevenedu@gmail.com";
    const correctPassword = "sevenedu123admin";

    if (email === correctEmail && password === correctPassword) {
      // 🔐 Auth ma'lumotini localStorage ga saqlash
      localStorage.setItem("email",email);
      localStorage.setItem("password",password);

      // 🟢 Dashboard sahifasiga yo'naltirish
      router.push("/");
    } else {
      alert("Email yoki parol noto‘g‘ri!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold text-center">Kirish</h2>
        <input
          type="text"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Parol"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Kirish
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

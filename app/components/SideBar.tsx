"use client";

import {
  BookA,
  Home,
  MessageSquareIcon,
  PlusSquare,
  User2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../image/logo.png";

const SideBar = () => {
  const pathname = usePathname();

  const navLinks = [
    { label: "Bosh Sahifa", href: "/", icon: Home },
    { label: "Kurs Yaratish", href: "/courses", icon: PlusSquare },
    { label: "Lug'at Qo'shish", href: "/dictionary", icon: BookA },
    { label: "Test Qo'shish", href: "/quiz", icon: PlusSquare },
    { label: "Foydalanuvchilarga Sms", href: "/send-sms", icon: MessageSquareIcon },
    { label: "Dars Qo'shish", href: "/lessons", icon: PlusSquare },
    { label: "Foydalanuvchilar", href: "/users", icon: User2Icon },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen min-w-[390px] p-6 
      bg-[#0f172a]/80 backdrop-blur-lg border-r border-white/10 shadow-lg 
      text-white flex flex-col z-50">
      
      <Link
        href="/"
        className="flex items-center gap-3 mb-10 hover:opacity-90 transition"
      >
        <div className="relative w-10 h-10">
          <Image src={logo} alt="7edu logo" fill className="object-contain" />
        </div>
        <h1 className="text-lg sm:text-xl font-bold tracking-wide">
          <span className="text-blue-500">7EDU</span>{" "}
          <span className="text-white/90">ADMIN</span>
        </h1>
      </Link>

      <ul className="flex flex-col gap-2">
        {navLinks.map((link, i) => {
          const isActive = pathname === link.href;

          return (
            <li key={i}>
              <Link
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg"
                    : "hover:bg-white/10 hover:text-blue-400 text-white/80"
                }`}
              >
                <link.icon size={20} />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto text-center pt-10 text-xs text-white/30">
        © 2025 7Edu Platformasi
      </div>
    </aside>
  );
};

export default SideBar;

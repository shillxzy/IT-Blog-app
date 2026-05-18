// ============================================================
// app/admin/login/page.tsx — Admin login page
// ============================================================

import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Вхід — YourBlog Admin",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-stone-900 mb-4">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">YourBlog Admin</h1>
          <p className="text-stone-500 text-sm mt-1">Увійдіть до панелі керування</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

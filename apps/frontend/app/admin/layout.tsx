// ============================================================
// app/admin/layout.tsx — Admin shell layout
// ============================================================

import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tags,
  Users,
  LogOut,
  PenSquare,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

// In a real app you'd validate the JWT here
async function getAdminUser() {
  if (process.env.NEXT_PUBLIC_USE_MOCK_API === "true") {
    return { name: "Demo Admin" };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  // TODO: validate token with your auth service
  return { name: "Admin" }; // placeholder
}

const NAV_ITEMS = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { href: "/admin/articles", label: "Статті", icon: FileText },
  { href: "/admin/categories", label: "Категорії", icon: FolderOpen },
  { href: "/admin/tags", label: "Теги", icon: Tags },
  { href: "/admin/authors", label: "Автори", icon: Users },
];

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-white flex flex-col flex-shrink-0">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-stone-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <PenSquare size={16} className="text-stone-900" />
            </div>
            <div>
              <p className="font-bold text-sm">YourBlog</p>
              <p className="text-xs text-stone-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-300 hover:bg-stone-800 hover:text-white transition-colors group"
            >
              <Icon size={16} className="text-stone-400 group-hover:text-white transition-colors" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-stone-700">
          <div className="px-3 py-2 mb-1">
            <p className="text-xs text-stone-400">Увійшли як</p>
            <p className="text-sm text-white font-medium truncate">{user.name}</p>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
            >
              <LogOut size={16} />
              Вийти
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

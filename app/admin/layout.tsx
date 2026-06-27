import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SidebarNav } from "@/components/admin/SidebarNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-slate-100 flex flex-col">
        {/* Brand */}
        <Link href="/admin/dashboard" className="flex items-center gap-2.5 px-4 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-xs font-black text-slate-800 truncate">Achado Inteligente</p>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Admin</p>
          </div>
        </Link>

        <SidebarNav email={session.user?.email} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <span className="font-bold text-gray-900">Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: "/admin/dashboard", label: "Dashboard" },
            { href: "/admin/artigos", label: "Artigos" },
            { href: "/admin/produtos", label: "Produtos" },
            { href: "/admin/categorias", label: "Categorias" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
          {session.user?.email}
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

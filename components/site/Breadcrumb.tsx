import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: Props) {
  return (
    <nav className="flex items-center gap-1 text-sm text-slate-400 flex-wrap">
      <Link href="/" className="hover:text-violet-600 transition-colors">
        Início
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="text-slate-300">/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-violet-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-700 font-medium truncate max-w-xs">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

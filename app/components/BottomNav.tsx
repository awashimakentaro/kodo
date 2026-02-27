"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const HomeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 10.5L12 3l9 7.5V21a.75.75 0 0 1-.75.75h-5.25a.75.75 0 0 1-.75-.75v-6H9v6a.75.75 0 0 1-.75.75H3.75A.75.75 0 0 1 3 21v-10.5z" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 3v3M18 3v3M4 7h16M5 9h14v11H5z" />
  </svg>
);

const RecordIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M5 5h14v14H5z" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

const MyIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4z" />
    <path d="M4 20a8 8 0 0 1 16 0" />
  </svg>
);

const items = [
  { href: "/", label: "ホーム", Icon: HomeIcon },
  { href: "/today", label: "今日", Icon: CalendarIcon },
  { href: "/post", label: "記録", Icon: RecordIcon },
  { href: "/login", label: "マイ", Icon: MyIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[428px] items-center justify-between px-8">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href;//ture or false
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className="flex flex-1 flex-col items-center gap-1 py-1"
            >
              <Icon className={`h-5 w-5 ${active ? "text-sky-500" : "text-slate-400"}`} />
              <span className={`text-[10px] font-bold tracking-tight ${active ? "text-sky-500" : "text-slate-400"}`}>
                {label}
              </span>
              <span className={`h-1 w-1 rounded-full ${active ? "bg-sky-500" : "bg-transparent"}`} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

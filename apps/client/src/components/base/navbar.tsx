import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export default function Navbar({ className }: { className?: string }) {
  return (
    <header>
      <nav
        className={cn(
          "z-50 sticky top-0 flex bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 w-full items-center justify-between px-4 h-10 animate-bg",
          className,
        )}>
        <Link
          className='font-extrabold'
          to='/'>
          WEPIECES
        </Link>
      </nav>
    </header>
  );
}

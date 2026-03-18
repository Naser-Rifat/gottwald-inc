import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-gutter">
      <p className="text-gold text-[11px] tracking-[0.3em] font-bold uppercase mb-6">
        404
      </p>
      <h1 className="text-[clamp(2.5rem,5vw,5rem)] font-bold tracking-tighter uppercase leading-[0.9] mb-8 text-center">
        Page Not Found
      </h1>
      <p className="text-white/60 text-lg max-w-md text-center mb-12">
        The resource you requested does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-3 border border-white/20 rounded-full px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-white/5 transition-colors"
      >
        ← Return Home
      </Link>
    </div>
  );
}

"use client";

/**
 * Clickable search bar on the home screen.
 * Routes user to /search when clicked (not a real input — it's a link).
 */
import Link from "next/link";

export default function SearchBarLink() {
  return (
    <Link
      href="/search"
      className="flex items-center gap-2 bg-white rounded-full px-4 py-3 shadow-sm border border-gray-100 cursor-text hover:shadow-md transition mx-4 my-3"
    >
      <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
      </svg>
      <span className="text-gray-400 text-sm">Bật Mood Đầu Ngày - Giảm Đến 35K</span>
    </Link>
  );
}

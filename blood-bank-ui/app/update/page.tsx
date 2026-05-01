'use client';
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

export default function UpdateInfo() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('data')
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-3">
      <h1 className="text-2xl font-bold dark:text-white">update info page</h1>
      <p>ID: {userId}</p>
      <Link href="/">
        <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
          Back
        </button>
      </Link>
    </div>
  );
}

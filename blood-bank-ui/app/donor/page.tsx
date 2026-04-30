'use client'
import Link from "next/link";
import { useSearchParams } from 'next/navigation';


export default function DonorPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('data')
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-3">
      <h1 className="text-2xl font-bold dark:text-white">donor</h1>
      <p className="dark:text-gray-300">{userId}</p>

      <Link href="/update">
        <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
          Update Info
        </button>
      </Link>
      <Link href="/">
        <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
          Back
        </button>
      </Link>
    </div>
  );
}

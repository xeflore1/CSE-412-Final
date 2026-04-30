import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-3">
      <h1 className="text-2xl font-bold dark:text-white">Blood Bank</h1>
      <div className="flex gap-3">
        <Link href="/login">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Login
          </button>
        </Link>
        <Link href="/create">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Create User
          </button>
        </Link>
      </div>
    </div>
  );
}
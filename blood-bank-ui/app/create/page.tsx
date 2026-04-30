import Link from "next/link";

export default function CreateUser() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-3">
      <h1 className="text-2xl font-bold dark:text-white">Create User</h1>
      <p className="dark:text-gray-300">Create user form goes here</p>
      <Link href="/">
        <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
          Back
        </button>
      </Link>
    </div>
  );
}

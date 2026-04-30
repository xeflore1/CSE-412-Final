'use client'; // This marks the file as a Client Component

import Link from "next/link";
import { useRouter } from 'next/navigation'


function Login() {
    const router = useRouter()

    const handleLogin = async () => {
        // api logic here
        let user = "Staff"
        if (user == "Donor")
        {
            router.push("/donor")
        }
        else if (user == "Staff")
        {
            router.push("/staff")
        }
        else {
            return 400
        }
    }
    return <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition" onClick={handleLogin}>
        login
    </button>
};
export default function LoginUser() {

    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-3">
            <h1 className="text-2xl font-bold dark:text-white">Login User</h1>
            <p className="dark:text-gray-300">Login user form goes here</p>
            <Login />
            <Link href="/">
                <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
                    Back
                </button>
            </Link>
        </div>
    );
}

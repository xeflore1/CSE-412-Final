'use client';
import Link from "next/link";
import axios from "axios"; 
import { useRouter } from 'next/navigation'
import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  
  function Login() {
    const router = useRouter()

    const handleLogin = async () => {
      // TODO: call api so see if user with username and password credentials is valid
      try {
        // this is an example of how can api call can be done
        // const response = await axios.get(
        //   "http://127.0.0.1:5000/login",
        //   {
        //     username,
        //     password,
        //   }
        // );
        const userId = 1 // TODO: replace 1 with actual userId value
        // TODO: if user exists, see if userId exists in either Donor or Staff table
        const callSuccess = 200 // response code of api calls
        const userType = "Staff" 
        if (callSuccess === 200 && userType === "Donor")
        {
          router.push(`/donor?data=${userId}`)
        }
        else if (callSuccess === 200 && userType === "Staff")
        {
          router.push(`/staff?data=${userId}`)
        }
      }
      catch (error) {
        console.error("login failed:", error)
      }
    }
    return <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition" onClick={handleLogin}>
          Login
        </button>
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-3">
      <h1 className="text-2xl font-bold dark:text-white">Blood Bank</h1>
      <div className="flex flex-col gap-3 items-center justify-center">
        <input type="text" className="text-center border-2 border-blue-600 rounded" placeholder="Username" onChange={e => setUsername(e.target.value)}></input>
        <input type="text" className="text-center border-2 border-blue-600 rounded" placeholder="Password" onChange={e => setPassword(e.target.value)}></input>
        <Login />
      </div>
        <Link href="/create">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Create User
          </button>
        </Link>
    </div>
  );
}
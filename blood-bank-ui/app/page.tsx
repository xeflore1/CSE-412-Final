// blood-bank-ui/

'use client';
import Link from "next/link";
import axios from "axios"; 
import { useRouter } from 'next/navigation'
import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter()

  const handleLogin = async () => {
    try {
      // send the username, and password to the API call in the flask backend
      setErrorMsg("");
      const response = await axios.post(
        "http://127.0.0.1:5000/login",
        {
          username,
          password,
        }
      );

      // get the response data
      const { userId, userType } = response.data;

      // route users to either donor or staff depending on who they were determined by the API
      if (userType === "Donor") {
        router.push(`/donor?data=${userId}`)
      } 
      else if (userType === "Staff") {
        router.push(`/staff?data=${userId}`)
      }

      }
      // error in processing requests like maybe user didn't put any credentials
      catch (error) {
        const err = error as any; // cast the error so we don't get typing issues
        if (err.response) {
        // 401 authentication error
          if (err.response.status === 401) {
            setErrorMsg("Invalid username or password");
          } 
          else { // other issue
            setErrorMsg(err.response.data.error || "Something went wrong");
          }
        } 
        else {
        // server not reachable so prob like 500 error
        setErrorMsg("Cannot connect to server");
        }
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-3">
      <h1 className="text-2xl font-bold dark:text-white">Blood Bank</h1>

      <div className="flex flex-col gap-3 items-center justify-center">
        <input
          type="text"
          className="text-center border-2 border-blue-600 rounded"
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="text-center border-2 border-blue-600 rounded"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        {errorMsg && (
          <p className="text-red-500 text-sm">{errorMsg}</p>
        )}

        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>

      <Link href="/create">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Create User
        </button>
      </Link>
    </div>
  );
}